export type FirstLookListing = {
  slug: string;
  mlsNumber: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: string;
  propertyType: string;
  description: string;
  image: string;
  gallery: string[];
  latitude: number;
  longitude: number;
  goesActiveDate: string;
  listingAgent: string;
  brokerage: string;
  listingUrl: string;
  updatedAt: string;
  isDemo: boolean;
  showOnSite?: boolean;
};

const raw = "https://raw.githubusercontent.com/maddiecahill/fam-grand-tour/main/public";

export const demoListings: FirstLookListing[] = [
  {
    slug: "demo-woodinville-residence",
    mlsNumber: "DEMO-001",
    status: "First Look",
    address: "12345 Demo Lane",
    city: "Woodinville",
    state: "WA",
    zip: "98072",
    price: 1649000,
    beds: 4,
    baths: 3.5,
    sqft: 3420,
    lotSize: "0.42 acres",
    propertyType: "Single Family",
    description: "This is a clearly labeled demo record used to preview the FAM First Look experience before the authorized live feed is connected. It is not a property being offered for sale.",
    image: `${raw}/16005.jpg`,
    gallery: [`${raw}/16005.jpg`, `${raw}/22917.jpg`, `${raw}/312.jpg`],
    latitude: 47.7543,
    longitude: -122.1635,
    goesActiveDate: "2026-09-28",
    listingAgent: "Demo Preview",
    brokerage: "FIRST AND MAIN Real Estate",
    listingUrl: "",
    updatedAt: "2026-09-21",
    isDemo: true,
    showOnSite: true
  },
  {
    slug: "demo-snohomish-residence",
    mlsNumber: "DEMO-002",
    status: "First Look",
    address: "4567 Preview Avenue",
    city: "Snohomish",
    state: "WA",
    zip: "98290",
    price: 1095000,
    beds: 4,
    baths: 2.75,
    sqft: 2810,
    lotSize: "9,850 sq ft",
    propertyType: "Single Family",
    description: "This demo listing exists only to demonstrate search, map interaction, filters and the individual listing page. It is not a property being offered for sale.",
    image: `${raw}/312.jpg`,
    gallery: [`${raw}/312.jpg`, `${raw}/6920.jpg`, `${raw}/11420.jpg`],
    latitude: 47.9129,
    longitude: -122.0982,
    goesActiveDate: "2026-09-30",
    listingAgent: "Demo Preview",
    brokerage: "FIRST AND MAIN Real Estate",
    listingUrl: "",
    updatedAt: "2026-09-21",
    isDemo: true,
    showOnSite: true
  },
  {
    slug: "demo-bothell-residence",
    mlsNumber: "DEMO-003",
    status: "First Look",
    address: "7890 First Look Drive",
    city: "Bothell",
    state: "WA",
    zip: "98021",
    price: 1325000,
    beds: 5,
    baths: 3,
    sqft: 3180,
    lotSize: "7,600 sq ft",
    propertyType: "Single Family",
    description: "This is development-only demo inventory. It will disappear automatically when the authorized First Look feed is connected.",
    image: `${raw}/4106.jpg`,
    gallery: [`${raw}/4106.jpg`, `${raw}/22621.jpg`, `${raw}/22917.jpg`],
    latitude: 47.7623,
    longitude: -122.2054,
    goesActiveDate: "2026-10-02",
    listingAgent: "Demo Preview",
    brokerage: "FIRST AND MAIN Real Estate",
    listingUrl: "",
    updatedAt: "2026-09-21",
    isDemo: true,
    showOnSite: true
  }
];

function normalizeListing(value: unknown): FirstLookListing | null {
  if (!value || typeof value !== "object") return null;
  const x = value as Record<string, unknown>;
  if (!x.slug || !x.address || !x.city) return null;
  return {
    slug: String(x.slug),
    mlsNumber: String(x.mlsNumber ?? ""),
    status: String(x.status ?? "First Look"),
    address: String(x.address),
    city: String(x.city),
    state: String(x.state ?? "WA"),
    zip: String(x.zip ?? ""),
    price: Number(x.price ?? 0),
    beds: Number(x.beds ?? 0),
    baths: Number(x.baths ?? 0),
    sqft: Number(x.sqft ?? 0),
    lotSize: String(x.lotSize ?? ""),
    propertyType: String(x.propertyType ?? ""),
    description: String(x.description ?? ""),
    image: String(x.image ?? ""),
    gallery: Array.isArray(x.gallery) ? x.gallery.map(String) : [],
    latitude: Number(x.latitude ?? 0),
    longitude: Number(x.longitude ?? 0),
    goesActiveDate: String(x.goesActiveDate ?? ""),
    listingAgent: String(x.listingAgent ?? ""),
    brokerage: String(x.brokerage ?? "FIRST AND MAIN Real Estate"),
    listingUrl: String(x.listingUrl ?? ""),
    updatedAt: String(x.updatedAt ?? ""),
    isDemo: Boolean(x.isDemo),
    showOnSite: x.showOnSite === undefined ? true : Boolean(x.showOnSite)
  };
}

export async function loadListings(): Promise<FirstLookListing[]> {
  const endpoint = process.env.FIRST_LOOK_DATA_URL;
  if (!endpoint) return demoListings;
  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) throw new Error(`Feed responded ${response.status}`);
    const payload = await response.json();
    const source = Array.isArray(payload) ? payload : payload?.listings;
    if (!Array.isArray(source)) throw new Error("Feed payload did not contain a listings array");
    const listings = source.map(normalizeListing).filter((x): x is FirstLookListing => Boolean(x));
    return listings.filter((x) => x.showOnSite !== false && x.status.toLowerCase() === "first look");
  } catch (error) {
    console.error("FAM First Look feed fallback", error);
    return demoListings;
  }
}

export async function getListing(slug: string) {
  const listings = await loadListings();
  return listings.find((x) => x.slug === slug);
}
