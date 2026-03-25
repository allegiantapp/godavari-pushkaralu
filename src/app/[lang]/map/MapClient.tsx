"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

type FilterKey = "all" | "ghat" | "food" | "toilet" | "water" | "medical" | "transport";

const translations = {
  te: {
    title: "మ్యాప్",
    subtitle: "స్థానాలు & దిశలు",
    all: "అన్నీ",
    ghat: "ఘాట్లు",
    food: "ఆహారం",
    toilet: "టాయిలెట్",
    water: "నీరు",
    medical: "వైద్యం",
    transport: "రవాణా",
  },
  hi: {
    title: "नक्शा",
    subtitle: "स्थान और दिशाएं",
    all: "सभी",
    ghat: "घाट",
    food: "भोजन",
    toilet: "शौचालय",
    water: "पानी",
    medical: "चिकित्सा",
    transport: "परिवहन",
  },
  en: {
    title: "Map",
    subtitle: "Locations & Directions",
    all: "All",
    ghat: "Ghats",
    food: "Food",
    toilet: "Toilet",
    water: "Water",
    medical: "Medical",
    transport: "Transport",
  },
};

type Lang = keyof typeof translations;

const filterOptions: { key: FilterKey; categories: string[] }[] = [
  { key: "all", categories: [] },
  { key: "ghat", categories: ["ghat"] },
  { key: "food", categories: ["food"] },
  { key: "toilet", categories: ["toilet"] },
  { key: "water", categories: ["water"] },
  { key: "medical", categories: ["medical"] },
  { key: "transport", categories: ["bus", "auto", "shuttle", "boat", "parking"] },
];

export default function MapClient({ lang }: { lang: string }) {
  const l = (lang as Lang) || "te";
  const t = translations[l];
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>("all");

  const activeCategories = filterOptions.find((f) => f.key === filter)?.categories || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-godavari-50" style={{ height: "100dvh" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 safe-top flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, #0f2847 0%, #1a3f6e 100%)",
          boxShadow: "0 2px 16px rgba(15,40,71,0.35)",
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-white transition-colors"
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">{t.title}</h1>
            <p className="text-godavari-300 text-xs">{t.subtitle}</p>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="px-3 py-2 flex-shrink-0 bg-white border-b border-godavari-100">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
          {filterOptions.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={clsx(
                "px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0",
                filter === f.key
                  ? "bg-godavari-700 text-white shadow-md shadow-godavari-700/25"
                  : "bg-godavari-50 text-godavari-700 border border-godavari-200"
              )}
            >
              {t[f.key as keyof typeof t]}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView lang={l} activeCategories={activeCategories} />
      </div>
    </div>
  );
}
