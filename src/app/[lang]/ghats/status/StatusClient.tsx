"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { fetchGhats, type GhatData } from "@/lib/sheetsData";

type CrowdLevel = "low" | "medium" | "high";

const translations = {
  te: { title: "రద్దీ స్థితి", subtitle: "ప్రత్యక్ష నవీకరణ", low: "తక్కువ", medium: "మధ్యస్థం", high: "ఎక్కువ", safe: "సురక్షితం", caution: "జాగ్రత్త", avoid: "నివారించండి" },
  hi: { title: "भीड़ स्थिति", subtitle: "लाइव अपडेट", low: "कम", medium: "मध्यम", high: "अधिक", safe: "सुरक्षित", caution: "सावधानी", avoid: "बचें" },
  en: { title: "Crowd Status", subtitle: "Live updates", low: "Low", medium: "Moderate", high: "High", safe: "Safe", caution: "Caution", avoid: "Avoid" },
};

type Lang = keyof typeof translations;

const crowdConfig: Record<CrowdLevel, { color: string; bg: string; border: string; ring: string }> = {
  low: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", ring: "bg-emerald-500" },
  medium: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", ring: "bg-amber-500" },
  high: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", ring: "bg-red-500" },
};

export default function StatusClient({ lang }: { lang: string }) {
  const l = (lang as Lang) || "te";
  const t = translations[l];
  const router = useRouter();
  const [ghats, setGhats] = useState<GhatData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGhats().then((data) => {
      setGhats(data);
      setLoading(false);
    });
  }, []);

  const statusLabel = (crowd: CrowdLevel) => {
    if (crowd === "low") return t.safe;
    if (crowd === "medium") return t.caution;
    return t.avoid;
  };

  const lowCount = ghats.filter((g) => g.crowd === "low").length;
  const medCount = ghats.filter((g) => g.crowd === "medium").length;
  const highCount = ghats.filter((g) => g.crowd === "high").length;

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

      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-3">
        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl p-3 border border-godavari-100 bg-white animate-pulse">
                <div className="h-3 bg-godavari-100 rounded w-1/3 mb-2" />
                <div className="h-4 bg-godavari-100 rounded w-3/4 mb-1" />
                <div className="h-3 bg-godavari-50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Summary Strip */}
            <div className="flex gap-2">
              <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-emerald-700">{lowCount}</p>
                <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">{t.safe}</p>
              </div>
              <div className="flex-1 bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-amber-700">{medCount}</p>
                <p className="text-[10px] font-semibold text-amber-600 mt-0.5">{t.caution}</p>
              </div>
              <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-red-700">{highCount}</p>
                <p className="text-[10px] font-semibold text-red-600 mt-0.5">{t.avoid}</p>
              </div>
            </div>

            {/* Ghat Status Grid */}
            <div className="grid grid-cols-2 gap-2">
              {ghats.map((ghat) => {
                const cfg = crowdConfig[ghat.crowd];
                return (
                  <div
                    key={ghat.id}
                    className={clsx(
                      "rounded-xl p-3 border",
                      cfg.bg,
                      cfg.border
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={clsx("w-3 h-3 rounded-full flex-shrink-0", cfg.ring)} />
                      <span className={clsx("text-xs font-bold", cfg.color)}>
                        {statusLabel(ghat.crowd)}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-godavari-950 leading-tight truncate">
                      {ghat.name[l]}
                    </p>
                    <p className="text-[11px] text-godavari-400 mt-0.5">{ghat.distance}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
