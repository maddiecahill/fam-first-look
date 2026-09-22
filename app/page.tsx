import Explorer from "@/components/Explorer";
import { loadListings } from "@/data/listings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const listings = await loadListings();
  const hasDemo = listings.some((x) => x.isDemo);
  return (
    <main className="min-h-screen bg-[#0f1720] text-white">
      <section className="relative min-h-[560px] overflow-hidden border-b border-white/10">
        <img src="https://raw.githubusercontent.com/maddiecahill/fam-grand-tour/main/public/public-background.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(198,164,94,.17),transparent_30%),linear-gradient(135deg,rgba(15,23,32,.94),rgba(23,37,54,.78)_55%,rgba(15,23,32,.95))]" />
        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-6 py-20 md:px-10">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-[#c6a45e]">Exclusive Property Discovery</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold tracking-[-.035em] md:text-8xl">FAM FIRST LOOK</h1>
          <p className="mt-5 text-2xl font-light text-white/90 md:text-4xl">See what&apos;s next, first.</p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 md:text-lg">A refined look at homes available through NWMLS First Look and authorized for public display.</p>
          <div className="mt-10 flex flex-wrap gap-3"><a href="#first-look-map" className="rounded-full bg-[#c6a45e] px-7 py-3.5 text-sm font-semibold text-[#111927]">Explore First Look</a><a href="https://firstandmainrealestate.com/contact" className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold">Talk to a FAM Broker</a></div>
        </div>
      </section>

      {hasDemo && <div className="border-b border-[#c6a45e]/20 bg-[#c6a45e]/10 px-6 py-3 text-center text-xs font-semibold uppercase tracking-[.18em] text-[#e7d4a6]">Development preview — demo inventory only. Live First Look data is not connected yet.</div>}
      <Explorer listings={listings} />

      <section className="border-y border-white/10 bg-[#0f1720] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[.28em] text-[#c6a45e]">What is First Look?</p><h2 className="mt-4 text-3xl font-semibold md:text-5xl">Early visibility. Thoughtful access.</h2></div>
          <div className="space-y-5 text-sm leading-7 text-white/65 md:text-base"><p>First Look gives buyers and brokers an earlier view of select homes before they transition to active market status.</p><p>Not every First Look listing can be displayed publicly. FAM First Look shows only inventory authorized for public/IDX distribution.</p></div>
        </div>
      </section>

      <footer className="bg-[#0b121a] px-6 py-12 text-white/55 md:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between"><div><div className="text-sm font-bold uppercase tracking-[.28em] text-white">FIRST AND MAIN</div><div className="mt-2 text-xs uppercase tracking-[.2em] text-[#c6a45e]">Real Estate</div></div><div className="text-xs">FAM First Look · Publicly authorized inventory only</div></div></footer>
    </main>
  );
}
