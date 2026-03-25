"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { fetchAlerts, type AlertData } from "@/lib/sheetsData";

type AlertType = "safety" | "crowd" | "weather" | "info";

const alertConfig: Record<AlertType, { icon: string; color: string; bg: string; border: string }> = {
  safety: { icon: "🛡️", color: "text-blue-800", bg: "bg-blue-50", border: "border-blue-200" },
  crowd: { icon: "👥", color: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200" },
  weather: { icon: "🌧️", color: "text-sky-800", bg: "bg-sky-50", border: "border-sky-200" },
  info: { icon: "📢", color: "text-godavari-800", bg: "bg-godavari-50", border: "border-godavari-200" },
};

const translations = {
  te: {
    title: "హెచ్చరికలు",
    subtitle: "ప్రత్యక్ష నవీకరణలు",
    all: "అన్నీ",
    safety: "భద్రత",
    crowd: "రద్దీ",
    weather: "వాతావరణం",
    ago: "క్రితం",
    noAlerts: "ప్రస్తుతం హెచ్చరికలు లేవు",
  },
  hi: {
    title: "अलर्ट",
    subtitle: "लाइव अपडेट",
    all: "सभी",
    safety: "सुरक्षा",
    crowd: "भीड़",
    weather: "मौसम",
    ago: "पहले",
    noAlerts: "वर्तमान में कोई अलर्ट नहीं",
  },
  en: {
    title: "Alerts",
    subtitle: "Live updates",
    all: "All",
    safety: "Safety",
    crowd: "Crowd",
    weather: "Weather",
    ago: "ago",
    noAlerts: "No alerts at this time",
  },
};

type Lang = keyof typeof translations;
type FilterType = "all" | AlertType;

export default function AlertsClient({ lang }: { lang: string }) {
  const l = (lang as Lang) || "te";
  const t = translations[l];
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>("all");
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts().then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  const filtered = alerts.filter((a) => filter === "all" || a.type === filter);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: t.all },
    { key: "crowd", label: t.crowd },
    { key: "safety", label: t.safety },
    { key: "weather", label: t.weather },
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
      <div className="px-4 pt-3 pb-1">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={clsx(
                "px-3.5 py-2 rounded-full text-sm font-semibold transition-all",
                filter === f.key
                  ? "bg-godavari-700 text-white shadow-md shadow-godavari-700/25"
                  : "bg-white text-godavari-700 border border-godavari-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <main className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl p-3.5 border border-godavari-100 bg-white animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-godavari-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-godavari-100 rounded w-2/3" />
                  <div className="h-3 bg-godavari-50 rounded w-full" />
                </div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-godavari-400 text-sm">{t.noAlerts}</div>
        ) : (
          filtered.map((alert) => {
            const cfg = alertConfig[alert.type];
            return (
              <div
                key={alert.id}
                className={clsx(
                  "rounded-xl p-3.5 border",
                  cfg.bg,
                  cfg.border,
                  !alert.active && "opacity-60"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={clsx("text-sm font-bold leading-tight", cfg.color)}>
                        {alert.title[l]}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                        {alert.time} {t.ago}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-600 leading-relaxed mt-1">
                      {alert.message[l]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
