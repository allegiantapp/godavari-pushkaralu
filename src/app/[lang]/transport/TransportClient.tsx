"use client";

import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import NavigateButton from "@/components/ui/NavigateButton";
import { transportLocations } from "@/lib/locations";
import { useUserLocation, getDistanceKm, formatDistance } from "@/lib/useUserLocation";

type TransportType = "bus" | "auto" | "parking" | "shuttle" | "boat";

interface TransportOption {
  id: string;
  type: TransportType;
  name: { te: string; hi: string; en: string };
  details: { te: string; hi: string; en: string };
  distance: string;
  price: string;
}

const transportOptions: TransportOption[] = [
  { id: "b1", type: "bus", name: { te: "APSRTC బస్ స్టాండ్", hi: "APSRTC बस स्टैंड", en: "APSRTC Bus Stand" }, details: { te: "అన్ని నగరాలకు బస్సులు • 24 గంటలు", hi: "सभी शहरों के लिए बसें • 24 घंटे", en: "Buses to all cities • 24 hours" }, distance: "1.5km", price: "₹10+" },
  { id: "b2", type: "bus", name: { te: "ఘాట్ షటిల్ బస్", hi: "घाट शटल बस", en: "Ghat Shuttle Bus" }, details: { te: "పుష్కర్ ఘాట్ ↔ గౌతమి ఘాట్ • ప్రతి 15 నిమిషాలు", hi: "पुष्कर घाट ↔ गौतमी घाट • हर 15 मिनट", en: "Pushkar Ghat ↔ Gautami Ghat • Every 15 min" }, distance: "500m", price: "₹5" },
  { id: "b3", type: "shuttle", name: { te: "పార్కింగ్ షటిల్", hi: "पार्किंग शटल", en: "Parking Shuttle" }, details: { te: "పార్కింగ్ లాట్ ↔ ఘాట్లు • ప్రతి 10 నిమిషాలు", hi: "पार्किंग लॉट ↔ घाट • हर 10 मिनट", en: "Parking Lot ↔ Ghats • Every 10 min" }, distance: "200m", price: "Free" },
  { id: "a1", type: "auto", name: { te: "ఆటో స్టాండ్ - పుష్కర్ ఘాట్", hi: "ऑटो स्टैंड - पुष्कर घाट", en: "Auto Stand - Pushkar Ghat" }, details: { te: "ప్రీపెయిడ్ ఆటో అందుబాటులో", hi: "प्रीपेड ऑटो उपलब्ध", en: "Prepaid autos available" }, distance: "400m", price: "₹30+" },
  { id: "a2", type: "auto", name: { te: "ఆటో స్టాండ్ - రైల్వే స్టేషన్", hi: "ऑटो स्टैंड - रेलवे स्टेशन", en: "Auto Stand - Railway Station" }, details: { te: "ఘాట్లకు ప్రీపెయిడ్ సర్వీస్", hi: "घाटों के लिए प्रीपेड सर्विस", en: "Prepaid service to ghats" }, distance: "3km", price: "₹50+" },
  { id: "p1", type: "parking", name: { te: "పార్కింగ్ లాట్ A - మెయిన్", hi: "पार्किंग लॉट A - मेन", en: "Parking Lot A - Main" }, details: { te: "కార్లు & బైక్‌లు • 500 స్లాట్లు", hi: "कार और बाइक • 500 स्लॉट", en: "Cars & bikes • 500 slots" }, distance: "1.5km", price: "₹50/day" },
  { id: "p2", type: "parking", name: { te: "పార్కింగ్ లాట్ B - కొవ్వూరు", hi: "पार्किंग लॉट B - कोव्वूर", en: "Parking Lot B - Kovvur" }, details: { te: "కార్లు & బస్సులు • 300 స్లాట్లు", hi: "कार और बसें • 300 स्लॉट", en: "Cars & buses • 300 slots" }, distance: "5km", price: "₹40/day" },
  { id: "bt1", type: "boat", name: { te: "బోట్ సర్వీస్ - పుష్కర్ ఘాట్", hi: "नाव सेवा - पुष्कर घाट", en: "Boat Service - Pushkar Ghat" }, details: { te: "నది దర్శనం • 30 నిమిషాలు", hi: "नदी दर्शन • 30 मिनट", en: "River tour • 30 minutes" }, distance: "500m", price: "₹100" },
  { id: "bt2", type: "boat", name: { te: "ఫెర్రీ - రాజమండ్రి ↔ కొవ్వూరు", hi: "फेरी - राजमंड्री ↔ कोव्वूर", en: "Ferry - Rajahmundry ↔ Kovvur" }, details: { te: "ప్రతి 30 నిమిషాలు • 6AM-6PM", hi: "हर 30 मिनट • 6AM-6PM", en: "Every 30 min • 6AM-6PM" }, distance: "800m", price: "₹20" },
];

const typeConfig: Record<TransportType, { emoji: string; color: string; bg: string; border: string }> = {
  bus: { emoji: "🚌", color: "text-blue-800", bg: "bg-blue-50", border: "border-blue-200" },
  auto: { emoji: "🛺", color: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200" },
  parking: { emoji: "🅿️", color: "text-indigo-800", bg: "bg-indigo-50", border: "border-indigo-200" },
  shuttle: { emoji: "🚐", color: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200" },
  boat: { emoji: "🚤", color: "text-sky-800", bg: "bg-sky-50", border: "border-sky-200" },
};

const translations = {
  te: {
    title: "రవాణా",
    subtitle: "ప్రయాణ సమాచారం",
    bus: "బస్సులు",
    auto: "ఆటోలు",
    parking: "పార్కింగ్",
    boat: "బోట్లు",
    shuttle: "షటిల్",
  },
  hi: {
    title: "परिवहन",
    subtitle: "यात्रा जानकारी",
    bus: "बसें",
    auto: "ऑटो",
    parking: "पार्किंग",
    boat: "नाव",
    shuttle: "शटल",
  },
  en: {
    title: "Transport",
    subtitle: "Travel information",
    bus: "Buses",
    auto: "Autos",
    parking: "Parking",
    boat: "Boats",
    shuttle: "Shuttle",
  },
};

type Lang = keyof typeof translations;

export default function TransportClient({ lang }: { lang: string }) {
  const l = (lang as Lang) || "te";
  const t = translations[l];
  const router = useRouter();
  const userLoc = useUserLocation();

  // Add real-time distances if GPS available
  const optionsWithDist = transportOptions.map((item) => {
    const loc = transportLocations.find((tl) => tl.id === item.id);
    if (userLoc && loc) {
      const realDist = getDistanceKm(userLoc.lat, userLoc.lng, loc.lat, loc.lng);
      return { ...item, distance: formatDistance(realDist) };
    }
    return item;
  });

  // Group by type
  const grouped: { type: TransportType; items: TransportOption[] }[] = [];
  const typeOrder: TransportType[] = ["shuttle", "bus", "auto", "boat", "parking"];
  for (const type of typeOrder) {
    const items = optionsWithDist.filter((o) => o.type === type);
    if (items.length > 0) grouped.push({ type, items });
  }

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

      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-4">
        {grouped.map((group) => {
          const cfg = typeConfig[group.type];
          const groupLabel = t[group.type as keyof typeof t] || group.type;

          return (
            <div key={group.type}>
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-base">{cfg.emoji}</span>
                <p className={clsx("text-xs font-bold", cfg.color)}>{groupLabel}</p>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-3.5"
                    style={{
                      border: "1px solid var(--godavari-100)",
                      boxShadow: "0 2px 8px rgba(15,40,71,0.04)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-godavari-950 leading-tight">
                          {item.name[l]}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {item.details[l]}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs font-bold text-godavari-700">{item.price}</p>
                          <p className="text-[10px] text-godavari-400">{item.distance}</p>
                        </div>
                        {(() => {
                          const loc = transportLocations.find((t) => t.id === item.id);
                          return loc ? <NavigateButton lat={loc.lat} lng={loc.lng} lang={lang} compact /> : null;
                        })()}
                      </div>
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
