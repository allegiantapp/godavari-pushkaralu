"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import VoiceModal from "@/components/ui/VoiceModal";

const translations = {
  te: {
    speak: "మాట్లాడండి",
    voiceSub: "సహాయం కోసం నొక్కండి",
    nearestGhat: "సమీప ఘాట్",
    leastCrowded: "తక్కువ రద్దీ ఘాట్",
    crowdLow: "తక్కువ రద్దీ",
    crowdMed: "మధ్యస్థ రద్దీ",
    crowdHigh: "ఎక్కువ రద్దీ",
    nearby: "సమీపంలో",
    food: "ఆహారం",
    toilet: "మరుగుదొడ్లు",
    water: "నీరు",
    medical: "వైద్యం",
    seeAll: "అన్నీ చూడండి",
    quickAccess: "మరిన్ని సేవలు",
    ghats: "ఘాట్లు",
    transport: "రవాణా",
    alerts: "హెచ్చరికలు",
    emergency: "అత్యవసరం",
    crowdStatus: "రద్దీ స్థితి",
    map: "మ్యాప్",
    volunteer: "వాలంటీర్",
    currentAlert: "ప్రస్తుత హెచ్చరిక",
    alertMsg:
      "పుష్కర్ ఘాట్ వద్ద తక్కువ రద్దీ ఉంది. సురక్షితంగా స్నానం చేయవచ్చు.",
  },
  hi: {
    speak: "बोलें",
    voiceSub: "मदद के लिए दबाएं",
    nearestGhat: "निकटतम घाट",
    leastCrowded: "कम भीड़ घाट",
    crowdLow: "कम भीड़",
    crowdMed: "मध्यम भीड़",
    crowdHigh: "अधिक भीड़",
    nearby: "पास में",
    food: "भोजन",
    toilet: "शौचालय",
    water: "पानी",
    medical: "चिकित्सा",
    seeAll: "सब देखें",
    quickAccess: "और सेवाएं",
    ghats: "घाट",
    transport: "परिवहन",
    alerts: "अलर्ट",
    emergency: "आपातकाल",
    crowdStatus: "भीड़ स्थिति",
    map: "नक्शा",
    volunteer: "स्वयंसेवक",
    currentAlert: "वर्तमान अलर्ट",
    alertMsg: "पुष्कर घाट पर कम भीड़ है। सुरक्षित रूप से स्नान कर सकते हैं।",
  },
  en: {
    speak: "Speak",
    voiceSub: "Tap for help",
    nearestGhat: "Nearest Ghat",
    leastCrowded: "Least Crowded",
    crowdLow: "Low Crowd",
    crowdMed: "Moderate",
    crowdHigh: "Crowded",
    nearby: "Nearby",
    food: "Food",
    toilet: "Toilet",
    water: "Water",
    medical: "Medical",
    seeAll: "See all",
    quickAccess: "More Services",
    ghats: "Ghats",
    transport: "Transport",
    alerts: "Alerts",
    emergency: "Emergency",
    crowdStatus: "Crowd Status",
    map: "Map",
    volunteer: "Volunteer",
    currentAlert: "Current Alert",
    alertMsg: "Low crowd at Pushkar Ghat. Safe for bathing.",
  },
};

type Lang = keyof typeof translations;

const nearbyEssentials = [
  { key: "food", emoji: "🍲", distance: "300m", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", href: "facilities?type=food" },
  { key: "toilet", emoji: "🚻", distance: "150m", bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-800", href: "facilities?type=toilet" },
  { key: "water", emoji: "💧", distance: "200m", bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-800", href: "facilities?type=water" },
  { key: "medical", emoji: "🏥", distance: "500m", bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-800", href: "facilities?type=medical" },
];

const quickAccessItems = [
  { key: "ghats", href: "ghats", emoji: "🛕", bg: "bg-godavari-50", text: "text-godavari-800" },
  { key: "transport", href: "transport", emoji: "🚌", bg: "bg-indigo-50", text: "text-indigo-800" },
  { key: "crowdStatus", href: "ghats/status", emoji: "👥", bg: "bg-amber-50", text: "text-amber-800" },
  { key: "alerts", href: "alerts", emoji: "📢", bg: "bg-rose-50", text: "text-rose-800" },
  { key: "map", href: "map", emoji: "📍", bg: "bg-emerald-50", text: "text-emerald-800" },
  { key: "emergency", href: "emergency", emoji: "🆘", bg: "bg-red-50", text: "text-red-800" },
];

export default function HomeClient({ lang }: { lang: string }) {
  const t = translations[(lang as Lang) || "te"];
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden bg-godavari-50">
      {/* ===== HEADER ===== */}
      <header
        className="sticky top-0 z-30 safe-top"
        style={{
          background: "linear-gradient(135deg, #0f2847 0%, #1a3f6e 100%)",
          boxShadow: "0 2px 16px rgba(15,40,71,0.35)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logos/ap-govt.webp" alt="Govt of AP" className="h-9 w-9 rounded-full flex-shrink-0" />
            <div>
              <h1 className="text-white font-bold text-[17px] leading-tight tracking-tight">
                గోదావరి పుష్కరాలు
              </h1>
              <p className="text-godavari-300 text-[9px] tracking-[0.2em] font-medium">
                GODAVARI PUSHKARALU
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium border border-white/10"
            >
              <span className="text-base">
                {lang === "te" ? "తె" : lang === "hi" ? "हि" : "En"}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={clsx(
                  "transition-transform",
                  langOpen && "rotate-180"
                )}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {langOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-godavari-100 overflow-hidden min-w-[140px]">
                  {[
                    { code: "te", name: "తెలుగు", sub: "Telugu" },
                    { code: "hi", name: "हिन्दी", sub: "Hindi" },
                    { code: "en", name: "English", sub: "English" },
                  ].map((l) => (
                    <Link
                      key={l.code}
                      href={`/${l.code}`}
                      onClick={() => {
                        localStorage.setItem("godavari-lang", l.code);
                        setLangOpen(false);
                      }}
                      className={clsx(
                        "flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                        lang === l.code
                          ? "bg-godavari-50 text-godavari-800 font-semibold"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <span>{l.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {l.sub}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* ===== VOICE HERO — Sunset sky gradient ===== */}
        <div
          className="px-5 pt-6 pb-10 flex flex-col items-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #1a0e00 0%, #3d1e00 15%, #7a3d00 32%, #b85c00 48%, #dd7302 60%, #f99b07 72%, #ffbe20 84%, #ffcc80 93%, #eff8ff 100%)",
          }}
        >
          {/* Subtle mandala behind mic */}
          <div className="absolute pointer-events-none" style={{ width: "200px", height: "200px", top: "10px", opacity: 0.06 }}>
            <svg viewBox="0 0 200 200" fill="none" stroke="white" strokeWidth="0.6">
              <circle cx="100" cy="100" r="95" />
              <circle cx="100" cy="100" r="75" />
              <circle cx="100" cy="100" r="55" />
              <circle cx="100" cy="100" r="35" />
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * 30 * Math.PI) / 180;
                return <line key={i} x1={100 + 35 * Math.cos(a)} y1={100 + 35 * Math.sin(a)} x2={100 + 95 * Math.cos(a)} y2={100 + 95 * Math.sin(a)} />;
              })}
            </svg>
          </div>

          {/* Warm radial glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: "200px",
              height: "200px",
              top: "10px",
              background: "radial-gradient(circle, rgba(255,152,0,0.2) 0%, transparent 70%)",
            }}
          />

          {/* Mic Button — THE HERO */}
          <button
            onClick={() => setVoiceOpen(true)}
            className="relative w-24 h-24 rounded-full flex items-center justify-center transition-transform active:scale-90 z-10"
            style={{
              background: "linear-gradient(135deg, #ffbe20, #e65100)",
              boxShadow:
                "0 8px 40px rgba(230,81,0,0.45), 0 0 0 5px rgba(255,190,32,0.2), 0 0 0 10px rgba(255,152,0,0.08)",
            }}
          >
            <div className="absolute inset-0 rounded-full animate-sacred-pulse" />
            <div className="absolute inset-0 rounded-full animate-sacred-pulse" style={{ animationDelay: "0.7s" }} />
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="1" width="6" height="12" rx="3" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>

          <p className="text-white text-lg font-bold mt-3 z-10" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>
            {t.speak}
          </p>
          <p className="text-white/60 text-xs z-10">{t.voiceSub}</p>
        </div>

        {/* ===== CONTENT CARDS ===== */}
        <div className="px-4 space-y-3 -mt-4 relative z-10">
          {/* Ghat Cards — Nearest + Least Crowded */}
          <div className="grid grid-cols-2 gap-2">
            {/* Nearest Ghat */}
            <Link
              href={`/${lang}/ghats`}
              className="block bg-white rounded-2xl p-3 active:scale-[0.97] transition-transform"
              style={{
                border: "1px solid var(--godavari-100)",
                boxShadow: "0 4px 16px rgba(15,40,71,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🛕</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold text-emerald-700">{t.crowdLow}</span>
                </div>
              </div>
              <p className="text-[10px] text-godavari-500 font-medium">{t.nearestGhat}</p>
              <p className="text-sm font-bold text-godavari-950 leading-tight mt-0.5">
                {lang === "te" ? "పుష్కర్ ఘాట్" : lang === "hi" ? "पुष्कर घाट" : "Pushkar Ghat"}
              </p>
              <p className="text-[11px] text-godavari-400 mt-1">500m →</p>
            </Link>

            {/* Least Crowded Ghat */}
            <Link
              href={`/${lang}/ghats`}
              className="block bg-white rounded-2xl p-3 active:scale-[0.97] transition-transform"
              style={{
                border: "1px solid var(--godavari-100)",
                boxShadow: "0 4px 16px rgba(15,40,71,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🛕</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold text-emerald-700">{t.crowdLow}</span>
                </div>
              </div>
              <p className="text-[10px] text-godavari-500 font-medium">{t.leastCrowded}</p>
              <p className="text-sm font-bold text-godavari-950 leading-tight mt-0.5">
                {lang === "te" ? "సరస్వతి ఘాట్" : lang === "hi" ? "सरस्वती घाट" : "Saraswathi Ghat"}
              </p>
              <p className="text-[11px] text-godavari-400 mt-1">1.2km →</p>
            </Link>
          </div>

          {/* Nearest Essentials */}
          <div>
            <p className="text-xs font-semibold text-godavari-800 mb-2 px-1">
              {t.nearby}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {nearbyEssentials.map((item) => (
                <Link
                  key={item.key}
                  href={`/${lang}/${item.href}`}
                  className={clsx(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border active:scale-95 transition-transform",
                    item.bg,
                    item.border
                  )}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <div className="min-w-0">
                    <p className={clsx("text-xs font-bold truncate", item.text)}>
                      {t[item.key as keyof typeof t]}
                    </p>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      {item.distance}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Active Alert */}
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-3 bg-amber-50 border border-amber-200"
            style={{ boxShadow: "0 2px 8px rgba(245,158,11,0.08)" }}
          >
            <span className="text-lg mt-0.5">📢</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-900 mb-0.5">
                {t.currentAlert}
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {t.alertMsg}
              </p>
            </div>
          </div>

          {/* Quick Access Grid */}
          <div
            className="bg-white rounded-2xl p-4"
            style={{
              border: "1px solid var(--godavari-100)",
              boxShadow: "0 2px 12px rgba(15,40,71,0.05)",
            }}
          >
            <p className="text-xs font-semibold text-godavari-800 mb-3 px-1">
              {t.quickAccess}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {quickAccessItems.map((item) => {
                const label = t[item.key as keyof typeof t] || item.key;
                return (
                  <Link
                    key={item.key}
                    href={`/${lang}/${item.href}`}
                    className="flex flex-col items-center gap-1.5 py-2 group"
                  >
                    <div
                      className={clsx(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-active:scale-90 border",
                        item.bg,
                        item.bg.replace("bg-", "border-").replace("-50", "-200")
                      )}
                    >
                      <span className="text-xl">{item.emoji}</span>
                    </div>
                    <span
                      className={clsx(
                        "text-[10px] font-semibold leading-tight text-center",
                        item.text
                      )}
                    >
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Weather/Day Counter — Deep river blue card */}
          <div
            className="rounded-2xl p-3.5 mb-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0f2847 0%, #1c4d8f 100%)",
              boxShadow: "0 4px 20px rgba(15,40,71,0.25)",
            }}
          >
            {/* Subtle water shimmer */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
              <svg width="100%" height="100%" viewBox="0 0 400 60" preserveAspectRatio="none">
                <path d="M0,30 Q50,15 100,30 Q150,45 200,30 Q250,15 300,30 Q350,45 400,30" fill="none" stroke="white" strokeWidth="1" />
                <path d="M0,45 Q50,30 100,45 Q150,60 200,45 Q250,30 300,45 Q350,60 400,45" fill="none" stroke="white" strokeWidth="0.8" />
              </svg>
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🌅</span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {lang === "te"
                      ? "రాజమండ్రి"
                      : lang === "hi"
                        ? "राजमंड्री"
                        : "Rajahmundry"}
                  </p>
                  <p className="text-[11px] text-godavari-300">
                    32°C •{" "}
                    {lang === "te"
                      ? "ఎండగా ఉంది"
                      : lang === "hi"
                        ? "धूप"
                        : "Sunny"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-godavari-400 font-medium">
                  {lang === "te"
                    ? "పుష్కరాలు"
                    : lang === "hi"
                      ? "पुष्करालु"
                      : "Pushkaralu"}
                </p>
                <p className="text-lg font-bold" style={{ color: "#ffcc80" }}>
                  Day 3<span className="text-xs font-normal text-godavari-400">/12</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Voice Assistant Modal */}
      <VoiceModal
        lang={lang}
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onNavigate={(route) => {
          router.push(`/${lang}${route}`);
        }}
      />
    </div>
  );
}
