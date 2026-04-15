"use client";

import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface SafetyTip {
  id: string;
  category: string;
  emoji: string;
  text: { te: string; hi: string; en: string };
}

const safetyTips: SafetyTip[] = [
  // River Safety
  { id: "r1", category: "river", emoji: "🚫", text: { te: "లోతైన నీటిలోకి వెళ్ళకండి. నిర్ణీత స్నాన ప్రాంతాల్లోనే స్నానం చేయండి.", hi: "गहरे पानी में न जाएं। निर्धारित स्नान क्षेत्रों में ही नहाएं।", en: "Don't enter deep water. Stay in designated bathing areas only." } },
  { id: "r2", category: "river", emoji: "👨‍👧", text: { te: "పిల్లలను, వృద్ధులను గట్టిగా పట్టుకోండి. అందుబాటులో ఉన్న తాళ్ళను ఉపయోగించండి.", hi: "बच्चों और बुज़ुर्गों को मज़बूती से पकड़ें। उपलब्ध रस्सियों का उपयोग करें।", en: "Hold children and elderly firmly. Use ropes where provided." } },
  { id: "r3", category: "river", emoji: "🚩", text: { te: "ఎర్ర జెండాలు ఉన్నప్పుడు స్నానం చేయకండి. ఆ సమయంలో నీటి ప్రవాహం ఎక్కువగా ఉంటుంది.", hi: "लाल झंडे लगे होने पर न नहाएं। उस समय पानी का बहाव तेज़ होता है।", en: "Don't bathe when red flags are raised. Water current is strong at those times." } },
  { id: "r4", category: "river", emoji: "💍", text: { te: "నీటిలోకి దిగే ముందు ఆభరణాలు, విలువైన వస్తువులు తీసి ఉంచండి.", hi: "पानी में उतरने से पहले गहने और कीमती सामान उतार कर रखें।", en: "Remove jewelry and valuables before entering the water." } },
  // Health
  { id: "h1", category: "health", emoji: "💧", text: { te: "నిర్ణీత స్థానాల్లో బాటిల్/ఫిల్టర్ నీరు మాత్రమే తాగండి. నది నీరు తాగకండి.", hi: "निर्धारित स्थानों पर बोतल/फ़िल्टर पानी ही पिएं। नदी का पानी न पिएं।", en: "Drink only bottled or filtered water from designated points. Don't drink river water." } },
  { id: "h2", category: "health", emoji: "🧂", text: { te: "ORS ప్యాకెట్లు తీసుకెళ్ళండి. ఎండలో హైడ్రేటెడ్‌గా ఉండండి.", hi: "ORS पैकेट साथ रखें। धूप में हाइड्रेटेड रहें।", en: "Carry ORS packets. Stay hydrated in the heat." } },
  { id: "h3", category: "health", emoji: "🏥", text: { te: "ప్రధాన ఘాట్ల వద్ద ఉచిత వైద్య శిబిరాలు 24 గంటలు అందుబాటులో ఉన్నాయి.", hi: "प्रमुख घाटों पर मुफ्त चिकित्सा शिविर 24 घंटे उपलब्ध हैं।", en: "Free medical camps at all major ghats are open 24 hours." } },
  { id: "h4", category: "health", emoji: "👟", text: { te: "సౌకర్యవంతమైన నాన్-స్లిప్ చెప్పులు ధరించండి. మార్గాలు తడిగా ఉండవచ్చు.", hi: "आरामदायक नॉन-स्लिप जूते पहनें। रास्ते गीले हो सकते हैं।", en: "Wear comfortable non-slip footwear. Paths may be wet and slippery." } },
  // Belongings
  { id: "b1", category: "belongings", emoji: "🎒", text: { te: "పుష్కర్ ఘాట్ మరియు రైల్వే స్టేషన్ వద్ద ఉచిత లగేజ్ స్టోరేజ్ ఉపయోగించండి.", hi: "पुष्कर घाट और रेलवे स्टेशन पर मुफ्त सामान भंडारण का उपयोग करें।", en: "Use free luggage storage at Pushkar Ghat and Railway Station." } },
  { id: "b2", category: "belongings", emoji: "💰", text: { te: "ఘాట్లకు ఖరీదైన వస్తువులు లేదా ఎక్కువ నగదు తీసుకెళ్ళకండి.", hi: "घाटों पर महंगी चीज़ें या अधिक नकदी न ले जाएं।", en: "Don't carry expensive items or large amounts of cash to ghats." } },
  { id: "b3", category: "belongings", emoji: "📱", text: { te: "నది దగ్గర ఫోన్‌ను వాటర్‌ప్రూఫ్ పౌచ్‌లో ఉంచండి.", hi: "नदी के पास फ़ोन को वॉटरप्रूफ पाउच में रखें।", en: "Keep your phone in a waterproof pouch near the river." } },
  // Etiquette
  { id: "e1", category: "etiquette", emoji: "🚶", text: { te: "స్నాన ప్రాంతాల్లో క్యూ క్రమశిక్షణ పాటించండి.", hi: "स्नान क्षेत्रों में कतार अनुशासन का पालन करें।", en: "Follow queue discipline at bathing areas." } },
  { id: "e2", category: "etiquette", emoji: "🧴", text: { te: "పవిత్ర నదిలో సబ్బు లేదా రసాయనాలు ఉపయోగించకండి.", hi: "पवित्र नदी में साबुन या रसायन का उपयोग न करें।", en: "Don't use soap or chemicals in the holy river." } },
  { id: "e3", category: "etiquette", emoji: "🤝", text: { te: "వాలంటీర్లను గౌరవించండి మరియు వారి సూచనలు పాటించండి.", hi: "स्वयंसेवकों का सम्मान करें और उनके निर्देशों का पालन करें।", en: "Respect volunteers and follow their instructions." } },
];

const categoryConfig: Record<string, { emoji: string; color: string; bg: string; border: string; borderAccent: string }> = {
  river: { emoji: "🌊", color: "text-blue-800", bg: "bg-blue-50", border: "border-blue-200", borderAccent: "border-l-blue-400" },
  health: { emoji: "💊", color: "text-emerald-800", bg: "bg-emerald-50", border: "border-emerald-200", borderAccent: "border-l-emerald-400" },
  belongings: { emoji: "🎒", color: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200", borderAccent: "border-l-amber-400" },
  etiquette: { emoji: "🙏", color: "text-purple-800", bg: "bg-purple-50", border: "border-purple-200", borderAccent: "border-l-purple-400" },
};

const categoryOrder = ["river", "health", "belongings", "etiquette"];

const translations = {
  te: {
    title: "సేఫ్టీ టిప్స్",
    subtitle: "తీర్థయాత్రికులకు ముఖ్య సూచనలు",
    river: "నది భద్రత",
    health: "ఆరోగ్యం",
    belongings: "సామాన్లు",
    etiquette: "మర్యాద",
  },
  hi: {
    title: "सुरक्षा सुझाव",
    subtitle: "तीर्थयात्रियों के लिए महत्वपूर्ण सुझाव",
    river: "नदी सुरक्षा",
    health: "स्वास्थ्य",
    belongings: "सामान",
    etiquette: "शिष्टाचार",
  },
  en: {
    title: "Safety Tips",
    subtitle: "Important tips for pilgrims",
    river: "River Safety",
    health: "Health",
    belongings: "Belongings",
    etiquette: "Etiquette",
  },
};

type Lang = keyof typeof translations;

export default function SafetyTipsClient({ lang }: { lang: string }) {
  const l = (lang as Lang) || "te";
  const t = translations[l];
  const router = useRouter();

  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    items: safetyTips.filter((tip) => tip.category === cat),
  }));

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
          const cfg = categoryConfig[group.category];
          const catLabel = t[group.category as keyof typeof t] || group.category;

          return (
            <div key={group.category}>
              {/* Category header */}
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-base">{cfg.emoji}</span>
                <p className={clsx("text-xs font-bold", cfg.color)}>{catLabel}</p>
              </div>

              <div className="space-y-2">
                {group.items.map((tip) => (
                  <div
                    key={tip.id}
                    className={clsx("bg-white rounded-xl p-3.5 border-l-4", cfg.borderAccent)}
                    style={{
                      border: undefined,
                      boxShadow: "0 2px 8px rgba(15,40,71,0.04)",
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg mt-0.5">{tip.emoji}</span>
                      <p className="text-sm text-godavari-900 leading-snug">
                        {tip.text[l]}
                      </p>
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
