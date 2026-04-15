"use client";

import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface PujaItem {
  id: string;
  ghat: string;
  ghatName: { te: string; hi: string; en: string };
  name: { te: string; hi: string; en: string };
  time: string;
  duration: { te: string; hi: string; en: string };
  emoji: string;
}

const pujaSchedule: PujaItem[] = [
  // Pushkar Ghat
  { id: "p1", ghat: "pushkar", ghatName: { te: "పుష్కర్ ఘాట్", hi: "पुष्कर घाट", en: "Pushkar Ghat" }, name: { te: "సుప్రభాతం", hi: "सुप्रभातम", en: "Suprabhatam" }, time: "05:00", duration: { te: "30 నిమిషాలు", hi: "30 मिनट", en: "30 min" }, emoji: "🌅" },
  { id: "p2", ghat: "pushkar", ghatName: { te: "పుష్కర్ ఘాట్", hi: "पुष्कर घाट", en: "Pushkar Ghat" }, name: { te: "గోదావరి ఆరతి", hi: "गोदावरी आरती", en: "Godavari Aarti" }, time: "06:00", duration: { te: "45 నిమిషాలు", hi: "45 मिनट", en: "45 min" }, emoji: "🪔" },
  { id: "p3", ghat: "pushkar", ghatName: { te: "పుష్కర్ ఘాట్", hi: "पुष्कर घाट", en: "Pushkar Ghat" }, name: { te: "మహా అభిషేకం", hi: "महा अभिषेक", en: "Maha Abhishekam" }, time: "08:00", duration: { te: "1 గంట", hi: "1 घंटा", en: "1 hour" }, emoji: "🙏" },
  { id: "p4", ghat: "pushkar", ghatName: { te: "పుష్కర్ ఘాట్", hi: "पुष्कर घाट", en: "Pushkar Ghat" }, name: { te: "పుష్కర పూజ", hi: "पुष्कर पूजा", en: "Pushkara Puja" }, time: "10:00", duration: { te: "1 గంట", hi: "1 घंटा", en: "1 hour" }, emoji: "🛕" },
  { id: "p5", ghat: "pushkar", ghatName: { te: "పుష్కర్ ఘాట్", hi: "पुष्कर घाट", en: "Pushkar Ghat" }, name: { te: "సంధ్యా ఆరతి", hi: "संध्या आरती", en: "Sandhya Aarti" }, time: "18:30", duration: { te: "45 నిమిషాలు", hi: "45 मिनट", en: "45 min" }, emoji: "🪔" },
  { id: "p6", ghat: "pushkar", ghatName: { te: "పుష్కర్ ఘాట్", hi: "पुष्कर घाट", en: "Pushkar Ghat" }, name: { te: "దీపోత్సవం", hi: "दीपोत्सव", en: "Deepotsavam (Lamp Float)" }, time: "19:30", duration: { te: "1 గంట", hi: "1 घंटा", en: "1 hour" }, emoji: "🕯️" },
  // Saraswati Ghat
  { id: "s1", ghat: "saraswati", ghatName: { te: "సరస్వతి ఘాట్", hi: "सरस्वती घाट", en: "Saraswati Ghat" }, name: { te: "ఉదయపు ఆరతి", hi: "सुबह की आरती", en: "Morning Aarti" }, time: "05:30", duration: { te: "30 నిమిషాలు", hi: "30 मिनट", en: "30 min" }, emoji: "🪔" },
  { id: "s2", ghat: "saraswati", ghatName: { te: "సరస్వతి ఘాట్", hi: "सरस्वती घाट", en: "Saraswati Ghat" }, name: { te: "పుష్కర పూజ", hi: "पुष्कर पूजा", en: "Pushkara Puja" }, time: "09:00", duration: { te: "1 గంట", hi: "1 घंटा", en: "1 hour" }, emoji: "🛕" },
  { id: "s3", ghat: "saraswati", ghatName: { te: "సరస్వతి ఘాట్", hi: "सरस्वती घाट", en: "Saraswati Ghat" }, name: { te: "సాయంత్ర ఆరతి", hi: "शाम की आरती", en: "Evening Aarti" }, time: "18:00", duration: { te: "30 నిమిషాలు", hi: "30 मिनट", en: "30 min" }, emoji: "🪔" },
  // Gowthami Ghat
  { id: "g1", ghat: "gowthami", ghatName: { te: "గౌతమి ఘాట్", hi: "गौतमी घाट", en: "Gowthami Ghat" }, name: { te: "ఉదయపు పూజ", hi: "सुबह की पूजा", en: "Morning Puja" }, time: "06:00", duration: { te: "45 నిమిషాలు", hi: "45 मिनट", en: "45 min" }, emoji: "🙏" },
  { id: "g2", ghat: "gowthami", ghatName: { te: "గౌతమి ఘాట్", hi: "गौतमी घाट", en: "Gowthami Ghat" }, name: { te: "గోదావరి అభిషేకం", hi: "गोदावरी अभिषेक", en: "Godavari Abhishekam" }, time: "11:00", duration: { te: "1 గంట", hi: "1 घंटा", en: "1 hour" }, emoji: "🙏" },
  { id: "g3", ghat: "gowthami", ghatName: { te: "గౌతమి ఘాట్", hi: "गौतमी घाट", en: "Gowthami Ghat" }, name: { te: "సాయంత్ర దీపం", hi: "शाम का दीप", en: "Evening Deepam" }, time: "19:00", duration: { te: "45 నిమిషాలు", hi: "45 मिनट", en: "45 min" }, emoji: "🕯️" },
  // Kotilingala Ghat
  { id: "k1", ghat: "kotilingala", ghatName: { te: "కోటిలింగాల ఘాట్", hi: "कोटिलिंगाला घाट", en: "Kotilingala Ghat" }, name: { te: "శివ అభిషేకం", hi: "शिव अभिषेक", en: "Shiva Abhishekam" }, time: "06:00", duration: { te: "1 గంట", hi: "1 घंटा", en: "1 hour" }, emoji: "🙏" },
  { id: "k2", ghat: "kotilingala", ghatName: { te: "కోటిలింగాల ఘాట్", hi: "कोटिलिंगाला घाट", en: "Kotilingala Ghat" }, name: { te: "రుద్రాభిషేకం", hi: "रुद्राभिषेक", en: "Rudrabhishekam" }, time: "16:00", duration: { te: "1 గంట", hi: "1 घंटा", en: "1 hour" }, emoji: "🙏" },
];

const ghatOrder = ["pushkar", "saraswati", "gowthami", "kotilingala"];

const translations = {
  te: {
    title: "పూజా సమయాలు",
    subtitle: "ఘాట్ల వారీగా పూజా షెడ్యూల్",
    daily: "ప్రతిరోజు",
  },
  hi: {
    title: "पूजा समय",
    subtitle: "घाट के अनुसार पूजा समय",
    daily: "प्रतिदिन",
  },
  en: {
    title: "Puja Timings",
    subtitle: "Ghat-wise puja schedule",
    daily: "Daily",
  },
};

type Lang = keyof typeof translations;

function formatTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")} ${suffix}`;
}

export default function PujaTimingsClient({ lang }: { lang: string }) {
  const l = (lang as Lang) || "te";
  const t = translations[l];
  const router = useRouter();

  const grouped = ghatOrder
    .map((ghat) => ({
      ghat,
      items: pujaSchedule.filter((p) => p.ghat === ghat),
    }))
    .filter((g) => g.items.length > 0);

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

      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-5">
        {grouped.map((group) => {
          const ghatName = group.items[0].ghatName[l];
          return (
            <div key={group.ghat}>
              {/* Ghat section header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-base">🛕</span>
                <p className="text-xs font-bold text-amber-800">{ghatName}</p>
              </div>

              <div className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-3.5"
                    style={{
                      border: "1px solid #fde68a",
                      boxShadow: "0 2px 8px rgba(217,119,6,0.06)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <span className="text-lg mt-0.5">{item.emoji}</span>
                        <div>
                          <p className="text-sm font-bold text-amber-950 leading-tight">
                            {item.name[l]}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-amber-700">
                              {formatTime(item.time)}
                            </span>
                            <span className="w-px h-3 bg-amber-200" />
                            <span className="text-[11px] text-amber-600">
                              {item.duration[l]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        {t.daily}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
