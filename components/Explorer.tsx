"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import FirstLookMap from "./FirstLookMap";
import type { FirstLookListing } from "@/data/listings";

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const shortDate = (value: string) => value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)) : "";

export default function Explorer({ listings }: { listings: FirstLookListing[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All Cities");
  const [price, setPrice] = useState("Any Price");
  const [beds, setBeds] = useState("Any Beds");
  const [type, setType] = useState("All Types");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(listings[0]?.slug ?? null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const cities = [...new Set(listings.map((x) => x.city))].sort();
  const types = [...new Set(listings.map((x) => x.propertyType).filter(Boolean))].sort();

  const filtered = useMemo(() => listings.filter((x) => {
    const q = query.trim().toLowerCase();
    const qMatch = !q || `${x.address} ${x.city} ${x.zip}`.toLowerCase().includes(q);
    const cityMatch = city === "All Cities" || x.city === city;
    const bedsMatch = beds === "Any Beds" || x.beds >= Number(beds);
    const typeMatch = type === "All Types" || x.propertyType === type;
    let priceMatch = true;
    if (price === "Under $1M") priceMatch = x.price < 1000000;
    if (price === "$1M–$1.5M") priceMatch = x.price >= 1000000 && x.price <= 1500000;
    if (price === "$1.5M+") priceMatch = x.price > 1500000;
    return qMatch && cityMatch && bedsMatch && typeMatch && priceMatch;
  }), [listings, query, city, price, beds, type]);

  const select = (slug: string) => {
    setSelectedSlug(slug);
    window.setTimeout(() => cardRefs.current[slug]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }), 120);
  };

  const clear = () => { setQuery(""); setCity("All Cities"); setPrice("Any Price"); setBeds("Any Beds"); setType("All Types"); };

  return (
    <section id="first-look-map" className="bg-[#111927] px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.28em] text-[#c6a45e]">Interactive First Look Map</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Explore what&apos;s next.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">Select a home on the map or browse the cards below.</p>
          </div>
          <div className="text-sm text-white/50">{filtered.length} {filtered.length === 1 ? "home" : "homes"}</div>
        </div>

        <div className="mt-9 grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[.035] p-4 md:grid-cols-5">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search address or city" className="h-12 rounded-full border border-white/10 bg-[#0f1720] px-5 text-sm text-white placeholder:text-white/35 md:col-span-2" />
          <select value={city} onChange={(e) => setCity(e.target.value)} className="h-12 rounded-full border border-white/10 bg-[#0f1720] px-4 text-sm text-white"><option>All Cities</option>{cities.map((x) => <option key={x}>{x}</option>)}</select>
          <select value={price} onChange={(e) => setPrice(e.target.value)} className="h-12 rounded-full border border-white/10 bg-[#0f1720] px-4 text-sm text-white"><option>Any Price</option><option>Under $1M</option><option>$1M–$1.5M</option><option>$1.5M+</option></select>
          <div className="flex gap-2">
            <select value={beds} onChange={(e) => setBeds(e.target.value)} className="min-w-0 flex-1 h-12 rounded-full border border-white/10 bg-[#0f1720] px-3 text-sm text-white"><option>Any Beds</option><option value="2">2+ Beds</option><option value="3">3+ Beds</option><option value="4">4+ Beds</option><option value="5">5+ Beds</option></select>
            <button onClick={clear} className="h-12 rounded-full border border-white/10 px-4 text-xs font-bold uppercase tracking-[.12em] text-white/70 hover:bg-white/10">Clear</button>
          </div>
          {types.length > 1 && <select value={type} onChange={(e) => setType(e.target.value)} className="h-12 rounded-full border border-white/10 bg-[#0f1720] px-4 text-sm text-white md:col-span-5"><option>All Types</option>{types.map((x) => <option key={x}>{x}</option>)}</select>}
        </div>

        {filtered.length ? <>
          <div className="mt-7 rounded-[2rem] border border-white/10 bg-[#131d29] p-2 md:p-4">
            <FirstLookMap listings={filtered} selectedSlug={selectedSlug} onSelect={select} />
          </div>
          <div className="hide-scrollbar mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3">
            {filtered.map((home) => (
              <div key={home.slug} ref={(el) => { cardRefs.current[home.slug] = el; }} onClick={() => select(home.slug)} className={`w-[84vw] max-w-[365px] shrink-0 snap-center cursor-pointer overflow-hidden rounded-[1.75rem] border bg-white text-[#111927] transition ${selectedSlug === home.slug ? "border-[#c6a45e] ring-2 ring-[#c6a45e]/35 shadow-2xl" : "border-white/10 hover:-translate-y-1"}`}>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <img src={home.image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="rounded-full bg-[#c6a45e] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.18em] text-[#111927]">First Look</span>
                    {home.isDemo && <span className="rounded-full bg-[#111927]/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.18em] text-white">Demo Preview</span>}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-2xl font-semibold">{money(home.price)}</p>
                  <h3 className="mt-2 text-base font-semibold leading-6">{home.address}</h3>
                  <p className="text-sm text-slate-500">{home.city}, {home.state} {home.zip}</p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600"><span><b>{home.beds}</b> beds</span><span><b>{home.baths}</b> baths</span><span><b>{home.sqft.toLocaleString()}</b> sq ft</span></div>
                  {home.goesActiveDate && <div className="mt-4 rounded-xl bg-[#f5f0e5] px-4 py-3 text-xs font-semibold text-[#725719]">Goes Active {shortDate(home.goesActiveDate)}</div>}
                  <Link href={`/listing/${home.slug}`} onClick={(e) => e.stopPropagation()} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#111927] px-5 text-sm font-semibold text-white">View Property</Link>
                </div>
              </div>
            ))}
          </div>
        </> : <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[.035] px-6 py-20 text-center"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#c6a45e]">No Matches</p><h3 className="mt-3 text-2xl font-semibold">Try widening your filters.</h3><button onClick={clear} className="mt-6 rounded-full bg-[#c6a45e] px-6 py-3 text-sm font-semibold text-[#111927]">Clear Filters</button></div>}
      </div>
    </section>
  );
}
