"use client";

import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface EmergencyContact {
  key: string;
  number: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  primary?: boolean;
}

const contacts: EmergencyContact[] = [
  { key: "police", number: "100", icon: "🚔", color: "text-blue-800", bg: "bg-blue-50", border: "border-blue-200", primary: true },
  { key: "ambulance", number: "108", icon: "🚑", color: "text-red-800", bg: "bg-red-50", border: "border-red-200", primary: true },
  { key: "fire", number: "101", icon: "🚒", color: "text-orange-800", bg: "bg-orange-50", border: "border-orange-200" },
  { key: "women", number: "181", icon: "👩", color: "text-purple-800", bg: "bg-purple-50", border: "border-purple-200" },
  { key: "disaster", number: "1070", icon: "⚠️", color: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200" },
  { key: "childHelp", number: "1098", icon: "👶", color: "text-teal-800", bg: "bg-teal-50", border: "border-teal-200" },
];

const localContacts: EmergencyContact[] = [
  { key: "pushkarHelp", number: "0883-2424567", icon: "🛕", color: "text-godavari-800", bg: "bg-godavari-50", border: "border-godavari-200" },
  { key: "controlRoom", number: "0883-2467890", icon: "📞", color: "text-godavari-800", bg: "bg-godavari-50", border: "border-godavari-200" },
  { key: "tourist", number: "1800-425-4747", icon: "ℹ️", color: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200" },
  { key: "riverPatrol", number: "0883-2425678", icon: "🚤", color: "text-sky-800", bg: "bg-sky-50", border: "border-sky-200" },
];

const translations = {
  te: {
    title: "అత్యవసర సహాయం",
    subtitle: "తక్షణ సహాయం కోసం కాల్ చేయండి",
    callNow: "ఇప్పుడు కాల్ చేయండి",
    emergencyNumbers: "అత్యవసర నంబర్లు",
    localHelp: "స్థానిక సహాయం",
    police: "పోలీసులు",
    ambulance: "అంబులెన్స్",
    fire: "అగ్నిమాపక",
    women: "మహిళా హెల్ప్‌లైన్",
    disaster: "విపత్తు నిర్వహణ",
    childHelp: "చైల్డ్ హెల్ప్‌లైన్",
    pushkarHelp: "పుష్కరాల హెల్ప్‌లైన్",
    controlRoom: "కంట్రోల్ రూమ్",
    tourist: "పర్యాటక హెల్ప్‌లైన్",
    riverPatrol: "నది పెట్రోల్",
    shareLocation: "నా లొకేషన్ పంపండి",
    safetyTip: "మీరు ప్రమాదంలో ఉంటే, ముందుగా 100 కు కాల్ చేయండి",
  },
  hi: {
    title: "आपातकालीन सहायता",
    subtitle: "तुरंत मदद के लिए कॉल करें",
    callNow: "अभी कॉल करें",
    emergencyNumbers: "आपातकालीन नंबर",
    localHelp: "स्थानीय सहायता",
    police: "पुलिस",
    ambulance: "एम्बुलेंस",
    fire: "दमकल",
    women: "महिला हेल्पलाइन",
    disaster: "आपदा प्रबंधन",
    childHelp: "चाइल्ड हेल्पलाइन",
    pushkarHelp: "पुष्करालु हेल्पलाइन",
    controlRoom: "कंट्रोल रूम",
    tourist: "पर्यटक हेल्पलाइन",
    riverPatrol: "नदी पेट्रोल",
    shareLocation: "मेरा स्थान भेजें",
    safetyTip: "अगर आप खतरे में हैं, पहले 100 पर कॉल करें",
  },
  en: {
    title: "Emergency Help",
    subtitle: "Call for immediate assistance",
    callNow: "Call Now",
    emergencyNumbers: "Emergency Numbers",
    localHelp: "Local Helplines",
    police: "Police",
    ambulance: "Ambulance",
    fire: "Fire Services",
    women: "Women Helpline",
    disaster: "Disaster Mgmt",
    childHelp: "Child Helpline",
    pushkarHelp: "Pushkaralu Helpline",
    controlRoom: "Control Room",
    tourist: "Tourist Helpline",
    riverPatrol: "River Patrol",
    shareLocation: "Share My Location",
    safetyTip: "If you are in danger, call 100 first",
  },
};

type Lang = keyof typeof translations;

export default function EmergencyClient({ lang }: { lang: string }) {
  const l = (lang as Lang) || "te";
  const t = translations[l];
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden bg-red-50">
      {/* Header — Red for urgency */}
      <header
        className="sticky top-0 z-30 safe-top"
        style={{
          background: "linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)",
          boxShadow: "0 2px 16px rgba(153,27,27,0.35)",
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
            <p className="text-red-200 text-xs">{t.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-4">
        {/* Big SOS Call Button — Direct dial */}
        <a
          href="tel:100"
          className="block rounded-2xl p-6 text-center active:scale-[0.97] transition-transform relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
            boxShadow: "0 8px 32px rgba(220,38,38,0.5)",
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl animate-pulse"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)" }}
          />
          <div className="relative z-10">
            <div className="text-5xl mb-2" style={{ animation: "bounce 2s infinite" }}>🆘</div>
            <p className="text-white text-2xl font-black">{t.callNow}</p>
            <p className="text-red-200 text-base font-semibold mt-1">{t.police} — 100</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span className="text-white/80 text-xs font-bold uppercase tracking-wide">
                {l === "te" ? "కాల్ చేయడానికి నొక్కండి" : l === "hi" ? "कॉल करने के लिए टैप करें" : "TAP TO CALL"}
              </span>
            </div>
          </div>
        </a>

        {/* Quick Ambulance Call */}
        <a
          href="tel:108"
          className="flex items-center justify-between rounded-xl p-4 active:scale-[0.98] transition-transform"
          style={{
            background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)",
            boxShadow: "0 4px 16px rgba(185,28,28,0.3)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚑</span>
            <div>
              <p className="text-white text-sm font-bold">{t.ambulance}</p>
              <p className="text-red-200 text-xs">108</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
          </div>
        </a>

        {/* Safety Tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <span className="text-base">💡</span>
          <p className="text-amber-800 text-[11px] font-medium leading-snug">{t.safetyTip}</p>
        </div>

        {/* Emergency Numbers */}
        <div>
          <p className="text-xs font-semibold text-red-900 mb-2 px-1">{t.emergencyNumbers}</p>
          <div className="grid grid-cols-2 gap-2">
            {contacts.map((c) => (
              <a
                key={c.key}
                href={`tel:${c.number}`}
                className={clsx(
                  "rounded-xl p-3 border active:scale-95 transition-transform",
                  c.bg,
                  c.border
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{c.icon}</span>
                  <span className={clsx("text-lg font-bold", c.color)}>{c.number}</span>
                </div>
                <p className={clsx("text-[11px] font-semibold", c.color)}>
                  {t[c.key as keyof typeof t]}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Local Helplines */}
        <div>
          <p className="text-xs font-semibold text-red-900 mb-2 px-1">{t.localHelp}</p>
          <div className="space-y-2">
            {localContacts.map((c) => (
              <a
                key={c.key}
                href={`tel:${c.number.replace(/-/g, "")}`}
                className={clsx(
                  "flex items-center gap-3 rounded-xl p-3 border active:scale-[0.98] transition-transform",
                  c.bg,
                  c.border
                )}
              >
                <span className="text-xl">{c.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={clsx("text-xs font-bold", c.color)}>
                    {t[c.key as keyof typeof t]}
                  </p>
                  <p className="text-[11px] text-slate-500">{c.number}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-slate-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Share Location Button */}
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                const url = `https://maps.google.com/?q=${latitude},${longitude}`;
                if (navigator.share) {
                  navigator.share({ title: "My Location", url });
                } else {
                  window.open(url, "_blank");
                }
              });
            }
          }}
          className="w-full rounded-xl p-3.5 bg-white border border-godavari-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform mb-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1b5bae" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-sm font-semibold text-godavari-700">{t.shareLocation}</span>
        </button>
      </main>
    </div>
  );
}
