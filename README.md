# India TradeIndia Seller Scraper

**Extract verified manufacturers, suppliers, and exporters from TradeIndia.**

The India TradeIndia Seller Scraper is a premium data extraction tool built to rapidly scale your B2B supply chain operations. TradeIndia is one of the largest and most authoritative B2B portals connecting Indian manufacturers and wholesale suppliers globally.

## What can India TradeIndia Scraper do?

- ✅ **Extract Premium B2B Leads** - Get company names, verified physical addresses, and contact details.
- ✅ **Identify Seller Types** - Differentiate between Manufacturers, Wholesalers, and Exporters.
- ✅ **Source Products** - Find reliable suppliers for specific product categories (e.g., surgical instruments, auto parts).
- ✅ **Export formats** - Download data in JSON, CSV, Excel, or HTML formats.
- ✅ **Integrations** - Connect seamlessly with API, webhooks, Make, or Zapier.
- ✅ **No coding required** - Use our simple interface to start scraping immediately.

## Why scrape TradeIndia?

TradeIndia is a goldmine for supply chain professionals and B2B sales:

- 🎯 **B2B Sourcing** - Find new manufacturing partners in India and negotiate direct wholesale rates.
- 📊 **Logistics Sales** - Pitch shipping, freight forwarding, and inventory management software to exporters.
- 📍 **Market Research** - Analyze the density of specific manufacturing hubs in India.

## What data can you extract?

| Data Field | Description | Example |
|------------|-------------|---------|
| **companyName** | The name of the business | "Apex Auto Parts Pvt Ltd" |
| **sellerType** | Type of seller | "Manufacturer, Wholesaler" |
| **address** | The full address | "Okhla Industrial Area, New Delhi" |
| **phone** | Direct contact number | "+91 9876543210" |
| **trustSeal** | TradeIndia verification seal | "Super Seller" |
| **listingUrl** | Link to the directory listing | "https://www.tradeindia.com/..." |

## How to scrape TradeIndia data

1. **Click "Try for free"** to start using the actor.
2. **Enter your input** - Provide a keyword (e.g., "auto parts") and location (e.g., "Delhi" or "India").
3. **Configure options** - Set the maximum number of leads you want to extract.
4. **Start the scraper** - Click Start and let the actor do the work.
5. **Download results** - Export your leads as JSON, CSV, or Excel.

## Input

Configure the scraper with these key settings:
- **Keyword** - The specific product or industry (e.g., 'surgical instruments', 'auto parts', 'chemicals').
- **Location** - The Indian City, or type 'India' for national results (e.g., 'Delhi', 'Mumbai', 'India').
- **Maximum Leads** - The total number of records to extract.
- **Proxy Configuration** - Apify Residential Proxy (India targeted) is highly required.

## Output

You can download data in multiple formats:
- **JSON** - For developers and programmatic access
- **CSV** - For easy import into Excel or CRM systems
- **Excel** - Ready-to-use spreadsheet

### Output example

```json
{
    "companyName": "Apex Auto Parts Pvt Ltd",
    "sellerType": "Manufacturer",
    "address": "Okhla Industrial Area, New Delhi",
    "phone": "+919876543210",
    "trustSeal": "Super Seller",
    "listingUrl": "https://www.tradeindia.com/...",
    "scrapedAt": "2026-07-02T15:00:00Z"
}
```

## How much does it cost?

This actor uses a Pay-Per-Event (PPE) pricing model tailored for premium B2B manufacturing leads:
- **Base Fee**: $0.25 per start
- **Lead Fee**: $2.50 per 1,000 wholesale/seller leads extracted ($0.0025 per lead)

**Free tier**: Apify provides $5 in free monthly credits, allowing you to extract over 1,800 premium manufacturer leads for free!

## Is it legal to scrape?

Yes, scraping publicly available data is generally legal. This Actor only extracts public information.

**Best practices**:
- Use the data ethically for B2B outreach.
- Respect the target site's Terms of Service.
- Ensure compliance with data privacy regulations when handling contact information.

## Integrations

Connect with 1000+ apps:
- **Google Sheets** - Auto-update spreadsheets with new leads.
- **Slack** - Get notifications when scraping finishes.
- **Webhooks** - Send data directly to your CRM.
- **API** - Programmatic access for developers.

---

**License**: Apache-2.0 | **Version**: 1.0.0
