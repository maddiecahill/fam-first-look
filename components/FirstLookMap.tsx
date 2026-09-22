"use client";

import { useEffect, useRef } from "react";
import maplibregl, { LngLatBounds } from "maplibre-gl";
import type { FirstLookListing } from "@/data/listings";

type Props = {
  listings: FirstLookListing[];
  selectedSlug?: string | null;
  onSelect?: (slug: string) => void;
  heightClass?: string;
};

const gold = "#c6a45e";

export default function FirstLookMap({ listings, selectedSlug, onSelect, heightClass = "h-[470px] md:h-[620px]" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/positron",
      center: [-122.16, 47.82],
      zoom: 8.8,
      attributionControl: false
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};
    const bounds = new LngLatBounds();

    listings.forEach((home) => {
      if (!Number.isFinite(home.latitude) || !Number.isFinite(home.longitude)) return;
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", `Select ${home.address}`);
      el.style.width = home.slug === selectedSlug ? "38px" : "32px";
      el.style.height = home.slug === selectedSlug ? "38px" : "32px";
      el.style.borderRadius = "999px";
      el.style.background = gold;
      el.style.border = "2px solid white";
      el.style.boxShadow = home.slug === selectedSlug ? "0 0 0 9px rgba(198,164,94,.24)" : "0 0 0 5px rgba(198,164,94,.14)";
      el.style.cursor = "pointer";
      el.style.display = "grid";
      el.style.placeItems = "center";
      el.style.overflow = "hidden";
      const pin = document.createElement("img");
      pin.src = "https://raw.githubusercontent.com/maddiecahill/fam-grand-tour/main/public/fam-pin-logo.png";
      pin.alt = "";
      pin.style.width = home.slug === selectedSlug ? "21px" : "18px";
      pin.style.height = home.slug === selectedSlug ? "21px" : "18px";
      pin.style.objectFit = "contain";
      el.appendChild(pin);
      el.onclick = () => onSelect?.(home.slug);

      const price = home.price ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(home.price) : "Price TBD";
      const popup = new maplibregl.Popup({ offset: 18, closeButton: false, maxWidth: "280px" }).setHTML(`
        <div style="color:#111927;font-family:Arial,sans-serif;line-height:1.35">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:#8a6b16;font-weight:800;margin-bottom:6px">${home.isDemo ? "Demo Preview" : "First Look"}</div>
          <div style="font-size:16px;font-weight:800">${price}</div>
          <div style="font-size:13px;color:#475569;margin-top:4px">${home.address}<br/>${home.city}, ${home.state}</div>
        </div>`);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([home.longitude, home.latitude])
        .setPopup(popup)
        .addTo(map);
      markersRef.current[home.slug] = marker;
      bounds.extend([home.longitude, home.latitude]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 65, maxZoom: listings.length === 1 ? 13 : 11, duration: 700 });
    }
  }, [listings, selectedSlug, onSelect]);

  useEffect(() => {
    if (!selectedSlug || !mapRef.current) return;
    const home = listings.find((x) => x.slug === selectedSlug);
    if (!home) return;
    mapRef.current.flyTo({ center: [home.longitude, home.latitude], zoom: 12, duration: 700 });
    markersRef.current[selectedSlug]?.togglePopup();
  }, [selectedSlug, listings]);

  return <div ref={containerRef} className={`w-full overflow-hidden rounded-[1.5rem] ${heightClass}`} />;
}
