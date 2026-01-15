# Strong Selects - Wholesale Catalog

A premium, mobile-first wholesale catalog and request system for Strong Selects.

## Features
- **Black Glass UI**: Luxury aesthetic with dark backgrounds and emerald accents.
- **Live CSV Data**: Content managed via Google Sheets (proxy setup included).
- **Secure**: All cost fields (`cost_lb`, `cost_oz`) are stripped server-side before reaching the client.
- **Request Builder**: "Soft order" cart that generates a formatted summary.
- **Responsive**: Optimised for mobile usage.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root:
   ```bash
   # URL to your published Google Sheet CSV
   NEXT_PUBLIC_CATALOG_CSV_URL="https://your-google-sheet-url.com/pub?output=csv"
   
   # Optional: API Endpoint for requests (if you have a backend automation)
   NEXT_PUBLIC_REQUEST_ENDPOINT_URL=""
   
   # Fallback Email for Mailto requests
   NEXT_PUBLIC_REQUEST_EMAIL="strongselects@gmail.com"

   # Google Sheets Orders API (Service Account)
   GOOGLE_SERVICE_ACCOUNT_EMAIL="strong-orders@strong-selects-orders.iam.gserviceaccount.com"
   GOOGLE_SHEET_ID="1HSXn7KDWq-GGXSuqEEKcp3B3fuDlFbVQV3kjwiFMZaQ"
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----"
   ```
   
   > **Demo Mode**: To test with the included demo data, set the URL to your local dev URL:
   > `NEXT_PUBLIC_CATALOG_CSV_URL="http://localhost:3000/demo.csv"`

3. **Run Locally**
   ```bash
   npm run dev
   ```

## Creating the Google Sheet
1. Create a sheet with the following headers (order doesn't matter, but names must match):
   `tier`, `strain_name`, `batch_ID`, `type`, `ratio`, `lineage`, `effects`, `coa_total_pct`, `media_photo_urls`, `photo_url`, `coa_url`, `notes`, `live_qty_g`, `threshold_over_g`, `price_lb`, `price_qp`, `price_oz`.
   *(Internal cost fields like `cost_lb` can exist but will be hidden)*.
2. File > Share > Publish to Web.
3. Select the specific tab and format "Comma-separated values (.csv)".
4. Copy the URL and paste into `.env.local`.

## Deployment
Recommended: **Vercel**.
1. Import project.
2. Add the Environment Variables in Vercel Project Settings.
3. Deploy.
