"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import CrowdBadge from "@/components/ui/CrowdBadge";
import NavigateButton from "@/components/ui/NavigateButton";
import { fetchGhats, type GhatData } from "@/lib/sheetsData";
import { useUserLocation, getDistanceKm, formatDistance } from "@/lib/useUserLocation";

type CrowdLevel = "low" | "medium" | "high";

const translations = {
  te: {
    title: "ఘాట్లు",
    subtitle: "స్నాన ఘాట్లు",
    all: "అన్నీ",
    lowCrowd: "తక్కువ రద్దీ",
    nearest: "సమీపం",
    crowdLow: "తక్కువ",
    crowdMed: "మధ్యస్థం",
    crowdHigh: "ఎక్కువ",
    facilities: "సౌకర్యాలు",
    ghatsFound: "ఘాట్లు",
  },
  hi: {
    title: "घाट",
    subtitle: "स्नान घाट",
    all: "सभी",
    lowCrowd: "कम भीड़",
    nearest: "निकटतम",
    crowdLow: "कम",
    crowdMed: "मध्यम",
    crowdHigh: "अधिक",
    facilities: "सुविधाएं",
    ghatsFound: "घाट",
  },
  en: {
    title: "Ghats",
    subtitle: "Bathing Ghats",
    all: "All",
    lowCrowd: "Low Crowd",
    nearest: "Nearest",
    crowdLow: "Low",
    crowdMed: "Moderate",
    crowdHigh: "Crowded",
    facilities: "Facilities",
    ghatsFound: "ghats",
  },
};

type Lang = keyof typeof translations;
type Filter = "all" | "low" | "nearest";

const crowdLabels: Record<Lang, Record<CrowdLevel, string>> = {
  te: { low: "తక్కువ", medium: "మధ్యస్థం", high: "ఎక్కువ" },
  hi: { low: "कम", medium: "मध्यम", high: "अधिक" },
  en: { low: "Low", medium: "Moderate", high: "Crowded" },
};

export default function GhatsClient({ lang }: { lang: string }) {
  const l = (lang as Lang) || "te";
  const t = translations[l];
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [ghats, setGhats] = useState<GhatData[]>([]);
  const [loading, setLoading] = useState(true);
  const userLoc = useUserLocation();

  useEffect(() => {
    fetchGhats().then((data) => {
      setGhats(data);
      setLoading(false);
    });
  }, []);

  // Add real-time distances if GPS available
  const ghatsWithDist = ghats.map((g) => ({
    ...g,
    realDist: userLoc ? getDistanceKm(userLoc.lat, userLoc.lng, g.lat, g.lng) : g.distanceNum,
    realDistLabel: userLoc ? formatDistance(getDistanceKm(userLoc.lat, userLoc.lng, g.lat, g.lng)) : g.distance,
  }));

  const filtered = ghatsWithDist
    .filter((g) => {
      if (filter === "low") return g.crowd === "low";
      return true;
    })
    .sort((a, b) => {
      if (filter === "nearest") return a.realDist - b.realDist;
      return 0;
    });

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t.all },
    { key: "low", label: t.lowCrowd },
    { key: "nearest", label: t.nearest },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden bg-godavari-50">
      {/* Header */}
      <header
        className="sticky top-0 z-30 safe-top"
        style={{
          background: "linear-gradient(135deg, #0f2847 0%, #1a3f6e 100%)",
          boxShadow: "0 2px 16px rgba(15,40,71,0.35)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
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
          <span className="text-godavari-300 text-xs font-medium">
            {filtered.length} {t.ghatsFound}
          </span>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={clsx(
                "px-4 py-2 rounded-full text-sm font-semibold transition-all",
                filter === f.key
                  ? "bg-godavari-700 text-white shadow-md shadow-godavari-700/25"
                  : "bg-white text-godavari-700 border border-godavari-200 hover:bg-godavari-50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ghat List */}
      <main className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-2">
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-3.5 animate-pulse" style={{ border: "1px solid var(--godavari-100)" }}>
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-godavari-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-godavari-100 rounded w-3/4" />
                <div className="h-3 bg-godavari-50 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
        {!loading && filtered.map((ghat) => (
          <div
            key={ghat.id}
            className="bg-white rounded-2xl p-3.5 active:scale-[0.98] transition-transform cursor-pointer"
            style={{
              border: "1px solid var(--godavari-100)",
              boxShadow: "0 2px 12px rgba(15,40,71,0.05)",
            }}
          >
            <div className="flex items-start gap-3">
              {/* Temple icon with crowd-colored ring */}
              <div
                className={clsx(
                  "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border-2",
                  ghat.crowd === "low" && "bg-emerald-50 border-emerald-300",
                  ghat.crowd === "medium" && "bg-amber-50 border-amber-300",
                  ghat.crowd === "high" && "bg-red-50 border-red-300"
                )}
              >
                <span className="text-xl">🛕</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-godavari-950 leading-tight truncate">
                      {ghat.name[l]}
                    </p>
                    <p className="text-[11px] text-godavari-400 mt-0.5">
                      {ghat.area[l]} • {ghat.realDistLabel}
                    </p>
                  </div>
                  <CrowdBadge level={ghat.crowd} label={crowdLabels[l][ghat.crowd]} size="sm" />
                </div>

                {/* Facilities + Navigate */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    {ghat.facilities.map((f, i) => (
                      <span
                        key={i}
                        className="w-7 h-7 rounded-lg bg-godavari-50 flex items-center justify-center text-sm border border-godavari-100"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  <NavigateButton lat={ghat.lat} lng={ghat.lng} lang={lang} compact />
                </div>
              </div>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-godavari-400 py-8">No ghats found</p>
        )}
      </main>
    </div>
  );
}
