"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import NavigateButton from "@/components/ui/NavigateButton";
import { transportLocations } from "@/lib/locations";
import { useUserLocation, getDistanceKm, formatDistance } from "@/lib/useUserLocation";

// ─── Local Transport Types & Data (unchanged) ───

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

// ─── Train & Bus Schedule Types & Data ───

interface TrainSchedule {
  id: string;
  name: { te: string; hi: string; en: string };
  number: string;
  to: string;
  toName: { te: string; hi: string; en: string };
  departs: string;
  platform: number;
  duration: string;
  type: string;
}

interface BusSchedule {
  id: string;
  name: { te: string; hi: string; en: string };
  to: string;
  toName: { te: string; hi: string; en: string };
  departs: string;
  type: string;
  duration: string;
  fare: string;
}

const destinationNames: Record<string, { te: string; hi: string; en: string }> = {
  hyderabad: { te: "హైదరాబాద్/సికింద్రాబాద్", hi: "हैदराबाद/सिकंदराबाद", en: "Hyderabad/Secunderabad" },
  vijayawada: { te: "విజయవాడ", hi: "विजयवाड़ा", en: "Vijayawada" },
  visakhapatnam: { te: "విశాఖపట్నం", hi: "विशाखापट्टनम", en: "Visakhapatnam" },
  kakinada: { te: "కాకినాడ", hi: "काकीनाडा", en: "Kakinada" },
  tirupati: { te: "తిరుపతి", hi: "तिरुपति", en: "Tirupati" },
};

const destinations = ["hyderabad", "vijayawada", "visakhapatnam", "kakinada", "tirupati"] as const;

const trainSchedules: TrainSchedule[] = [
  { id: "t1", name: { te: "గోదావరి ఎక్స్‌ప్రెస్", hi: "गोदावरी एक्सप्रेस", en: "Godavari Express" }, number: "12727", to: "hyderabad", toName: destinationNames.hyderabad, departs: "14:30", platform: 1, duration: "10h 30m", type: "Superfast" },
  { id: "t2", name: { te: "ఈస్ట్ కోస్ట్ ఎక్స్‌ప్రెస్", hi: "ईस्ट कोस्ट एक्सप्रेस", en: "East Coast Express" }, number: "18645", to: "hyderabad", toName: destinationNames.hyderabad, departs: "22:30", platform: 3, duration: "12h 00m", type: "Express" },
  { id: "t3", name: { te: "జన్మభూమి ఎక్స్‌ప్రెస్", hi: "जन्मभूमि एक्सप्रेस", en: "Janmabhoomi Express" }, number: "12805", to: "vijayawada", toName: destinationNames.vijayawada, departs: "06:45", platform: 2, duration: "4h 15m", type: "Superfast" },
  { id: "t4", name: { te: "రాజమహేంద్రవరం-విజయవాడ ప్యాసింజర్", hi: "राजमहेंद्रवरम-विजयवाड़ा पैसेंजर", en: "Rajahmundry-Vijayawada Passenger" }, number: "57264", to: "vijayawada", toName: destinationNames.vijayawada, departs: "10:30", platform: 4, duration: "5h 30m", type: "Passenger" },
  { id: "t5", name: { te: "విశాఖ ఎక్స్‌ప్రెస్", hi: "विशाखा एक्सप्रेस", en: "Visakha Express" }, number: "17488", to: "visakhapatnam", toName: destinationNames.visakhapatnam, departs: "16:15", platform: 1, duration: "5h 00m", type: "Express" },
  { id: "t6", name: { te: "గౌతమి ఎక్స్‌ప్రెస్", hi: "गौतमी एक्सप्रेस", en: "Gautami Express" }, number: "12737", to: "visakhapatnam", toName: destinationNames.visakhapatnam, departs: "08:00", platform: 2, duration: "4h 30m", type: "Superfast" },
  { id: "t7", name: { te: "రాజమహేంద్రవరం-కాకినాడ ప్యాసింజర్", hi: "राजमहेंद्रवरम-काकीनाडा पैसेंजर", en: "Rajahmundry-Kakinada Passenger" }, number: "57379", to: "kakinada", toName: destinationNames.kakinada, departs: "07:30", platform: 3, duration: "1h 30m", type: "Passenger" },
  { id: "t8", name: { te: "పుష్కరం స్పెషల్", hi: "पुष्करम स्पेशल", en: "Pushkaram Special" }, number: "07117", to: "kakinada", toName: destinationNames.kakinada, departs: "12:00", platform: 5, duration: "1h 15m", type: "Special" },
  { id: "t9", name: { te: "రాజమహేంద్రవరం-తిరుపతి ఎక్స్‌ప్రెస్", hi: "राजमहेंद्रवरम-तिरुपति एक्सप्रेस", en: "Rajahmundry-Tirupati Express" }, number: "17481", to: "tirupati", toName: destinationNames.tirupati, departs: "20:00", platform: 2, duration: "14h 00m", type: "Express" },
  { id: "t10", name: { te: "పుష్కరం స్పెషల్ తిరుపతి", hi: "पुष्करम स्पेशल तिरुपति", en: "Pushkaram Special Tirupati" }, number: "07119", to: "tirupati", toName: destinationNames.tirupati, departs: "09:00", platform: 4, duration: "13h 00m", type: "Special" },
];

const busSchedules: BusSchedule[] = [
  { id: "bs1", name: { te: "APSRTC సూపర్ లగ్జరీ", hi: "APSRTC सुपर लग्ज़री", en: "APSRTC Super Luxury" }, to: "hyderabad", toName: destinationNames.hyderabad, departs: "14:00", type: "Super Luxury AC", duration: "7h 00m", fare: "₹900" },
  { id: "bs2", name: { te: "APSRTC ఎక్స్‌ప్రెస్", hi: "APSRTC एक्सप्रेस", en: "APSRTC Express" }, to: "hyderabad", toName: destinationNames.hyderabad, departs: "18:00", type: "Express Non-AC", duration: "8h 30m", fare: "₹550" },
  { id: "bs3", name: { te: "APSRTC గరుడ ప్లస్", hi: "APSRTC गरुड़ प्लस", en: "APSRTC Garuda Plus" }, to: "vijayawada", toName: destinationNames.vijayawada, departs: "07:00", type: "Garuda AC", duration: "4h 00m", fare: "₹400" },
  { id: "bs4", name: { te: "APSRTC ఎక్స్‌ప్రెస్", hi: "APSRTC एक्सप्रेस", en: "APSRTC Express" }, to: "vijayawada", toName: destinationNames.vijayawada, departs: "11:30", type: "Express Non-AC", duration: "5h 00m", fare: "₹250" },
  { id: "bs5", name: { te: "APSRTC సూపర్ లగ్జరీ", hi: "APSRTC सुपर लग्ज़री", en: "APSRTC Super Luxury" }, to: "visakhapatnam", toName: destinationNames.visakhapatnam, departs: "09:00", type: "Super Luxury AC", duration: "5h 00m", fare: "₹600" },
  { id: "bs6", name: { te: "APSRTC ఎక్స్‌ప్రెస్", hi: "APSRTC एक्सप्रेस", en: "APSRTC Express" }, to: "visakhapatnam", toName: destinationNames.visakhapatnam, departs: "15:30", type: "Express Non-AC", duration: "6h 30m", fare: "₹350" },
  { id: "bs7", name: { te: "APSRTC డీలక్స్", hi: "APSRTC डीलक्स", en: "APSRTC Deluxe" }, to: "kakinada", toName: destinationNames.kakinada, departs: "08:00", type: "Deluxe Non-AC", duration: "1h 30m", fare: "₹120" },
  { id: "bs8", name: { te: "APSRTC సిటీ బస్", hi: "APSRTC सिटी बस", en: "APSRTC City Bus" }, to: "kakinada", toName: destinationNames.kakinada, departs: "Every 15 min", type: "City Ordinary", duration: "2h 00m", fare: "₹80" },
  { id: "bs9", name: { te: "APSRTC ఎక్స్‌ప్రెస్", hi: "APSRTC एक्सप्रेस", en: "APSRTC Express" }, to: "tirupati", toName: destinationNames.tirupati, departs: "17:00", type: "Express Non-AC", duration: "15h 00m", fare: "₹700" },
  { id: "bs10", name: { te: "APSRTC గరుడ ప్లస్", hi: "APSRTC गरुड़ प्लस", en: "APSRTC Garuda Plus" }, to: "tirupati", toName: destinationNames.tirupati, departs: "20:30", type: "Garuda AC", duration: "13h 00m", fare: "₹1100" },
];

// ─── Translations ───

const translations = {
  te: {
    title: "రవాణా",
    subtitle: "ప్రయాణ సమాచారం",
    bus: "బస్సులు",
    auto: "ఆటోలు",
    parking: "పార్కింగ్",
    boat: "బోట్లు",
    shuttle: "షటిల్",
    local: "స్థానిక రవాణా",
    trainsAndBuses: "రైళ్ళు & బస్సులు",
    search: "వెతుకు",
    trains: "రైళ్ళు",
    buses: "బస్సులు",
    from: "ఎక్కడ నుండి",
    to: "ఎక్కడికి",
    selectDestination: "గమ్యస్థానం ఎంచుకోండి",
    departsAt: "బయలుదేరే సమయం",
    platform: "ప్లాట్‌ఫాం",
    duration: "సమయం",
    fare: "ఛార్జ్",
    upcoming: "రాబోయే ప్రయాణాలు",
    noResults: "గమ్యస్థానం ఎంచుకోండి",
    rajahmundry: "రాజమహేంద్రవరం",
  },
  hi: {
    title: "परिवहन",
    subtitle: "यात्रा जानकारी",
    bus: "बसें",
    auto: "ऑटो",
    parking: "पार्किंग",
    boat: "नाव",
    shuttle: "शटल",
    local: "स्थानीय परिवहन",
    trainsAndBuses: "ट्रेन और बस",
    search: "खोजें",
    trains: "ट्रेनें",
    buses: "बसें",
    from: "कहां से",
    to: "कहां तक",
    selectDestination: "गंतव्य चुनें",
    departsAt: "प्रस्थान",
    platform: "प्लेटफॉर्म",
    duration: "अवधि",
    fare: "किराया",
    upcoming: "आगामी यात्राएं",
    noResults: "गंतव्य चुनें",
    rajahmundry: "राजमहेंद्रवरम",
  },
  en: {
    title: "Transport",
    subtitle: "Travel information",
    bus: "Buses",
    auto: "Autos",
    parking: "Parking",
    boat: "Boats",
    shuttle: "Shuttle",
    local: "Local Transport",
    trainsAndBuses: "Trains & Buses",
    search: "Search",
    trains: "Trains",
    buses: "Buses",
    from: "From",
    to: "To",
    selectDestination: "Select Destination",
    departsAt: "Departs",
    platform: "Platform",
    duration: "Duration",
    fare: "Fare",
    upcoming: "Upcoming Departures",
    noResults: "Select a destination to see results",
    rajahmundry: "Rajahmundry",
  },
};

type Lang = keyof typeof translations;
type TabKey = "local" | "schedules" | "search";
type ModeFilter = "all" | "trains" | "buses";

// ─── Shared Schedule Card Components ───

function TrainCard({ train, l, t }: { train: TrainSchedule; l: Lang; t: (typeof translations)[Lang] }) {
  const typeBadgeColor: Record<string, string> = {
    Superfast: "bg-indigo-100 text-indigo-700",
    Express: "bg-purple-100 text-purple-700",
    Passenger: "bg-slate-100 text-slate-600",
    Special: "bg-amber-100 text-amber-700",
  };
  return (
    <div
      className="bg-white rounded-xl p-3.5"
      style={{ border: "1px solid #e0e7ff", boxShadow: "0 2px 8px rgba(67,56,202,0.06)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-indigo-950 leading-tight">{train.name[l]}</p>
            <span className="text-[10px] font-mono text-indigo-400">#{train.number}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{train.toName[l]}</p>
        </div>
        <span className={clsx("text-[10px] font-semibold px-2 py-0.5 rounded-full", typeBadgeColor[train.type] || "bg-slate-100 text-slate-600")}>
          {train.type}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-2.5 text-[11px]">
        <div className="flex items-center gap-1">
          <span className="text-indigo-400 font-medium">{t.departsAt}:</span>
          <span className="font-bold text-indigo-900">{train.departs}</span>
        </div>
        <div className="w-px h-3 bg-indigo-200" />
        <div className="flex items-center gap-1">
          <span className="text-indigo-400 font-medium">{t.platform}:</span>
          <span className="font-bold text-indigo-900">{train.platform}</span>
        </div>
        <div className="w-px h-3 bg-indigo-200" />
        <div className="flex items-center gap-1">
          <span className="text-indigo-400 font-medium">{t.duration}:</span>
          <span className="font-bold text-indigo-900">{train.duration}</span>
        </div>
      </div>
    </div>
  );
}

function BusCard({ bus, l, t }: { bus: BusSchedule; l: Lang; t: (typeof translations)[Lang] }) {
  return (
    <div
      className="bg-white rounded-xl p-3.5"
      style={{ border: "1px solid #dbeafe", boxShadow: "0 2px 8px rgba(37,99,235,0.06)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-blue-950 leading-tight">{bus.name[l]}</p>
          <p className="text-xs text-slate-500 mt-0.5">{bus.toName[l]}</p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
          {bus.type}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-2.5 text-[11px]">
        <div className="flex items-center gap-1">
          <span className="text-blue-400 font-medium">{t.departsAt}:</span>
          <span className="font-bold text-blue-900">{bus.departs}</span>
        </div>
        <div className="w-px h-3 bg-blue-200" />
        <div className="flex items-center gap-1">
          <span className="text-blue-400 font-medium">{t.duration}:</span>
          <span className="font-bold text-blue-900">{bus.duration}</span>
        </div>
        <div className="w-px h-3 bg-blue-200" />
        <div className="flex items-center gap-1">
          <span className="text-blue-400 font-medium">{t.fare}:</span>
          <span className="font-bold text-blue-900">{bus.fare}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───

function TransportContent({ lang }: { lang: string }) {
  const l = (lang as Lang) || "te";
  const t = translations[l];
  const router = useRouter();
  const searchParams = useSearchParams();
  const userLoc = useUserLocation();
  const [activeTab, setActiveTab] = useState<TabKey>("local");
  const [selectedDest, setSelectedDest] = useState<string>("");
  const [modeFilter, setModeFilter] = useState<ModeFilter>("all");

  // Read URL params from voice navigation: ?dest=vijayawada&mode=bus
  useEffect(() => {
    const dest = searchParams.get("dest");
    const mode = searchParams.get("mode");
    if (dest && destinations.includes(dest as typeof destinations[number])) {
      setActiveTab("search");
      setSelectedDest(dest);
      if (mode === "trains" || mode === "buses") {
        setModeFilter(mode);
      } else {
        setModeFilter("all");
      }
    }
  }, [searchParams]);

  // ─── Local transport (existing logic) ───
  const optionsWithDist = transportOptions.map((item) => {
    const loc = transportLocations.find((tl) => tl.id === item.id);
    if (userLoc && loc) {
      const realDist = getDistanceKm(userLoc.lat, userLoc.lng, loc.lat, loc.lng);
      return { ...item, distance: formatDistance(realDist) };
    }
    return item;
  });

  const grouped: { type: TransportType; items: TransportOption[] }[] = [];
  const typeOrder: TransportType[] = ["shuttle", "bus", "auto", "boat", "parking"];
  for (const type of typeOrder) {
    const items = optionsWithDist.filter((o) => o.type === type);
    if (items.length > 0) grouped.push({ type, items });
  }

  // ─── Search filter (respects mode: trains / buses / all) ───
  const filteredTrains = selectedDest && modeFilter !== "buses" ? trainSchedules.filter((t) => t.to === selectedDest) : [];
  const filteredBuses = selectedDest && modeFilter !== "trains" ? busSchedules.filter((b) => b.to === selectedDest) : [];

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "local", label: t.local, icon: "🚐" },
    { key: "schedules", label: t.trainsAndBuses, icon: "🚆" },
    { key: "search", label: t.search, icon: "🔍" },
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

        {/* Tab Bar */}
        <div className="flex gap-2 px-4 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                activeTab === tab.key
                  ? "text-white shadow-md"
                  : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white/80"
              )}
              style={
                activeTab === tab.key
                  ? { background: "linear-gradient(135deg, #e07422 0%, #f59e0b 100%)" }
                  : undefined
              }
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ─── Tab 1: Local Transport (existing) ─── */}
      {activeTab === "local" && (
        <main className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-4">
          {grouped.map((group) => {
            const cfg = typeConfig[group.type];
            const groupLabel = t[group.type as keyof typeof t] || group.type;

            return (
              <div key={group.type}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-base">{cfg.emoji}</span>
                  <p className={clsx("text-xs font-bold", cfg.color)}>{groupLabel}</p>
                </div>

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
                            const loc = transportLocations.find((tl) => tl.id === item.id);
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
      )}

      {/* ─── Tab 2: Trains & Buses ─── */}
      {activeTab === "schedules" && (
        <main className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-5">
          {/* Section label */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-medium text-slate-400">{t.upcoming}</span>
          </div>

          {/* Trains */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-base">🚆</span>
              <p className="text-xs font-bold text-indigo-800">{t.trains}</p>
            </div>
            <div className="space-y-2">
              {trainSchedules.map((train) => (
                <TrainCard key={train.id} train={train} l={l} t={t} />
              ))}
            </div>
          </div>

          {/* Buses */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-base">🚌</span>
              <p className="text-xs font-bold text-blue-800">{t.buses}</p>
            </div>
            <div className="space-y-2">
              {busSchedules.map((bus) => (
                <BusCard key={bus.id} bus={bus} l={l} t={t} />
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ─── Tab 3: Search ─── */}
      {activeTab === "search" && (
        <main className="flex-1 overflow-y-auto px-4 pt-3 pb-4 space-y-4">
          {/* Search Form */}
          <div className="bg-white rounded-xl p-4" style={{ border: "1px solid var(--godavari-100)", boxShadow: "0 2px 8px rgba(15,40,71,0.04)" }}>
            {/* From */}
            <div className="mb-3">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{t.from}</label>
              <div className="mt-1 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700">
                {t.rajahmundry} (Rajahmundry)
              </div>
            </div>
            {/* To */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">{t.to}</label>
              <select
                value={selectedDest}
                onChange={(e) => { setSelectedDest(e.target.value); setModeFilter("all"); }}
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-saffron-400 focus:border-saffron-400"
              >
                <option value="">{t.selectDestination}</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {destinationNames[dest][l]} ({destinationNames[dest].en})
                  </option>
                ))}
              </select>
            </div>

            {/* Mode filter pills */}
            {selectedDest && (
              <div className="flex gap-2 mt-3">
                {([["all", `${t.trains} & ${t.buses}`], ["trains", t.trains], ["buses", t.buses]] as [ModeFilter, string][]).map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => setModeFilter(mode)}
                    className={clsx(
                      "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                      modeFilter === mode
                        ? "bg-godavari-700 text-white shadow-sm"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    )}
                  >
                    {mode === "trains" ? "🚆 " : mode === "buses" ? "🚌 " : ""}{label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          {!selectedDest ? (
            <div className="text-center py-10">
              <p className="text-sm text-slate-400">{t.noResults}</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Filtered Trains */}
              {filteredTrains.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-base">🚆</span>
                    <p className="text-xs font-bold text-indigo-800">{t.trains}</p>
                  </div>
                  <div className="space-y-2">
                    {filteredTrains.map((train) => (
                      <TrainCard key={train.id} train={train} l={l} t={t} />
                    ))}
                  </div>
                </div>
              )}

              {/* Filtered Buses */}
              {filteredBuses.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="text-base">🚌</span>
                    <p className="text-xs font-bold text-blue-800">{t.buses}</p>
                  </div>
                  <div className="space-y-2">
                    {filteredBuses.map((bus) => (
                      <BusCard key={bus.id} bus={bus} l={l} t={t} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default function TransportClient({ lang }: { lang: string }) {
  return (
    <Suspense>
      <TransportContent lang={lang} />
    </Suspense>
  );
}
