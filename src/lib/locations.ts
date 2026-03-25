export interface MapLocation {
  id: string;
  category: "ghat" | "food" | "toilet" | "water" | "medical" | "volunteer" | "parking" | "bus" | "auto" | "shuttle" | "boat";
  name: { te: string; hi: string; en: string };
  lat: number;
  lng: number;
  details?: { te: string; hi: string; en: string };
  distance?: string;
  crowd?: "low" | "medium" | "high";
  price?: string;
  status?: "open" | "closed";
}

// ===== GHATS (Real coordinates along Godavari River, Rajahmundry) =====
export const ghatLocations: MapLocation[] = [
  { id: "pushkar", category: "ghat", name: { te: "పుష్కర్ ఘాట్", hi: "पुष्कर घाट", en: "Pushkar Ghat" }, lat: 17.0005, lng: 81.7840, distance: "500m", crowd: "low", details: { te: "ప్రధాన పుష్కర స్నాన ఘాట్", hi: "मुख्य पुष्कर स्नान घाट", en: "Main Pushkar bathing ghat" } },
  { id: "saraswathi", category: "ghat", name: { te: "సరస్వతి ఘాట్", hi: "सरस्वती घाट", en: "Saraswathi Ghat" }, lat: 16.9990, lng: 81.7825, distance: "1.2km", crowd: "low", details: { te: "ప్రశాంతమైన స్నాన ప్రదేశం", hi: "शांत स्नान स्थल", en: "Peaceful bathing spot" } },
  { id: "kotilinga", category: "ghat", name: { te: "కోటిలింగ ఘాట్", hi: "कोटिलिंग घाट", en: "Kotilinga Ghat" }, lat: 17.0020, lng: 81.7860, distance: "800m", crowd: "medium", details: { te: "కోటిలింగేశ్వర ఆలయం సమీపంలో", hi: "कोटिलिंगेश्वर मंदिर के पास", en: "Near Kotilinga temple" } },
  { id: "gautami", category: "ghat", name: { te: "గౌతమి ఘాట్", hi: "गौतमी घाट", en: "Gautami Ghat" }, lat: 16.9975, lng: 81.7810, distance: "1.5km", crowd: "high", details: { te: "అత్యంత ప్రసిద్ధ ఘాట్", hi: "सबसे प्रसिद्ध घाट", en: "Most famous ghat" } },
  { id: "devi", category: "ghat", name: { te: "దేవి ఘాట్", hi: "देवी घाट", en: "Devi Ghat" }, lat: 16.9960, lng: 81.7795, distance: "2km", crowd: "low", details: { te: "దేవి ఆలయం సమీపంలో", hi: "देवी मंदिर के पास", en: "Near Devi temple" } },
  { id: "gowthami", category: "ghat", name: { te: "గౌతమి ఘాట్ (కొవ్వూరు)", hi: "गौतमी घाट (कोव्वूर)", en: "Gowthami Ghat" }, lat: 16.9945, lng: 81.7780, distance: "1.8km", crowd: "medium", details: { te: "కొవ్వూరు వైపు", hi: "कोव्वूर की ओर", en: "Towards Kovvur side" } },
  { id: "parnashala", category: "ghat", name: { te: "పర్ణశాల ఘాట్", hi: "पर्णशाला घाट", en: "Parnashala Ghat" }, lat: 17.0500, lng: 81.6700, distance: "3km", crowd: "low", details: { te: "సీతారాముల పర్ణశాల సమీపంలో", hi: "सीताराम पर्णशाला के पास", en: "Near Sita-Ram Parnashala" } },
  { id: "kovvur", category: "ghat", name: { te: "కొవ్వూరు ఘాట్", hi: "कोव्वूर घाट", en: "Kovvur Ghat" }, lat: 17.0150, lng: 81.7300, distance: "5km", crowd: "low", details: { te: "కొవ్వూరు పట్టణంలో", hi: "कोव्वूर शहर में", en: "In Kovvur town" } },
  { id: "dhavaleswaram", category: "ghat", name: { te: "ధవళేశ్వరం ఘాట్", hi: "धवलेश्वरम घाट", en: "Dhavaleswaram Ghat" }, lat: 16.9450, lng: 81.7350, distance: "8km", crowd: "medium", details: { te: "ధవళేశ్వరం బ్యారేజ్ సమీపంలో", hi: "धवलेश्वरम बैराज के पास", en: "Near Dhavaleswaram Barrage" } },
  { id: "bhadrachalam", category: "ghat", name: { te: "భద్రాచలం ఘాట్", hi: "भद्राचलम घाट", en: "Bhadrachalam Ghat" }, lat: 17.6685, lng: 80.8897, distance: "45km", crowd: "low", details: { te: "శ్రీ సీతారామచంద్ర ఆలయం", hi: "श्री सीताराम मंदिर", en: "Sri Sita Ramachandra Temple" } },
  { id: "antarvedi", category: "ghat", name: { te: "అంతర్వేది ఘాట్", hi: "अंतर्वेदी घाट", en: "Antarvedi Ghat" }, lat: 16.3265, lng: 81.7370, distance: "75km", crowd: "low", details: { te: "గోదావరి సముద్ర సంగమం", hi: "गोदावरी सागर संगम", en: "Godavari meets the sea" } },
  { id: "basara", category: "ghat", name: { te: "బాసర ఘాట్", hi: "बासरा घाट", en: "Basara Ghat" }, lat: 18.7395, lng: 77.9265, distance: "180km", crowd: "low", details: { te: "శ్రీ జ్ఞాన సరస్వతి ఆలయం", hi: "श्री ज्ञान सरस्वती मंदिर", en: "Sri Gnana Saraswati Temple" } },
];

// ===== FACILITIES =====
export const facilityLocations: MapLocation[] = [
  // Food
  { id: "f1", category: "food", name: { te: "అన్నదానం - పుష్కర్ ఘాట్", hi: "अन्नदानम - पुष्कर घाट", en: "Annadanam - Pushkar Ghat" }, lat: 17.0008, lng: 81.7843, distance: "300m", status: "open", details: { te: "ఉచిత భోజనం • 6AM-9PM", hi: "मुफ्त भोजन • 6AM-9PM", en: "Free meals • 6AM-9PM" } },
  { id: "f2", category: "food", name: { te: "ISKCON భోజనశాల", hi: "ISKCON भोजनालय", en: "ISKCON Food Center" }, lat: 17.0035, lng: 81.7870, distance: "800m", status: "open", details: { te: "శాకాహార భోజనం • 7AM-8PM", hi: "शाकाहारी भोजन • 7AM-8PM", en: "Vegetarian meals • 7AM-8PM" } },
  { id: "f3", category: "food", name: { te: "గవర్నమెంట్ ఆహార కేంద్రం", hi: "सरकारी भोजन केंद्र", en: "Govt Food Center" }, lat: 16.9970, lng: 81.7820, distance: "1.2km", status: "open", details: { te: "సబ్సిడీ భోజనం ₹10 • 8AM-7PM", hi: "सब्सिडी भोजन ₹10 • 8AM-7PM", en: "Subsidized meals ₹10 • 8AM-7PM" } },
  // Toilets
  { id: "t1", category: "toilet", name: { te: "సులభ్ శౌచాలయం - ఘాట్ 1", hi: "सुलभ शौचालय - घाट 1", en: "Sulabh Toilet - Ghat 1" }, lat: 17.0003, lng: 81.7838, distance: "150m", status: "open", details: { te: "24 గంటలు • ₹5", hi: "24 घंटे • ₹5", en: "24 hours • ₹5" } },
  { id: "t2", category: "toilet", name: { te: "మొబైల్ టాయిలెట్ - గౌతమి ఘాట్", hi: "मोबाइल टॉयलेट - गौतमी घाट", en: "Mobile Toilet - Gautami Ghat" }, lat: 16.9978, lng: 81.7812, distance: "600m", status: "open", details: { te: "6AM-10PM • ఉచితం", hi: "6AM-10PM • मुफ्त", en: "6AM-10PM • Free" } },
  { id: "t3", category: "toilet", name: { te: "శౌచాలయం - బస్ స్టాండ్", hi: "शौचालय - बस स्टैंड", en: "Toilet - Bus Stand" }, lat: 17.0050, lng: 81.7900, distance: "1km", status: "open", details: { te: "24 గంటలు • ₹5", hi: "24 घंटे • ₹5", en: "24 hours • ₹5" } },
  // Water
  { id: "w1", category: "water", name: { te: "మంచి నీటి కేంద్రం - పుష్కర్ ఘాట్", hi: "पेयजल केंद्र - पुष्कर घाट", en: "Drinking Water - Pushkar Ghat" }, lat: 17.0006, lng: 81.7842, distance: "200m", status: "open", details: { te: "RO వాటర్ • ఉచితం", hi: "RO वाटर • मुफ्त", en: "RO Water • Free" } },
  { id: "w2", category: "water", name: { te: "నీటి ట్యాంకర్ - కోటిలింగ ఘాట్", hi: "पानी टैंकर - कोटिलिंग घाट", en: "Water Tanker - Kotilinga Ghat" }, lat: 17.0018, lng: 81.7858, distance: "700m", status: "open", details: { te: "8AM-6PM • ఉచితం", hi: "8AM-6PM • मुफ्त", en: "8AM-6PM • Free" } },
  // Medical
  { id: "m1", category: "medical", name: { te: "ప్రాథమిక చికిత్స - పుష్కర్ ఘాట్", hi: "प्राथमिक चिकित्सा - पुष्कर घाट", en: "First Aid - Pushkar Ghat" }, lat: 17.0010, lng: 81.7845, distance: "500m", status: "open", details: { te: "24 గంటలు • ఉచితం", hi: "24 घंटे • मुफ्त", en: "24 hours • Free" } },
  { id: "m2", category: "medical", name: { te: "ప్రభుత్వ ఆసుపత్రి", hi: "सरकारी अस्पताल", en: "Government Hospital" }, lat: 17.0060, lng: 81.7920, distance: "2km", status: "open", details: { te: "24 గంటలు • అంబులెన్స్", hi: "24 घंटे • एम्बुलेंस", en: "24 hours • Ambulance" } },
  // Volunteer
  { id: "v1", category: "volunteer", name: { te: "వాలంటీర్ బూత్ - పుష్కర్ ఘాట్", hi: "स्वयंसेवक बूथ - पुष्कर घाट", en: "Volunteer Booth - Pushkar Ghat" }, lat: 17.0004, lng: 81.7839, distance: "400m", status: "open", details: { te: "సహాయం & మార్గదర్శనం", hi: "सहायता और मार्गदर्शन", en: "Help & Guidance" } },
  // Parking
  { id: "p1", category: "parking", name: { te: "పార్కింగ్ లాట్ A - మెయిన్", hi: "पार्किंग लॉट A - मेन", en: "Parking Lot A - Main" }, lat: 17.0040, lng: 81.7880, distance: "1.5km", status: "open", price: "₹50/day", details: { te: "కార్లు & బైక్‌లు • 500 స్లాట్లు", hi: "कार और बाइक • 500 स्लॉट", en: "Cars & bikes • 500 slots" } },
];

// ===== TRANSPORT =====
export const transportLocations: MapLocation[] = [
  { id: "b1", category: "bus", name: { te: "APSRTC బస్ స్టాండ్", hi: "APSRTC बस स्टैंड", en: "APSRTC Bus Stand" }, lat: 17.0055, lng: 81.7905, distance: "1.5km", price: "₹10+", details: { te: "అన్ని నగరాలకు బస్సులు • 24 గంటలు", hi: "सभी शहरों के लिए बसें • 24 घंटे", en: "Buses to all cities • 24 hours" } },
  { id: "b2", category: "bus", name: { te: "ఘాట్ షటిల్ బస్", hi: "घाट शटल बस", en: "Ghat Shuttle Bus" }, lat: 17.0007, lng: 81.7841, distance: "500m", price: "₹5", details: { te: "పుష్కర్ ఘాట్ ↔ గౌతమి ఘాట్ • ప్రతి 15 నిమి", hi: "पुष्कर घाट ↔ गौतमी घाट • हर 15 मिनट", en: "Pushkar ↔ Gautami • Every 15 min" } },
  { id: "b3", category: "shuttle", name: { te: "పార్కింగ్ షటిల్", hi: "पार्किंग शटल", en: "Parking Shuttle" }, lat: 17.0038, lng: 81.7878, distance: "200m", price: "Free", details: { te: "పార్కింగ్ లాట్ ↔ ఘాట్లు • ప్రతి 10 నిమి", hi: "पार्किंग ↔ घाट • हर 10 मिनट", en: "Parking ↔ Ghats • Every 10 min" } },
  { id: "a1", category: "auto", name: { te: "ఆటో స్టాండ్ - పుష్కర్ ఘాట్", hi: "ऑटो स्टैंड - पुष्कर घाट", en: "Auto Stand - Pushkar Ghat" }, lat: 17.0009, lng: 81.7844, distance: "400m", price: "₹30+", details: { te: "ప్రీపెయిడ్ ఆటో", hi: "प्रीपेड ऑटो", en: "Prepaid autos" } },
  { id: "a2", category: "auto", name: { te: "ఆటో స్టాండ్ - రైల్వే స్టేషన్", hi: "ऑटो स्टैंड - रेलवे स्टेशन", en: "Auto Stand - Railway Station" }, lat: 17.0080, lng: 81.7950, distance: "3km", price: "₹50+", details: { te: "ఘాట్లకు ప్రీపెయిడ్", hi: "घाटों के लिए प्रीपेड", en: "Prepaid to ghats" } },
  { id: "bt1", category: "boat", name: { te: "బోట్ సర్వీస్ - పుష్కర్ ఘాట్", hi: "नाव सेवा - पुष्कर घाट", en: "Boat Service - Pushkar Ghat" }, lat: 17.0002, lng: 81.7837, distance: "500m", price: "₹100", details: { te: "నది దర్శనం • 30 నిమి", hi: "नदी दर्शन • 30 मिनट", en: "River tour • 30 min" } },
  { id: "bt2", category: "boat", name: { te: "ఫెర్రీ - రాజమండ్రి ↔ కొవ్వూరు", hi: "फेरी - राजमंड्री ↔ कोव्वूर", en: "Ferry - Rajahmundry ↔ Kovvur" }, lat: 17.0000, lng: 81.7835, distance: "800m", price: "₹20", details: { te: "ప్రతి 30 నిమి • 6AM-6PM", hi: "हर 30 मिनट • 6AM-6PM", en: "Every 30 min • 6AM-6PM" } },
  { id: "p2", category: "parking", name: { te: "పార్కింగ్ లాట్ B - కొవ్వూరు", hi: "पार्किंग लॉट B - कोव्वूर", en: "Parking Lot B - Kovvur" }, lat: 17.0145, lng: 81.7305, distance: "5km", price: "₹40/day", details: { te: "కార్లు & బస్సులు • 300 స్లాట్లు", hi: "कार और बसें • 300 स्लॉट", en: "Cars & buses • 300 slots" } },
];

// ===== ALL LOCATIONS COMBINED =====
export function getAllLocations(): MapLocation[] {
  return [...ghatLocations, ...facilityLocations, ...transportLocations];
}

// Get location by ID
export function getLocationById(id: string): MapLocation | undefined {
  return getAllLocations().find((loc) => loc.id === id);
}

// Get coordinates by ID (for navigate buttons on existing pages)
export function getCoordinates(id: string): { lat: number; lng: number } | null {
  const loc = getLocationById(id);
  return loc ? { lat: loc.lat, lng: loc.lng } : null;
}

// Google Maps directions URL
export function getDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

// Get top N locations by voice intent category
export function getTopLocationsByCategory(
  category: string,
  limit = 3
): MapLocation[] {
  const all = getAllLocations();

  // Map voice intent category to location categories
  const categoryMap: Record<string, string[]> = {
    ghat: ["ghat"],
    food: ["food"],
    toilet: ["toilet"],
    water: ["water"],
    medical: ["medical"],
    transport: ["bus", "shuttle", "auto", "boat", "parking"],
    volunteer: ["volunteer"],
    emergency: [],
    crowd: ["ghat"],
    alerts: [],
    map: [],
    home: [],
  };

  const cats = categoryMap[category] || [];
  if (cats.length === 0) return [];

  return all
    .filter((loc) => cats.includes(loc.category))
    .slice(0, limit);
}

// Category display config
export const categoryConfig: Record<string, { emoji: string; color: string; markerColor: string }> = {
  ghat: { emoji: "🛕", color: "#1b5bae", markerColor: "#1b5bae" },
  food: { emoji: "🍲", color: "#c2410c", markerColor: "#ea580c" },
  toilet: { emoji: "🚻", color: "#0f766e", markerColor: "#14b8a6" },
  water: { emoji: "💧", color: "#0369a1", markerColor: "#0ea5e9" },
  medical: { emoji: "🏥", color: "#be123c", markerColor: "#f43f5e" },
  volunteer: { emoji: "🤝", color: "#15803d", markerColor: "#22c55e" },
  parking: { emoji: "🅿️", color: "#4338ca", markerColor: "#6366f1" },
  bus: { emoji: "🚌", color: "#1e40af", markerColor: "#3b82f6" },
  auto: { emoji: "🛺", color: "#b45309", markerColor: "#f59e0b" },
  shuttle: { emoji: "🚐", color: "#047857", markerColor: "#10b981" },
  boat: { emoji: "🚤", color: "#0284c7", markerColor: "#38bdf8" },
};
