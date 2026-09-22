/**
 * FAM First Look — Google Sheets JSON feed
 * Bind this script to the "FAM First Look | Listing Feed" spreadsheet.
 * Sheet tab: Listings
 */
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Listings');
  if (!sheet) return json_({ listings: [], error: 'Listings tab not found.' });

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return json_({ listings: [] });

  const headers = values[0].map(String);
  const listings = values.slice(1)
    .filter(row => row.some(v => v !== ''))
    .map(row => Object.fromEntries(headers.map((h, i) => [h, row[i]])))
    .filter(x => bool_(x.showOnSite) && String(x.status).toLowerCase() === 'first look')
    .map(x => ({
      slug: String(x.slug || '').trim(),
      mlsNumber: String(x.mlsNumber || ''),
      status: String(x.status || 'First Look'),
      address: String(x.address || ''),
      city: String(x.city || ''),
      state: String(x.state || 'WA'),
      zip: String(x.zip || ''),
      price: num_(x.price),
      beds: num_(x.beds),
      baths: num_(x.baths),
      sqft: num_(x.sqft),
      lotSize: String(x.lotSize || ''),
      propertyType: String(x.propertyType || ''),
      description: String(x.description || ''),
      image: String(x.image || ''),
      gallery: String(x.gallery || '').split(/\s*[|,]\s*/).filter(Boolean),
      latitude: num_(x.latitude),
      longitude: num_(x.longitude),
      goesActiveDate: date_(x.goesActiveDate),
      listingAgent: String(x.listingAgent || ''),
      brokerage: String(x.brokerage || 'FIRST AND MAIN Real Estate'),
      listingUrl: String(x.listingUrl || ''),
      updatedAt: date_(x.updatedAt),
      isDemo: bool_(x.isDemo),
      showOnSite: true
    }))
    .filter(x => x.slug && x.address && x.city);

  return json_({ listings, updatedAt: new Date().toISOString() });
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
function num_(v) { const n = Number(v); return isNaN(n) ? 0 : n; }
function bool_(v) { return v === true || String(v).toLowerCase() === 'true' || String(v) === '1'; }
function date_(v) {
  if (!v) return '';
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v);
}
