import { armKillSwitch, disarmKillSwitch } from './utils/timeoutManager.js';
import { Actor, log } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

await Actor.init();

try {
    const input = await Actor.getInput();
    const { 
        startUrls = [],
        maxLeads = 100,
        proxyConfiguration 
    } = input || {};

    const proxyConfig = await Actor.createProxyConfiguration(proxyConfiguration || { 
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL'],
        apifyProxyCountry: 'IN'
    });

    log.info(`Searching TradeIndia for sellers...`);
    await Actor.charge({ eventName: 'apify-actor-start', count: 1 });

    let extractedCount = 0;

    const crawler = new PlaywrightCrawler({
        proxyConfiguration: proxyConfig,
        maxConcurrency: 2,
        navigationTimeoutSecs: 90,
        browserPoolOptions: {
            useFingerprints: true,
        },
        async requestHandler({ page, request, log, enqueueLinks }) {
            log.info(`Parsing directory page: ${request.url}`);
            
            await page.waitForSelector('.seller-card, .product-item, .list-wrapper, .company-listing', { timeout: 30000 }).catch(() => log.warning('Timeout waiting for DOM.'));

            const title = await page.title();
            if (title.includes('Just a moment') || title.includes('Access Denied')) {
                throw new Error('Blocked by WAF. Retrying with residential proxy...');
            }

            // Scroll down a bit to trigger lazy loading
            await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
            await page.waitForTimeout(2000);

            const items = await page.$$('.seller-card, .product-item, .list-wrapper, .company-listing, .ti-seller-box');
            
            for (const item of items) {
                if (extractedCount >= maxLeads) break;

                const nameElement = await item.$('.company-name, .co-name, h2, h3, .seller-name');
                if (!nameElement) continue;
                const companyName = (await nameElement.innerText()).trim();

                const addressElement = await item.$('.address, .location, .comp-loc, .seller-loc');
                const address = addressElement ? (await addressElement.innerText()).trim().replace(/\s+/g, ' ') : '';

                // Business Type (Manufacturer, Wholesaler etc)
                const typeElement = await item.$('.business-type, .company-type, .seller-type');
                const sellerType = typeElement ? (await typeElement.innerText()).trim() : '';

                // Trust Seal / Verification
                const sealElement = await item.$('.trust-seal, .verified-icon, .super-seller, img[alt*="Super Seller"], img[alt*="Verified"]');
                const trustSeal = sealElement ? 'Verified / Super Seller' : '';

                // Phones
                const phoneElement = await item.$('a[href^="tel:"], .phone, .mobile-number, .call-btn');
                let phone = '';
                if (phoneElement) {
                    const href = await phoneElement.getAttribute('href');
                    if (href && href.startsWith('tel:')) {
                        phone = href.replace('tel:', '').trim();
                    } else {
                        phone = (await phoneElement.innerText()).trim();
                    }
                }
                
                // URL
                const urlElement = await item.$('.company-name a, .seller-name a, h2 a, h3 a');
                const listingUrl = urlElement ? await urlElement.getAttribute('href') : '';
                const fullListingUrl = listingUrl && !listingUrl.startsWith('http') ? new URL(listingUrl, 'https://www.tradeindia.com').toString() : listingUrl;

                if (companyName && companyName.length > 1) {
                    const record = {
                        companyName,
                        sellerType,
                        address,
                        phone,
                        trustSeal,
                        listingUrl: fullListingUrl,
                        scrapedAt: new Date().toISOString()
                    };

                    await Actor.pushData(record);
                    await Actor.charge({ eventName: 'lead-extracted', count: 1 });
                    extractedCount++;
                    log.info(`✅ Extracted: ${companyName} (${extractedCount}/${maxLeads})`);
                }
            }

            // Pagination
            if (extractedCount < maxLeads) {
                const hasNextPage = await page.$('.pagination a.next, a.next-page, a:has-text("Next")');
                if (hasNextPage) {
                    const nextUrl = await hasNextPage.getAttribute('href');
                    if (nextUrl) {
                        const absoluteUrl = new URL(nextUrl, 'https://www.tradeindia.com').toString();
                        log.info(`Enqueuing next page: ${absoluteUrl}`);
                        await enqueueLinks({
                            urls: [absoluteUrl],
                        });
                    }
                } else {
                    // Try to increment page query param if we're on the search page
                    const currentUrl = new URL(request.url);
                    if(currentUrl.pathname.includes('search.html')) {
                        let pageNum = parseInt(currentUrl.searchParams.get('pageno')) || 1;
                        if(pageNum < 10) { 
                            currentUrl.searchParams.set('pageno', (pageNum + 1).toString());
                            log.info(`Attempting synthetic pagination to: ${currentUrl.toString()}`);
                            await enqueueLinks({
                                urls: [currentUrl.toString()],
                            });
                        }
                    }
                }
            }
        },
        async failedRequestHandler({ request, log }) {
            log.error(`Failed request: ${request.url}`);
        }
    });

    if (startUrls && startUrls.length > 0) {
        for (const req of startUrls) {
            await crawler.addRequests([{ url: typeof req === 'string' ? req : req.url }]);
        }
    } else {
        log.warning('No startUrls provided. Using default.');
        await crawler.addRequests([{ url: 'https://www.tradeindia.com/search.html?keyword=surgical+instruments' }]);
    }

    armKillSwitch(crawler);
    await crawler.run();
    disarmKillSwitch();

    log.info(`🎉 Done! Extracted ${extractedCount} TradeIndia seller leads.`);

} catch (error) {
    console.error('CRASH:', error);
    throw error;
} finally {
    await Actor.exit();
}
