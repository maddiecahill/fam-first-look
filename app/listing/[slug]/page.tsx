import Link from "next/link";
import { notFound } from "next/navigation";
import FirstLookMap from "@/components/FirstLookMap";
import { getListing, loadListings } from "@/data/listings";

export const dynamic = "force-dynamic";
const money = (n:number) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(n);
const date = (value:string) => value ? new Intl.DateTimeFormat("en-US", { month:"long", day:"numeric", year:"numeric", timeZone:"UTC" }).format(new Date(`${value}T12:00:00Z`)) : "";

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [listing, all] = await Promise.all([getListing(slug), loadListings()]);
  if (!listing) notFound();
  const home = listing!;
  const similar = all.filter((x) => x.slug !== home.slug).slice(0, 3);
  const gallery = home.gallery.length ? home.gallery : [home.image];

  return <main className="min-h-screen bg-[#0f1720] text-white">
    <header className="border-b border-white/10 bg-[#0f1720]/95 px-5 py-5 md:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/" className="text-xs font-bold uppercase tracking-[.26em]">← FAM First Look</Link></div></header>
    {home.isDemo && <div className="bg-[#c6a45e]/15 px-5 py-3 text-center text-xs font-bold uppercase tracking-[.18em] text-[#e4cc98]">Demo Preview — not a property offered for sale</div>}

    <section className="px-4 py-5 md:px-8 md:py-8"><div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-2 md:grid-rows-2">
      <div className="overflow-hidden rounded-[2rem] md:row-span-2"><img src={gallery[0]} alt="" className="h-full min-h-[380px] w-full object-cover" /></div>
      {(gallery[1] || gallery[0]) && <div className="hidden overflow-hidden rounded-[2rem] md:block"><img src={gallery[1] || gallery[0]} alt="" className="h-full w-full object-cover" /></div>}
      {(gallery[2] || gallery[0]) && <div className="hidden overflow-hidden rounded-[2rem] md:block"><img src={gallery[2] || gallery[0]} alt="" className="h-full w-full object-cover" /></div>}
    </div></section>

    <section className="px-6 pb-16 pt-5 md:px-10"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#c6a45e] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.18em] text-[#111927]">First Look</span>{home.isDemo && <span className="rounded-full border border-white/15 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.18em]">Demo Preview</span>}</div>
        <p className="mt-7 text-4xl font-semibold md:text-6xl">{money(home.price)}</p>
        <h1 className="mt-4 text-2xl font-semibold md:text-4xl">{home.address}</h1><p className="mt-2 text-lg text-white/55">{home.city}, {home.state} {home.zip}</p>
        <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 border-y border-white/10 py-6 text-sm text-white/75"><span><b className="text-white">{home.beds}</b> Beds</span><span><b className="text-white">{home.baths}</b> Baths</span><span><b className="text-white">{home.sqft.toLocaleString()}</b> Sq Ft</span><span><b className="text-white">{home.lotSize}</b> Lot</span><span>{home.propertyType}</span></div>
        {home.goesActiveDate && <div className="mt-6 inline-flex rounded-2xl bg-[#c6a45e]/12 px-5 py-4 text-sm text-[#e2ca99]"><b className="mr-2">Scheduled active:</b> {date(home.goesActiveDate)}</div>}
        <div className="mt-10"><p className="text-xs font-bold uppercase tracking-[.26em] text-[#c6a45e]">About the Home</p><p className="mt-4 max-w-3xl text-base leading-8 text-white/68">{home.description}</p></div>
        <div className="mt-12"><p className="text-xs font-bold uppercase tracking-[.26em] text-[#c6a45e]">Location</p><div className="mt-5 overflow-hidden rounded-[2rem] border border-white/10 bg-[#131d29] p-2"><FirstLookMap listings={[home]} selectedSlug={home.slug} heightClass="h-[390px]" /></div></div>
      </div>
      <aside className="lg:sticky lg:top-6 lg:self-start"><div className="rounded-[2rem] border border-white/10 bg-[#152130] p-6 shadow-2xl"><p className="text-xs font-bold uppercase tracking-[.24em] text-[#c6a45e]">Private Showing</p><h2 className="mt-3 text-2xl font-semibold">See it before it&apos;s active.</h2><p className="mt-3 text-sm leading-6 text-white/60">Connect with FIRST AND MAIN for availability, access details and buyer representation.</p><a href="https://firstandmainrealestate.com/contact" className="mt-6 flex h-12 items-center justify-center rounded-full bg-[#c6a45e] px-5 text-sm font-semibold text-[#111927]">Schedule a Private Showing</a><a href="https://firstandmainrealestate.com/contact" className="mt-3 flex h-12 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-semibold">Contact FIRST AND MAIN</a><div className="mt-5 w-full text-center text-xs text-white/40">MLS {home.mlsNumber}</div></div></aside>
    </div></section>

    {similar.length > 0 && <section className="border-t border-white/10 bg-[#111927] px-6 py-16 md:px-10"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.24em] text-[#c6a45e]">More First Look</p><h2 className="mt-3 text-3xl font-semibold">Continue exploring</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{similar.map((x) => <Link href={`/listing/${x.slug}`} key={x.slug} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#172332]"><img src={x.image} alt="" className="aspect-[16/10] w-full object-cover" /><div className="p-5"><p className="text-xl font-semibold">{money(x.price)}</p><p className="mt-2 text-sm text-white/75">{x.address}</p><p className="text-xs text-white/45">{x.city}, {x.state}</p></div></Link>)}</div></div></section>}
  </main>;
}
