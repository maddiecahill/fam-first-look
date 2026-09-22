# FAM First Look

A FIRST AND MAIN Real Estate property discovery experience inspired by the FAM Grand Tour map design.

## What is included
- Luxury navy/gold responsive landing page
- Interactive OpenFreeMap/MapLibre map with FAM-style gold house pins
- Search + city, price, beds and property-type filters
- Synced map pins and horizontally scrolling listing cards
- Dynamic individual listing pages at `/listing/[slug]`
- Gallery, property facts, active date, map, private-showing CTA, similar First Look homes
- Clearly labeled demo inventory fallback
- Server-side data adapter using `FIRST_LOOK_DATA_URL`
- Google Apps Script JSON feed in `scripts/Code.gs`

## Data source already prepared
A Google Sheet named **FAM First Look | Listing Feed** has been created with the `Listings` tab and these headers:
`slug, mlsNumber, status, address, city, state, zip, price, beds, baths, sqft, lotSize, propertyType, description, image, gallery, latitude, longitude, goesActiveDate, listingAgent, brokerage, listingUrl, updatedAt, showOnSite, isDemo`

Only rows where `status = First Look` and `showOnSite = TRUE` are returned by the Apps Script feed.

## Connect the Google Sheet
1. Open the FAM First Look listing-feed Sheet.
2. Extensions → Apps Script.
3. Replace the default script with `scripts/Code.gs`.
4. Deploy → New deployment → Web app.
5. Execute as: **Me**.
6. Who has access: **Anyone** (the endpoint only returns rows explicitly marked Show on Site).
7. Copy the `/exec` Web App URL.
8. In Vercel/Replit environment variables set:
   `FIRST_LOOK_DATA_URL=https://script.google.com/macros/s/.../exec`
9. Redeploy/restart.

Until this variable is present, the app displays 3 unmistakably labeled **Demo Preview** cards.

## Local run
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy to Vercel
Import the project folder/repository into Vercel. Framework detection should identify Next.js automatically. No Mapbox key is required; the map uses MapLibre with OpenFreeMap tiles.

## Branding
Colors intentionally match the Grand Tour direction:
- Navy: `#0f1720` / `#111927`
- Gold: `#c6a45e`

The property photographs in the demo records are referenced from the existing public `fam-grand-tour` repository only as development imagery. Replace/remove the demo records when the live feed is connected.
