/**
 * Google Sheets Data Layer
 *
 * Fetches live data from published Google Sheets (CSV format).
 * Falls back to hardcoded defaults if fetch fails.
 *
 * Setup:
 * 1. Create a Google Sheet with "ghats" and "alerts" tabs
 * 2. File → Share → Publish to web → select tab → CSV
 * 3. Paste the URLs below
 */

// ━━━ CONFIGURE THESE URLs ━━━
// Replace with your published Google Sheet CSV URLs
// Format: https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={TAB_NAME}
const SHEET_BASE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSWMHxoFDLULrinEc1pX37Kqg0NsrYhjCKiJ4ztJHTo0ep-35F4Q5Ydb4RgSQy4dqXg7wWdaKEDeFuQ/pub";

// Google Sheets /pub endpoint requires gid (numeric sheet ID), NOT sheet name.
// To find gid: open sheet → click tab → check URL for #gid=XXXXXXX
// First tab is always gid=0. Find the alerts tab gid from the URL.
const SHEETS_CONFIG = {
  ghats: `${SHEET_BASE}?output=csv&gid=0`,
  alerts: `${SHEET_BASE}?output=csv&gid=104253538`,
};

// ━━━ Types ━━━
type CrowdLevel = "low" | "medium" | "high";

export interface GhatData {
  id: string;
  name: { te: string; hi: string; en: string };
  lat: number;
  lng: number;
  distance: string;
  distanceNum: number;
  crowd: CrowdLevel;
  details: { te: string; hi: string; en: string };
  facilities: string[];
  area: { te: string; hi: string; en: string };
}

export interface AlertData {
  id: string;
  type: "safety" | "crowd" | "weather" | "info";
  title: { te: string; hi: string; en: string };
  message: { te: string; hi: string; en: string };
  time: string;
  active: boolean;
}

// ━━━ CSV Parser ━━━
function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  // Parse header row — handle quoted values, normalize to lowercase
  const headers = parseCSVRow(lines[0]).map((h) => h.trim().toLowerCase());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // skip empty rows
    const values = parseCSVRow(line);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// ━━━ Fetch Ghats ━━━
export async function fetchGhats(): Promise<GhatData[]> {
  if (!SHEETS_CONFIG.ghats) return DEFAULT_GHATS;

  try {
    const res = await fetch(SHEETS_CONFIG.ghats, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();
    const rows = parseCSV(csv);

    if (rows.length === 0) return DEFAULT_GHATS;

    return rows.map((r) => ({
      id: r.id || "",
      name: {
        te: r.name_te || "",
        hi: r.name_hi || "",
        en: r.name_en || "",
      },
      lat: parseFloat(r.lat) || 0,
      lng: parseFloat(r.lng) || 0,
      distance: r.distance || "",
      distanceNum: parseFloat(r.distance_num) || 0,
      crowd: (r.crowd as CrowdLevel) || "low",
      details: {
        te: r.details_te || "",
        hi: r.details_hi || "",
        en: r.details_en || "",
      },
      facilities: (r.facilities || "").split("|").filter(Boolean),
      area: {
        te: r.area_te || "",
        hi: r.area_hi || "",
        en: r.area_en || "",
      },
    }));
  } catch (err) {
    console.warn("Failed to fetch ghats from Google Sheets, using defaults:", err);
    return DEFAULT_GHATS;
  }
}

// ━━━ Fetch Alerts ━━━
export async function fetchAlerts(): Promise<AlertData[]> {
  if (!SHEETS_CONFIG.alerts) return DEFAULT_ALERTS;

  try {
    const res = await fetch(SHEETS_CONFIG.alerts, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();
    console.log("[Alerts] Raw CSV (first 500 chars):", csv.substring(0, 500));
    const rows = parseCSV(csv);

    if (rows.length === 0) {
      console.warn("[Alerts] No rows parsed from CSV, using defaults");
      return DEFAULT_ALERTS;
    }

    // Validate we got alerts data, not ghats data (wrong gid)
    const headers = Object.keys(rows[0]);
    if (!headers.includes("title_te") && !headers.includes("message_te")) {
      console.warn("[Alerts] Wrong sheet returned (got headers:", headers, "). Using defaults. Check the gid in SHEETS_CONFIG.");
      return DEFAULT_ALERTS;
    }

    console.log("[Alerts] Fetched", rows.length, "rows. Headers:", headers);
    console.log("[Alerts] First row:", JSON.stringify(rows[0]));

    return rows.map((r) => ({
      id: r.id || "",
      type: (r.type as AlertData["type"]) || "info",
      title: {
        te: r.title_te || "",
        hi: r.title_hi || "",
        en: r.title_en || "",
      },
      message: {
        te: r.message_te || "",
        hi: r.message_hi || "",
        en: r.message_en || "",
      },
      time: r.time || "",
      active: !!r.active && r.active.toLowerCase() !== "false" && r.active !== "0" && r.active.toLowerCase() !== "no",
    }));
  } catch (err) {
    console.warn("Failed to fetch alerts from Google Sheets, using defaults:", err);
    return DEFAULT_ALERTS;
  }
}

// ━━━ Default Data (fallback) ━━━
const DEFAULT_GHATS: GhatData[] = [
  { id: "pushkar", name: { te: "పుష్కర్ ఘాట్", hi: "पुष्कर घाट", en: "Pushkar Ghat" }, lat: 17.0005, lng: 81.7840, distance: "500m", distanceNum: 0.5, crowd: "low", facilities: ["🚻", "🍲", "💧", "🅿️"], area: { te: "రాజమండ్రి", hi: "राजमंड्री", en: "Rajahmundry" }, details: { te: "ప్రధాన పుష్కర స్నాన ఘాట్", hi: "मुख्य पुष्कर स्नान घाट", en: "Main Pushkar bathing ghat" } },
  { id: "saraswathi", name: { te: "సరస్వతి ఘాట్", hi: "सरस्वती घाट", en: "Saraswathi Ghat" }, lat: 16.9990, lng: 81.7825, distance: "1.2km", distanceNum: 1.2, crowd: "low", facilities: ["🚻", "💧"], area: { te: "రాజమండ్రి", hi: "राजमंड्री", en: "Rajahmundry" }, details: { te: "ప్రశాంతమైన స్నాన ప్రదేశం", hi: "शांत स्नान स्थल", en: "Peaceful bathing spot" } },
  { id: "kotilinga", name: { te: "కోటిలింగ ఘాట్", hi: "कोटिलिंग घाट", en: "Kotilinga Ghat" }, lat: 17.0020, lng: 81.7860, distance: "800m", distanceNum: 0.8, crowd: "medium", facilities: ["🚻", "🍲", "💧"], area: { te: "రాజమండ్రి", hi: "राजमंड्री", en: "Rajahmundry" }, details: { te: "కోటిలింగేశ్వర ఆలయం సమీపంలో", hi: "कोटिलिंगेश्वर मंदिर के पास", en: "Near Kotilinga temple" } },
  { id: "gautami", name: { te: "గౌతమి ఘాట్", hi: "गौतमी घाट", en: "Gautami Ghat" }, lat: 16.9975, lng: 81.7810, distance: "1.5km", distanceNum: 1.5, crowd: "high", facilities: ["🚻", "🍲", "💧", "🅿️", "🏥"], area: { te: "రాజమండ్రి", hi: "राजमंड्री", en: "Rajahmundry" }, details: { te: "అత్యంత ప్రసిద్ధ ఘాట్", hi: "सबसे प्रसिद्ध घाट", en: "Most famous ghat" } },
  { id: "devi", name: { te: "దేవి ఘాట్", hi: "देवी घाट", en: "Devi Ghat" }, lat: 16.9960, lng: 81.7795, distance: "2km", distanceNum: 2, crowd: "low", facilities: ["🚻", "💧"], area: { te: "రాజమండ్రి", hi: "राजमंड्री", en: "Rajahmundry" }, details: { te: "దేవి ఆలయం సమీపంలో", hi: "देवी मंदिर के पास", en: "Near Devi temple" } },
  { id: "gowthami", name: { te: "గౌతమి ఘాట్", hi: "गौथमी घाट", en: "Gowthami Ghat" }, lat: 16.9945, lng: 81.7780, distance: "1.8km", distanceNum: 1.8, crowd: "medium", facilities: ["🚻", "🍲", "💧", "🅿️"], area: { te: "రాజమండ్రి", hi: "राजमंड्री", en: "Rajahmundry" }, details: { te: "కొవ్వూరు వైపు", hi: "कोव्वूर की ओर", en: "Towards Kovvur side" } },
  { id: "parnashala", name: { te: "పర్ణశాల ఘాట్", hi: "पर्णशाला घाट", en: "Parnashala Ghat" }, lat: 17.0500, lng: 81.6700, distance: "3km", distanceNum: 3, crowd: "low", facilities: ["🚻", "💧"], area: { te: "భద్రాచలం", hi: "भद्राचलम", en: "Bhadrachalam" }, details: { te: "సీతారాముల పర్ణశాల సమీపంలో", hi: "सीताराम पर्णशाला के पास", en: "Near Sita-Ram Parnashala" } },
  { id: "kovvur", name: { te: "కొవ్వూరు ఘాట్", hi: "कोव्वूर घाट", en: "Kovvur Ghat" }, lat: 17.0150, lng: 81.7300, distance: "5km", distanceNum: 5, crowd: "low", facilities: ["🚻", "🍲", "💧", "🅿️"], area: { te: "కొవ్వూరు", hi: "कोव्वूर", en: "Kovvur" }, details: { te: "కొవ్వూరు పట్టణంలో", hi: "कोव्वूर शहर में", en: "In Kovvur town" } },
  { id: "dhavaleswaram", name: { te: "ధవళేశ్వరం ఘాట్", hi: "धवलेश्वरम घाट", en: "Dhavaleswaram Ghat" }, lat: 16.9450, lng: 81.7350, distance: "8km", distanceNum: 8, crowd: "medium", facilities: ["🚻", "💧", "🅿️"], area: { te: "ధవళేశ్వరం", hi: "धवलेश्वरम", en: "Dhavaleswaram" }, details: { te: "ధవళేశ్వరం బ్యారేజ్ సమీపంలో", hi: "धवलेश्वरम बैराज के पास", en: "Near Dhavaleswaram Barrage" } },
  { id: "bhadrachalam", name: { te: "భద్రాచలం ఘాట్", hi: "भद्राचलम घाट", en: "Bhadrachalam Ghat" }, lat: 17.6685, lng: 80.8897, distance: "45km", distanceNum: 45, crowd: "low", facilities: ["🚻", "🍲", "💧", "🅿️", "🏥"], area: { te: "భద్రాచలం", hi: "भद्राचलम", en: "Bhadrachalam" }, details: { te: "శ్రీ సీతారామచంద్ర ఆలయం", hi: "श्री सीताराम मंदिर", en: "Sri Sita Ramachandra Temple" } },
  { id: "antarvedi", name: { te: "అంతర్వేది ఘాట్", hi: "अंतर्वेदी घाट", en: "Antarvedi Ghat" }, lat: 16.3265, lng: 81.7370, distance: "75km", distanceNum: 75, crowd: "low", facilities: ["🚻", "💧"], area: { te: "అంతర్వేది", hi: "अंतर्वेदी", en: "Antarvedi" }, details: { te: "గోదావరి సముద్ర సంగమం", hi: "गोदावरी सागर संगम", en: "Godavari meets the sea" } },
  { id: "basara", name: { te: "బాసర ఘాట్", hi: "बसारा घाट", en: "Basara Ghat" }, lat: 18.7395, lng: 77.9265, distance: "180km", distanceNum: 180, crowd: "low", facilities: ["🚻", "🍲", "💧", "🅿️"], area: { te: "బాసర", hi: "बसारा", en: "Basara" }, details: { te: "శ్రీ జ్ఞాన సరస్వతి ఆలయం", hi: "श्री ज्ञान सरस्वती मंदिर", en: "Sri Gnana Saraswati Temple" } },
];

const DEFAULT_ALERTS: AlertData[] = [
  { id: "1", type: "crowd", active: true, title: { te: "తక్కువ రద్దీ", hi: "कम भीड़", en: "Low Crowd Alert" }, message: { te: "పుష్కర్ ఘాట్ వద్ద తక్కువ రద్దీ ఉంది. సురక్షితంగా స్నానం చేయవచ్చు.", hi: "पुष्कर घाट पर कम भीड़ है। सुरक्षित रूप से स्नान कर सकते हैं।", en: "Low crowd at Pushkar Ghat. Safe for bathing." }, time: "10 min" },
  { id: "2", type: "crowd", active: true, title: { te: "ఎక్కువ రద్దీ హెచ్చరిక", hi: "अधिक भीड़ चेतावनी", en: "High Crowd Warning" }, message: { te: "గౌతమి ఘాట్ వద్ద ఎక్కువ రద్దీ ఉంది. దయచేసి వేరే ఘాట్ ఎంచుకోండి.", hi: "गौतमी घाट पर अधिक भीड़ है। कृपया अन्य घाट चुनें।", en: "High crowd at Gautami Ghat. Please choose another ghat." }, time: "25 min" },
  { id: "3", type: "weather", active: true, title: { te: "వాతావరణ హెచ్చరిక", hi: "मौसम चेतावनी", en: "Weather Advisory" }, message: { te: "మధ్యాహ్నం 2 గంటల తర్వాత వర్షం పడే అవకాశం ఉంది. గొడుగులు తీసుకెళ్ళండి.", hi: "दोपहर 2 बजे के बाद बारिश की संभावना है। छाता लेकर जाएं।", en: "Rain expected after 2 PM. Carry umbrellas." }, time: "1 hr" },
  { id: "4", type: "safety", active: true, title: { te: "భద్రతా సూచన", hi: "सुरक्षा सूचना", en: "Safety Notice" }, message: { te: "ఘాట్ మెట్లపై జాగ్రత్తగా నడవండి. తడి మెట్లపై జారవచ్చు.", hi: "घाट सीढ़ियों पर सावधानी से चलें। गीली सीढ़ियाँ फिसलन भरी हो सकती हैं।", en: "Walk carefully on ghat steps. Wet steps can be slippery." }, time: "2 hr" },
  { id: "5", type: "info", active: true, title: { te: "పుష్కరాల కార్యక్రమం", hi: "पुष्करालु कार्यक्रम", en: "Pushkaralu Schedule" }, message: { te: "సాయంత్రం 6 గంటలకు మహా హారతి పుష్కర్ ఘాట్ వద్ద జరుగుతుంది.", hi: "शाम 6 बजे महा आरती पुष्कर घाट पर होगी।", en: "Maha Harati at Pushkar Ghat at 6 PM today." }, time: "3 hr" },
  { id: "6", type: "safety", active: false, title: { te: "నీటి నాణ్యత", hi: "पानी की गुणवत्ता", en: "Water Quality Update" }, message: { te: "అన్ని ఘాట్ల వద్ద నీటి నాణ్యత మంచిగా ఉంది. స్నానానికి అనుకూలం.", hi: "सभी घाटों पर पानी की गुणवत्ता अच्छी है। स्नान के लिए उपयुक्त।", en: "Water quality is good at all ghats. Suitable for bathing." }, time: "5 hr" },
];
