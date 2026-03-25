"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { clsx } from "clsx";
import NavigateButton from "@/components/ui/NavigateButton";
import { facilityLocations } from "@/lib/locations";
import { useUserLocation, getDistanceKm, formatDistance } from "@/lib/useUserLocation";

type FacilityType = "food" | "toilet" | "water" | "medical" | "volunteer" | "parking";

interface Facility {
  id: string;
  type: FacilityType;
  name: { te: string; hi: string; en: string };
  distance: string;
  distanceNum: number;
  status: "open" | "closed";
  details: { te: string; hi: string; en: string };
}

const facilities: Facility[] = [
  { id: "f1", type: "food", name: { te: "అన్నదానం - పుష్కర్ ఘాట్", hi: "अन्नदानम - पुष्कर घाट", en: "Annadanam - Pushkar Ghat" }, distance: "300m", distanceNum: 0.3, status: "open", details: { te: "ఉచిత భోజనం • 6AM-9PM", hi: "मुफ्त भोजन • 6AM-9PM", en: "Free meals • 6AM-9PM" } },
  { id: "f2", type: "food", name: { te: "ISKCON భోజనశాల", hi: "ISKCON भोजनालय", en: "ISKCON Food Center" }, distance: "800m", distanceNum: 0.8, status: "open", details: { te: "శాకాహార భోజనం • 7AM-8PM", hi: "शाकाहारी भोजन • 7AM-8PM", en: "Vegetarian meals • 7AM-8PM" } },
  { id: "f3", type: "food", name: { te: "గవర్నమెంట్ ఆహార కేంద్రం", hi: "सरकारी भोजन केंद्र", en: "Govt Food Center" }, distance: "1.2km", distanceNum: 1.2, status: "open", details: { te: "సబ్సిడీ భోజనం ₹10 • 8AM-7PM", hi: "सब्सिडी भोजन ₹10 • 8AM-7PM", en: "Subsidized meals ₹10 • 8AM-7PM" } },
  { id: "t1", type: "toilet", name: { te: "సులభ్ శౌచాలయం - ఘాట్ 1", hi: "सुलभ शौचालय - घाट 1", en: "Sulabh Toilet - Ghat 1" }, distance: "150m", distanceNum: 0.15, status: "open", details: { te: "24 గంటలు • ₹5", hi: "24 घंटे • ₹5", en: "24 hours • ₹5" } },
  { id: "t2", type: "toilet", name: { te: "మొబైల్ టాయిలెట్ - గౌతమి ఘాట్", hi: "मोबाइल टॉयलेट - गौतमी घाट", en: "Mobile Toilet - Gautami Ghat" }, distance: "600m", distanceNum: 0.6, status: "open", details: { te: "6AM-10PM • ఉచితం", hi: "6AM-10PM • मुफ्त", en: "6AM-10PM • Free" } },
  { id: "t3", type: "toilet", name: { te: "శౌచాలయం - బస్ స్టాండ్", hi: "शौचालय - बस स्टैंड", en: "Toilet - Bus Stand" }, distance: "1km", distanceNum: 1, status: "open", details: { te: "24 గంటలు • ₹5", hi: "24 घंटे • ₹5", en: "24 hours • ₹5" } },
  { id: "w1", type: "water", name: { te: "మంచి నీటి కేంద్రం - పుష్కర్ ఘాట్", hi: "पेयजल केंद्र - पुष्कर घाट", en: "Drinking Water - Pushkar Ghat" }, distance: "200m", distanceNum: 0.2, status: "open", details: { te: "RO వాటర్ • ఉచితం", hi: "RO वाटर • मुफ्त", en: "RO Water • Free" } },
  { id: "w2", type: "water", name: { te: "నీటి ట్యాంకర్ - కోటిలింగ ఘాట్", hi: "पानी टैंकर - कोटिलिंग घाट", en: "Water Tanker - Kotilinga Ghat" }, distance: "700m", distanceNum: 0.7, status: "open", details: { te: "8AM-6PM • ఉచితం", hi: "8AM-6PM • मुफ्त", en: "8AM-6PM • Free" } },
  { id: "m1", type: "medical", name: { te: "ప్రాథమిక చికిత్స - పుష్కర్ ఘాట్", hi: "प्राथमिक चिकित्सा - पुष्कर घाट", en: "First Aid - Pushkar Ghat" }, distance: "500m", distanceNum: 0.5, status: "open", details: { te: "24 గంటలు • ఉచితం", hi: "24 घंटे • मुफ्त", en: "24 hours • Free" } },
  { id: "m2", type: "medical", name: { te: "ప్రభుత్వ ఆసుపత్రి", hi: "सरकारी अस्पताल", en: "Government Hospital" }, distance: "2km", distanceNum: 2, status: "open", details: { te: "24 గంటలు • అంబులెన్స్ అందుబాటులో", hi: "24 घंटे • एम्बुलेंस उपलब्ध", en: "24 hours • Ambulance available" } },
  { id: "v1", type: "volunteer", name: { te: "వాలంటీర్ బూత్ - పుష్కర్ ఘాట్", hi: "स्वयंसेवक बूथ - पुष्कर घाट", en: "Volunteer Booth - Pushkar Ghat" }, distance: "400m", distanceNum: 0.4, status: "open", details: { te: "సహాయం & మార్గదర్శనం", hi: "सहायता और मार्गदर्शन", en: "Help & Guidance" } },
  { id: "p1", type: "parking", name: { te: "పార్కింగ్ లాట్ A", hi: "पार्किंग लॉट A", en: "Parking Lot A" }, distance: "1.5km", distanceNum: 1.5, status: "open", details: { te: "500 వాహనాలు • ₹50/రోజు", hi: "500 वाहन • ₹50/दिन", en: "500 vehicles • ₹50/day" } },
];

const typeConfig: Record<FacilityType, { emoji: string; color: string; bg: string; border: string }> = {
  food: { emoji: "🍲", color: "text-orange-800", bg: "bg-orange-50", border: "border-orange-200" },
  toilet: { emoji: "🚻", color: "text-teal-800", bg: "bg-teal-50", border: "border-teal-200" },
  water: { emoji: "💧", color: "text-sky-800", bg: "bg-sky-50", border: "border-sky-200" },
  medical: { emoji: "🏥", color: "text-rose-800", bg: "bg-rose-50", border: "border-rose-200" },
  volunteer: { emoji: "🤝", color: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200" },
  parking: { emoji: "🅿️", color: "text-indigo-800", bg: "bg-indigo-50", border: "border-indigo-200" },
};

const translations = {
  te: {
    title: "సౌకర్యాలు",
    subtitle: "సమీపంలోని సేవలు",
    all: "అన్నీ",
    food: "ఆహారం",
    toilet: "మరుగుదొడ్లు",
    water: "నీరు",
    medical: "వైద్యం",
    volunteer: "వాలంటీర్",
    parking: "పార్కింగ్",
    open: "తెరచి ఉంది",
    closed: "మూసి ఉంది",
  },
  hi: {
    title: "सुविधाएं",
    subtitle: "आसपास की सेवाएं",
    all: "सभी",
    food: "भोजन",
    toilet: "शौचालय",
    water: "पानी",
    medical: "चिकित्सा",
    volunteer: "स्वयंसेवक",
    parking: "पार्किंग",
    open: "खुला है",
    closed: "बंद है",
  },
  en: {
    title: "Facilities",
    subtitle: "Nearby services",
    all: "All",
    food: "Food",
    toilet: "Toilet",
    water: "Water",
    medical: "Medical",
    volunteer: "Volunteer",
    parking: "Parking",
    open: "Open",
    closed: "Closed",
  },
};

type Lang = keyof typeof translations;

function FacilitiesContent({ lang }: { lang: string }) {
  const l = (lang as Lang) || "te";
  const t = translations[l];
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") as FacilityType | null;
  const [filter, setFilter] = useState<FacilityType | "all">(typeParam || "all");
  const userLoc = useUserLocation();

  // Add real-time distances if GPS available
  const facilitiesWithDist = facilities.map((f) => {
    const loc = facilityLocations.find((fl) => fl.id === f.id);
    if (userLoc && loc) {
      const realDist = getDistanceKm(userLoc.lat, userLoc.lng, loc.lat, loc.lng);
      return { ...f, distanceNum: realDist, distance: formatDistance(realDist) };
    }
    return f;
  });

  const filtered = facilitiesWithDist
    .filter((f) => filter === "all" || f.type === filter)
    .sort((a, b) => a.distanceNum - b.distanceNum);

  const filterOptions: { key: FacilityType | "all"; label: string }[] = [
    { key: "all", label: t.all },
    { key: "food", label: t.food },
    { key: "toilet", label: t.toilet },
    { key: "water", label: t.water },
    { key: "medical", label: t.medical },
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
          <span className="text-godavari-300 text-xs font-medium">{filtered.length}</span>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {filterOptions.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={clsx(
                "px-3.5 py-2 rounded-full text-sm font-semibold transition-all flex-shrink-0",
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

      {/* Facility List */}
      <main className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-2">
        {filtered.map((facility) => {
          const cfg = typeConfig[facility.type];
          return (
            <div
              key={facility.id}
              className="bg-white rounded-xl p-3.5 active:scale-[0.98] transition-transform"
              style={{
                border: "1px solid var(--godavari-100)",
                boxShadow: "0 2px 8px rgba(15,40,71,0.04)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border",
                    cfg.bg,
                    cfg.border
                  )}
                >
                  <span className="text-lg">{cfg.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-godavari-950 leading-tight">
                      {facility.name[l]}
                    </p>
                    <span
                      className={clsx(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0",
                        facility.status === "open"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      )}
                    >
                      {facility.status === "open" ? t.open : t.closed}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{facility.details[l]}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-godavari-400 font-semibold">{facility.distance}</p>
                    {(() => {
                      const loc = facilityLocations.find((f) => f.id === facility.id);
                      return loc ? <NavigateButton lat={loc.lat} lng={loc.lng} lang={lang} compact /> : null;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default function FacilitiesClient({ lang }: { lang: string }) {
  return (
    <Suspense>
      <FacilitiesContent lang={lang} />
    </Suspense>
  );
}
