type Lang = "te" | "hi" | "en";

export interface VoiceIntent {
  intent: string;
  route: string | null; // null for Q&A intents (no navigation, just speak answer)
  emoji: string;
  category: string; // maps to location category for bottom sheet
  label: { te: string; hi: string; en: string };
  confirmation: { te: string; hi: string; en: string };
  dataResponse: { te: string; hi: string; en: string };
}

// Speech recognition language codes.
// English mode uses te-IN because this is a Telugu festival app —
// most English-mode users are Telugu speakers, and Chrome's te-IN
// recognition handles common English words (food, toilet, bus, etc.)
// well. The keyword matching already checks all 3 languages.
const recognitionLangCodes: Record<Lang, string> = {
  te: "te-IN",
  hi: "hi-IN",
  en: "te-IN",
};

// TTS language codes — must match the actual text language
const ttsLangCodes: Record<Lang, string> = {
  te: "te-IN",
  hi: "hi-IN",
  en: "en-IN",
};

// Intents ordered: specific first, generic last
const intents: {
  keywords: { te: string[]; hi: string[]; en: string[] };
  result: VoiceIntent;
}[] = [
  // === EMERGENCY (highest priority) ===
  {
    keywords: {
      te: ["ఎమర్జెన్సీ", "పోలీస్", "అంబులెన్స్", "ఫైర్", "అగ్నిమాపక", "ప్రమాదం", "ఎమర్జన్సీ", "పోలిస్", "అంబులెంస్"],
      hi: ["इमरजेंसी", "पुलिस", "एम्बुलेंस", "आग", "फायर", "खतरा"],
      en: ["emergency", "police", "ambulance", "fire", "sos", "danger", "accident", "911", "100"],
    },
    result: {
      intent: "emergency",
      route: "/emergency",
      emoji: "🆘",
      category: "emergency",
      label: { te: "అత్యవసరం", hi: "आपातकाल", en: "Emergency" },
      confirmation: {
        te: "అత్యవసర సమాచారం చూపిస్తున్నాను",
        hi: "आपातकालीन जानकारी दिखा रहे हैं",
        en: "Showing emergency contacts",
      },
      dataResponse: {
        te: "పోలీస్ 100. అంబులెన్స్ 108.",
        hi: "पुलिस 100. एम्बुलेंस 108.",
        en: "Police 100. Ambulance 108.",
      },
    },
  },
  // === GHATS ===
  {
    keywords: {
      te: ["ఘాట్", "ఘాట్లు", "స్నానం", "స్నాన", "నది", "గోదావరి", "గాడ్స్", "గాట్స్", "గాట్", "ఘాట్స్", "పుష్కర"],
      hi: ["घाट", "स्नान", "नदी", "गोदावरी"],
      en: ["ghat", "ghats", "bath", "bathing", "river", "godavari", "holy dip"],
    },
    result: {
      intent: "ghats",
      route: "/ghats",
      emoji: "🛕",
      category: "ghat",
      label: { te: "ఘాట్లు", hi: "घाट", en: "Ghats" },
      confirmation: {
        te: "ఘాట్లు చూపిస్తున్నాను",
        hi: "घाट दिखा रहे हैं",
        en: "Here are the ghats",
      },
      dataResponse: {
        te: "పుష్కర్ ఘాట్ 500 మీటర్లు తక్కువ రద్దీ. సరస్వతి ఘాట్ 1.2 కిలోమీటర్లు తక్కువ రద్దీ.",
        hi: "पुष्कर घाट 500 मीटर कम भीड़. सरस्वती घाट 1.2 किलोमीटर कम भीड़.",
        en: "Pushkar Ghat is 500 meters away with low crowd. Saraswathi Ghat is 1.2 kilometers with low crowd.",
      },
    },
  },
  // === CROWD STATUS ===
  {
    keywords: {
      te: ["రద్దీ", "జనం", "ఎంతమంది", "తక్కువ రద్దీ", "ఎక్కువ రద్దీ", "క్రౌడ్", "జనాలు", "ఎంత మంది"],
      hi: ["भीड़", "कितनी", "कितने लोग", "कम भीड़", "ज्यादा भीड़"],
      en: ["crowd", "crowded", "busy", "rush", "how many people", "safe ghat", "which ghat is safe"],
    },
    result: {
      intent: "crowd",
      route: "/ghats/status",
      emoji: "👥",
      category: "crowd",
      label: { te: "రద్దీ స్థితి", hi: "भीड़ स्थिति", en: "Crowd Status" },
      confirmation: {
        te: "రద్దీ స్థితి చూపిస్తున్నాను",
        hi: "भीड़ स्थिति दिखा रहे हैं",
        en: "Showing crowd status",
      },
      dataResponse: {
        te: "పుష్కర్ ఘాట్ తక్కువ రద్దీ. సరస్వతి ఘాట్ తక్కువ రద్దీ.",
        hi: "पुष्कर घाट कम भीड़. सरस्वती घाट कम भीड़.",
        en: "Pushkar Ghat has low crowd. Saraswathi Ghat has low crowd.",
      },
    },
  },
  // === FOOD ===
  {
    keywords: {
      te: ["ఆహారం", "భోజనం", "తిండి", "అన్నం", "తినడం", "ఫుడ్", "అన్నదానం", "భోజన", "ఫూడ్", "హోటల్", "టిఫిన్", "తినాలి", "భోజనశాల"],
      hi: ["खाना", "भोजन", "खाने", "फूड", "अन्नदानम", "भूख"],
      en: ["food", "eat", "meal", "restaurant", "lunch", "dinner", "hungry", "breakfast", "annadanam"],
    },
    result: {
      intent: "food",
      route: "/facilities?type=food",
      emoji: "🍲",
      category: "food",
      label: { te: "ఆహారం", hi: "भोजन", en: "Food" },
      confirmation: {
        te: "సమీపంలోని ఆహార కేంద్రాలు చూపిస్తున్నాను",
        hi: "पास के भोजन केंद्र दिखा रहे हैं",
        en: "Here are nearby food centers",
      },
      dataResponse: {
        te: "అన్నదానం పుష్కర్ ఘాట్ 300 మీటర్లు ఉచితం. ఇస్కాన్ భోజనశాల 800 మీటర్లు.",
        hi: "अन्नदानम पुष्कर घाट 300 मीटर मुफ्त. इस्कॉन 800 मीटर.",
        en: "Annadanam at Pushkar Ghat is 300 meters away, free meals. ISKCON is 800 meters.",
      },
    },
  },
  // === TOILET ===
  {
    keywords: {
      te: ["టాయిలెట్", "మరుగుదొడ్డి", "బాత్రూమ్", "శౌచాలయం", "లెట్రిన్", "టాయ్లెట్", "బాత్ రూమ్", "సులభ్"],
      hi: ["शौचालय", "टॉयलेट", "बाथरूम", "लैट्रिन", "सुलभ"],
      en: ["toilet", "bathroom", "restroom", "washroom", "loo", "sulabh"],
    },
    result: {
      intent: "toilet",
      route: "/facilities?type=toilet",
      emoji: "🚻",
      category: "toilet",
      label: { te: "మరుగుదొడ్లు", hi: "शौचालय", en: "Toilets" },
      confirmation: {
        te: "సమీపంలోని మరుగుదొడ్లు చూపిస్తున్నాను",
        hi: "पास के शौचालय दिखा रहे हैं",
        en: "Here are nearby toilets",
      },
      dataResponse: {
        te: "సులభ్ శౌచాలయం ఘాట్ 1 వద్ద 150 మీటర్లు. మొబైల్ టాయిలెట్ గౌతమి ఘాట్ 600 మీటర్లు ఉచితం.",
        hi: "सुलभ शौचालय घाट 1 पर 150 मीटर. मोबाइल टॉयलेट गौतमी घाट 600 मीटर मुफ्त.",
        en: "Sulabh Toilet at Ghat 1 is 150 meters. Mobile Toilet at Gautami Ghat is 600 meters, free.",
      },
    },
  },
  // === WATER ===
  {
    keywords: {
      te: ["నీరు", "నీళ్ళు", "మంచినీళ్ళు", "వాటర్", "దాహం", "నీళ్లు", "తాగునీరు", "తాగడానికి"],
      hi: ["पानी", "जल", "पीने का पानी", "प्यास"],
      en: ["water", "drinking water", "thirsty", "drink"],
    },
    result: {
      intent: "water",
      route: "/facilities?type=water",
      emoji: "💧",
      category: "water",
      label: { te: "నీరు", hi: "पानी", en: "Water" },
      confirmation: {
        te: "సమీపంలోని నీటి కేంద్రాలు చూపిస్తున్నాను",
        hi: "पास के पानी केंद्र दिखा रहे हैं",
        en: "Here are nearby water stations",
      },
      dataResponse: {
        te: "పుష్కర్ ఘాట్ వద్ద RO వాటర్ 200 మీటర్లు ఉచితం. కోటిలింగ ఘాట్ నీటి ట్యాంకర్ 700 మీటర్లు ఉచితం.",
        hi: "पुष्कर घाट पर RO वाटर 200 मीटर मुफ्त. कोटिलिंग घाट पानी टैंकर 700 मीटर मुफ्त.",
        en: "RO Water at Pushkar Ghat is 200 meters, free. Water tanker at Kotilinga Ghat is 700 meters, free.",
      },
    },
  },
  // === MEDICAL ===
  {
    keywords: {
      te: ["వైద్యం", "ఆసుపత్రి", "డాక్టర్", "మెడికల్", "ప్రథమ చికిత్స", "ఫస్ట్ ఎయిడ్", "హాస్పిటల్", "మందులు", "వైద్యుడు", "డాక్టరు"],
      hi: ["डॉक्टर", "अस्पताल", "दवाई", "मेडिकल", "प्राथमिक चिकित्सा", "फर्स्ट एड"],
      en: ["doctor", "hospital", "medical", "first aid", "medicine", "sick", "injury", "health"],
    },
    result: {
      intent: "medical",
      route: "/facilities?type=medical",
      emoji: "🏥",
      category: "medical",
      label: { te: "వైద్యం", hi: "चिकित्सा", en: "Medical" },
      confirmation: {
        te: "సమీపంలోని వైద్య సేవలు చూపిస్తున్నాను",
        hi: "पास की चिकित्सा सेवाएं दिखा रहे हैं",
        en: "Here are nearby medical services",
      },
      dataResponse: {
        te: "ప్రాథమిక చికిత్స పుష్కర్ ఘాట్ వద్ద 500 మీటర్లు 24 గంటలు ఉచితం. ప్రభుత్వ ఆసుపత్రి 2 కిలోమీటర్లు అంబులెన్స్ అందుబాటులో.",
        hi: "प्राथमिक चिकित्सा पुष्कर घाट पर 500 मीटर 24 घंटे मुफ्त. सरकारी अस्पताल 2 किलोमीटर एम्बुलेंस उपलब्ध.",
        en: "First Aid at Pushkar Ghat is 500 meters, 24 hours, free. Government Hospital is 2 kilometers with ambulance available.",
      },
    },
  },
  // === INTERCITY TRANSPORT (must be BEFORE generic transport so city names match first) ===
  {
    keywords: {
      te: ["హైదరాబాద్", "సికింద్రాబాద్", "హైద్రాబాద్"],
      hi: ["हैदराबाद", "सिकंदराबाद"],
      en: ["hyderabad", "secunderabad"],
    },
    result: {
      intent: "qa_hyderabad_schedule", route: "/transport?dest=hyderabad", emoji: "🚆", category: "transport",
      label: { te: "హైదరాబాద్ రైళ్ళు & బస్సులు", hi: "हैदराबाद ट्रेन और बस", en: "Hyderabad Trains & Buses" },
      confirmation: { te: "హైదరాబాద్ రైళ్ళు & బస్సులు చూపిస్తున్నాను", hi: "हैदराबाद ट्रेन और बस दिखा रहे हैं", en: "Showing trains and buses to Hyderabad" },
      dataResponse: {
        te: "హైదరాబాద్‌కు రైళ్ళు: గోదావరి ఎక్స్‌ప్రెస్ 1 2 7 2 7 మధ్యాహ్నం 2:30. ఈస్ట్ కోస్ట్ ఎక్స్‌ప్రెస్ 1 8 6 4 5 రాత్రి 10:30. బస్సులు: APSRTC సూపర్ లగ్జరీ AC మధ్యాహ్నం 2:00 900 రూపాయలు. APSRTC ఎక్స్‌ప్రెస్ సాయంత్రం 6:00 550 రూపాయలు.",
        hi: "हैदराबाद ट्रेनें: गोदावरी एक्सप्रेस 1 2 7 2 7 दोपहर 2:30। ईस्ट कोस्ट एक्सप्रेस 1 8 6 4 5 रात 10:30। बसें: APSRTC सुपर लग्ज़री AC दोपहर 2:00 900 रुपये। APSRTC एक्सप्रेस शाम 6:00 550 रुपये।",
        en: "Trains to Hyderabad: Godavari Express 1 2 7 2 7 at 2:30 PM. East Coast Express 1 8 6 4 5 at 10:30 PM. Buses: APSRTC Super Luxury AC at 2 PM, 900 rupees. APSRTC Express at 6 PM, 550 rupees.",
      },
    },
  },
  {
    keywords: {
      te: ["విజయవాడ"],
      hi: ["विजयवाड़ा"],
      en: ["vijayawada"],
    },
    result: {
      intent: "qa_vijayawada_schedule", route: "/transport?dest=vijayawada", emoji: "🚆", category: "transport",
      label: { te: "విజయవాడ రైళ్ళు & బస్సులు", hi: "विजयवाड़ा ट्रेन और बस", en: "Vijayawada Trains & Buses" },
      confirmation: { te: "విజయవాడ రైళ్ళు & బస్సులు చూపిస్తున్నాను", hi: "विजयवाड़ा ट्रेन और बस दिखा रहे हैं", en: "Showing trains and buses to Vijayawada" },
      dataResponse: {
        te: "విజయవాడకు రైళ్ళు: జన్మభూమి ఎక్స్‌ప్రెస్ 1 2 8 0 5 ఉదయం 6:45. ప్యాసింజర్ 5 7 2 6 4 ఉదయం 10:30. బస్సులు: APSRTC గరుడ AC ఉదయం 7:00 400 రూపాయలు. APSRTC ఎక్స్‌ప్రెస్ ఉదయం 11:30 250 రూపాయలు.",
        hi: "विजयवाड़ा ट्रेनें: जन्मभूमि एक्सप्रेस 1 2 8 0 5 सुबह 6:45। पैसेंजर 5 7 2 6 4 सुबह 10:30। बसें: APSRTC गरुड़ AC सुबह 7:00 400 रुपये। APSRTC एक्सप्रेस सुबह 11:30 250 रुपये।",
        en: "Trains to Vijayawada: Janmabhoomi Express 1 2 8 0 5 at 6:45 AM. Passenger 5 7 2 6 4 at 10:30 AM. Buses: APSRTC Garuda AC at 7 AM, 400 rupees. APSRTC Express at 11:30 AM, 250 rupees.",
      },
    },
  },
  {
    keywords: {
      te: ["విశాఖపట్నం", "వైజాగ్", "విశాఖ"],
      hi: ["विशाखापट्टनम", "वाइजैग", "विशाखा"],
      en: ["visakhapatnam", "vizag", "vishakhapatnam"],
    },
    result: {
      intent: "qa_visakhapatnam_schedule", route: "/transport?dest=visakhapatnam", emoji: "🚆", category: "transport",
      label: { te: "విశాఖపట్నం రైళ్ళు & బస్సులు", hi: "विशाखापट्टनम ट्रेन और बस", en: "Visakhapatnam Trains & Buses" },
      confirmation: { te: "విశాఖపట్నం రైళ్ళు & బస్సులు చూపిస్తున్నాను", hi: "विशाखापट्टनम ट्रेन और बस दिखा रहे हैं", en: "Showing trains and buses to Visakhapatnam" },
      dataResponse: {
        te: "విశాఖపట్నం రైళ్ళు: గౌతమి ఎక్స్‌ప్రెస్ 1 2 7 3 7 ఉదయం 8:00. విశాఖ ఎక్స్‌ప్రెస్ 1 7 4 8 8 సాయంత్రం 4:15. బస్సులు: APSRTC సూపర్ లగ్జరీ AC ఉదయం 9:00 600 రూపాయలు. APSRTC ఎక్స్‌ప్రెస్ మధ్యాహ్నం 3:30 350 రూపాయలు.",
        hi: "विशाखापट्टनम ट्रेनें: गौतमी एक्सप्रेस 1 2 7 3 7 सुबह 8:00। विशाखा एक्सप्रेस 1 7 4 8 8 शाम 4:15। बसें: APSRTC सुपर लग्ज़री AC सुबह 9:00 600 रुपये। APSRTC एक्सप्रेस दोपहर 3:30 350 रुपये।",
        en: "Trains to Visakhapatnam: Gautami Express 1 2 7 3 7 at 8 AM. Visakha Express 1 7 4 8 8 at 4:15 PM. Buses: APSRTC Super Luxury AC at 9 AM, 600 rupees. APSRTC Express at 3:30 PM, 350 rupees.",
      },
    },
  },
  {
    keywords: {
      te: ["కాకినాడ"],
      hi: ["काकीनाडा"],
      en: ["kakinada"],
    },
    result: {
      intent: "qa_kakinada_schedule", route: "/transport?dest=kakinada", emoji: "🚆", category: "transport",
      label: { te: "కాకినాడ రైళ్ళు & బస్సులు", hi: "काकीनाडा ट्रेन और बस", en: "Kakinada Trains & Buses" },
      confirmation: { te: "కాకినాడ రైళ్ళు & బస్సులు చూపిస్తున్నాను", hi: "काकीनाडा ट्रेन और बस दिखा रहे हैं", en: "Showing trains and buses to Kakinada" },
      dataResponse: {
        te: "కాకినాడకు రైళ్ళు: ప్యాసింజర్ 5 7 3 7 9 ఉదయం 7:30. పుష్కరం స్పెషల్ 0 7 1 1 7 మధ్యాహ్నం 12:00. బస్సులు: APSRTC డీలక్స్ ఉదయం 8:00 120 రూపాయలు. సిటీ బస్ ప్రతి 15 నిమిషాలు 80 రూపాయలు.",
        hi: "काकीनाडा ट्रेनें: पैसेंजर 5 7 3 7 9 सुबह 7:30। पुष्करम स्पेशल 0 7 1 1 7 दोपहर 12:00। बसें: APSRTC डीलक्स सुबह 8:00 120 रुपये। सिटी बस हर 15 मिनट 80 रुपये।",
        en: "Trains to Kakinada: Passenger 5 7 3 7 9 at 7:30 AM. Pushkaram Special 0 7 1 1 7 at 12 PM. Buses: APSRTC Deluxe at 8 AM, 120 rupees. City Bus every 15 minutes, 80 rupees.",
      },
    },
  },
  {
    keywords: {
      te: ["తిరుపతి"],
      hi: ["तिरुपति"],
      en: ["tirupati"],
    },
    result: {
      intent: "qa_tirupati_schedule", route: "/transport?dest=tirupati", emoji: "🚆", category: "transport",
      label: { te: "తిరుపతి రైళ్ళు & బస్సులు", hi: "तिरुपति ट्रेन और बस", en: "Tirupati Trains & Buses" },
      confirmation: { te: "తిరుపతి రైళ్ళు & బస్సులు చూపిస్తున్నాను", hi: "तिरुपति ट्रेन और बस दिखा रहे हैं", en: "Showing trains and buses to Tirupati" },
      dataResponse: {
        te: "తిరుపతికి రైళ్ళు: తిరుపతి ఎక్స్‌ప్రెస్ 1 7 4 8 1 రాత్రి 8:00. పుష్కరం స్పెషల్ 0 7 1 1 9 ఉదయం 9:00. బస్సులు: APSRTC ఎక్స్‌ప్రెస్ సాయంత్రం 5:00 700 రూపాయలు. APSRTC గరుడ AC రాత్రి 8:30 1100 రూపాయలు.",
        hi: "तिरुपति ट्रेनें: तिरुपति एक्सप्रेस 1 7 4 8 1 रात 8:00। पुष्करम स्पेशल 0 7 1 1 9 सुबह 9:00। बसें: APSRTC एक्सप्रेस शाम 5:00 700 रुपये। APSRTC गरुड़ AC रात 8:30 1100 रुपये।",
        en: "Trains to Tirupati: Tirupati Express 1 7 4 8 1 at 8 PM. Pushkaram Special 0 7 1 1 9 at 9 AM. Buses: APSRTC Express at 5 PM, 700 rupees. APSRTC Garuda AC at 8:30 PM, 1100 rupees.",
      },
    },
  },
  // === LOCAL TRANSPORT (generic — matches only if no city name above matched) ===
  {
    keywords: {
      te: ["బస్", "ఆటో", "రవాణా", "ట్రాన్స్పోర్ట్", "ఎలా వెళ్ళాలి", "పార్కింగ్", "బోట్", "షటిల్", "బస్సు", "ట్యాక్సీ", "రిక్షా", "ఆటోరిక్షా"],
      hi: ["बस", "ऑटो", "परिवहन", "ट्रांसपोर्ट", "कैसे जाएं", "पार्किंग", "नाव", "शटल"],
      en: ["bus", "auto", "transport", "parking", "taxi", "travel", "boat", "shuttle", "ferry", "reach", "how to get"],
    },
    result: {
      intent: "transport",
      route: "/transport",
      emoji: "🚌",
      category: "transport",
      label: { te: "రవాణా", hi: "परिवहन", en: "Transport" },
      confirmation: {
        te: "రవాణా సమాచారం చూపిస్తున్నాను",
        hi: "परिवहन जानकारी दिखा रहे हैं",
        en: "Here is transport information",
      },
      dataResponse: {
        te: "పార్కింగ్ షటిల్ ఉచితం ప్రతి 10 నిమిషాలు. ఘాట్ షటిల్ బస్ 5 రూపాయలు ప్రతి 15 నిమిషాలు.",
        hi: "पार्किंग शटल मुफ्त हर 10 मिनट. घाट शटल बस 5 रुपये हर 15 मिनट.",
        en: "Parking Shuttle is free every 10 minutes. Ghat Shuttle Bus is 5 rupees every 15 minutes.",
      },
    },
  },
  // === PUJA TIMINGS ===
  {
    keywords: {
      te: ["పూజ", "పూజా", "ఆరతి", "అభిషేకం", "దీపోత్సవం", "పూజలు", "పూజా సమయాలు"],
      hi: ["पूजा", "आरती", "अभिषेक", "दीपोत्सव", "पूजा समय"],
      en: ["puja", "pooja", "aarti", "arti", "ritual", "prayer", "worship", "abhishekam", "deepotsavam", "puja timings"],
    },
    result: {
      intent: "pujaTimings",
      route: "/puja-timings",
      emoji: "🪔",
      category: "puja",
      label: { te: "పూజా సమయాలు", hi: "पूजा समय", en: "Puja Timings" },
      confirmation: {
        te: "పూజా సమయాలు చూపిస్తున్నాను",
        hi: "पूजा समय दिखा रहे हैं",
        en: "Showing puja timings",
      },
      dataResponse: {
        te: "పుష్కర్ ఘాట్: గోదావరి ఆరతి ఉదయం 6 గంటలు. పుష్కర పూజ ఉదయం 10 గంటలు. సంధ్యా ఆరతి సాయంత్రం 6:30. దీపోత్సవం రాత్రి 7:30.",
        hi: "पुष्कर घाट: गोदावरी आरती सुबह 6 बजे। पुष्कर पूजा सुबह 10 बजे। संध्या आरती शाम 6:30। दीपोत्सव रात 7:30।",
        en: "Pushkar Ghat: Godavari Aarti at 6 AM. Pushkara Puja at 10 AM. Sandhya Aarti at 6:30 PM. Deepotsavam at 7:30 PM.",
      },
    },
  },
  // === SAFETY TIPS ===
  {
    keywords: {
      te: ["సేఫ్టీ", "జాగ్రత్త", "భద్రత", "జాగ్రత్తలు", "టిప్స్"],
      hi: ["सुरक्षा", "सावधानी", "सेफ्टी", "सुझाव"],
      en: ["safety", "tips", "precaution", "dos and donts", "rules", "guidelines", "safe"],
    },
    result: {
      intent: "safetyTips",
      route: "/safety-tips",
      emoji: "🛡️",
      category: "safety",
      label: { te: "సేఫ్టీ టిప్స్", hi: "सुरक्षा सुझाव", en: "Safety Tips" },
      confirmation: {
        te: "సేఫ్టీ టిప్స్ చూపిస్తున్నాను",
        hi: "सुरक्षा सुझाव दिखा रहे हैं",
        en: "Showing safety tips",
      },
      dataResponse: {
        te: "నిర్ణీత స్నాన ప్రాంతాల్లోనే స్నానం చేయండి. పిల్లలను గట్టిగా పట్టుకోండి. ఫిల్టర్ నీరు మాత్రమే తాగండి. ఉచిత లగేజ్ స్టోరేజ్ ఉపయోగించండి.",
        hi: "निर्धारित स्नान क्षेत्रों में ही नहाएं। बच्चों को मज़बूती से पकड़ें। फ़िल्टर पानी ही पिएं। मुफ्त सामान भंडारण का उपयोग करें।",
        en: "Stay in designated bathing areas. Hold children firmly. Drink only filtered water. Use free luggage storage.",
      },
    },
  },
  // === ALERTS ===
  {
    keywords: {
      te: ["హెచ్చరిక", "అలర్ట్", "హెచ్చరికలు", "వార్నింగ్", "అలెర్ట్", "సూచన", "సూచనలు"],
      hi: ["अलर्ट", "चेतावनी", "सूचना", "वार्निंग"],
      en: ["alert", "alerts", "warning", "update", "notification", "news"],
    },
    result: {
      intent: "alerts",
      route: "/alerts",
      emoji: "📢",
      category: "alerts",
      label: { te: "హెచ్చరికలు", hi: "अलर्ट", en: "Alerts" },
      confirmation: {
        te: "హెచ్చరికలు చూపిస్తున్నాను",
        hi: "अलर्ट दिखा रहे हैं",
        en: "Showing alerts",
      },
      dataResponse: {
        te: "పుష్కర్ ఘాట్ వద్ద తక్కువ రద్దీ. గౌతమి ఘాట్ వద్ద ఎక్కువ రద్దీ.",
        hi: "पुष्कर घाट पर कम भीड़. गौतमी घाट पर अधिक भीड़.",
        en: "Low crowd at Pushkar Ghat. High crowd at Gautami Ghat.",
      },
    },
  },
  // === MAP ===
  {
    keywords: {
      te: ["మ్యాప్", "మ్యాపు"],
      hi: ["नक्शा", "मैप"],
      en: ["map", "show map", "open map"],
    },
    result: {
      intent: "map",
      route: "/map",
      emoji: "📍",
      category: "map",
      label: { te: "మ్యాప్", hi: "नक्शा", en: "Map" },
      confirmation: {
        te: "మ్యాప్ చూపిస్తున్నాను",
        hi: "नक्शा दिखा रहे हैं",
        en: "Opening map",
      },
      dataResponse: {
        te: "మ్యాప్ తెరుస్తున్నాను. అన్ని ఘాట్లు మరియు సౌకర్యాలు కనిపిస్తాయి.",
        hi: "नक्शा खोल रहे हैं. सभी घाट और सुविधाएं दिखेंगी.",
        en: "Opening the map with all ghats and facilities.",
      },
    },
  },
  // === HOME ===
  {
    keywords: {
      te: ["హోమ్", "మొదటి పేజీ", "ముందు పేజీ", "వెనక్కి"],
      hi: ["होम", "मुख्य", "पहला पेज", "वापस"],
      en: ["home", "main page", "go back", "start", "go home"],
    },
    result: {
      intent: "home",
      route: "/",
      emoji: "🏠",
      category: "home",
      label: { te: "హోమ్", hi: "होम", en: "Home" },
      confirmation: {
        te: "హోమ్ పేజీకి వెళ్తున్నాను",
        hi: "होम पेज पर जा रहे हैं",
        en: "Going to home page",
      },
      dataResponse: {
        te: "హోమ్ పేజీకి వెళ్తున్నాను",
        hi: "होम पेज पर जा रहे हैं",
        en: "Going to home page",
      },
    },
  },
  // === VOLUNTEER / HELP ===
  {
    keywords: {
      te: ["సహాయం", "వాలంటీర్", "హెల్ప్", "సాయం", "వలంటీర్"],
      hi: ["मदद", "सहायता", "स्वयंसेवक", "हेल्प"],
      en: ["help", "volunteer", "assist", "guide", "information"],
    },
    result: {
      intent: "volunteer",
      route: "/facilities?type=volunteer",
      emoji: "🤝",
      category: "volunteer",
      label: { te: "సహాయం", hi: "सहायता", en: "Help" },
      confirmation: {
        te: "వాలంటీర్ సమాచారం చూపిస్తున్నాను",
        hi: "स्वयंसेवक जानकारी दिखा रहे हैं",
        en: "Showing volunteer information",
      },
      dataResponse: {
        te: "వాలంటీర్ బూత్ పుష్కర్ ఘాట్ వద్ద 400 మీటర్లు. సహాయం మరియు మార్గదర్శనం అందుబాటులో.",
        hi: "स्वयंसेवक बूथ पुष्कर घाट पर 400 मीटर. सहायता और मार्गदर्शन उपलब्ध.",
        en: "Volunteer Booth at Pushkar Ghat is 400 meters. Help and guidance available.",
      },
    },
  },
];

// === Q&A INTENTS ===
// These are informational questions that get spoken answers WITHOUT navigation.
// They use multi-word keyword phrases to avoid conflicting with single-word navigation intents.
// Matched BEFORE navigation intents in parseIntent().
const qaIntents: {
  keywords: { te: string[]; hi: string[]; en: string[] };
  result: VoiceIntent;
}[] = [
  // ── A. About Ghats ──
  {
    keywords: {
      te: ["ఎన్ని ఘాట్లు", "ఘాట్లు ఎన్ని", "మొత్తం ఘాట్లు"],
      hi: ["कितने घाट", "घाट कितने", "कुल घाट"],
      en: ["how many ghats", "total ghats", "number of ghats", "count of ghats"],
    },
    result: {
      intent: "qa_ghat_count", route: null, emoji: "🛕", category: "qa",
      label: { te: "ఘాట్ల సంఖ్య", hi: "घाटों की संख्या", en: "Number of Ghats" },
      confirmation: { te: "ఘాట్ల సమాచారం", hi: "घाटों की जानकारी", en: "Ghat Information" },
      dataResponse: {
        te: "గోదావరి నది వెంబడి పుష్కరాల కోసం 12 ఘాట్లు ఉన్నాయి. ప్రధాన ఘాట్లు పుష్కర్ ఘాట్, కోటిలింగాల ఘాట్, సరస్వతి ఘాట్.",
        hi: "गोदावरी नदी के किनारे पुष्कराल के लिए 12 घाट हैं। प्रमुख घाट पुष्कर घाट, कोटिलिंगाला घाट, सरस्वती घाट हैं।",
        en: "There are 12 ghats along the Godavari river for Pushkaralu. The main ghats are Pushkar Ghat, Kotilingala Ghat, and Saraswati Ghat.",
      },
    },
  },
  {
    keywords: {
      te: ["ఘాట్ల పేర్లు", "ఏ ఘాట్లు", "అన్ని ఘాట్ల పేర్లు"],
      hi: ["घाटों के नाम", "कौन से घाट", "सभी घाट"],
      en: ["ghat names", "list ghats", "name of ghats", "all ghats names", "which ghats"],
    },
    result: {
      intent: "qa_ghat_names", route: null, emoji: "🛕", category: "qa",
      label: { te: "ఘాట్ల పేర్లు", hi: "घाटों के नाम", en: "Ghat Names" },
      confirmation: { te: "ఘాట్ల పేర్లు", hi: "घाटों के नाम", en: "Ghat Names" },
      dataResponse: {
        te: "12 ఘాట్లు: పుష్కర్ ఘాట్, కోటిలింగాల ఘాట్, సరస్వతి ఘాట్, గౌతమి ఘాట్, రామపాదల రేవు ఘాట్, TTD ఘాట్, దౌలేశ్వరం ఘాట్, గోపాదల ఘాట్, సున్నంబట్టి ఘాట్, పద్మావతి ఘాట్, సుబ్బయ్యమ్మ ఘాట్, బోట్ ఆఫీస్ ఘాట్.",
        hi: "12 घाट: पुष्कर घाट, कोटिलिंगाला घाट, सरस्वती घाट, गौतमी घाट, रामपादला रेवु घाट, TTD घाट, दौलेश्वरम घाट, गोपादला घाट, सुन्नमबट्टी घाट, पद्मावती घाट, सुब्बयम्मा घाट, बोट ऑफिस घाट।",
        en: "The 12 ghats are: Pushkar Ghat, Kotilingala Ghat, Saraswati Ghat, Gowthami Ghat, Ramapadala Revu Ghat, TTD Ghat, Dowlaishwaram Ghat, Gopadala Ghat, Sunnambati Ghat, Padmavathi Ghat, Subbayamma Ghat, and Boat Office Ghat.",
      },
    },
  },
  {
    keywords: {
      te: ["పెద్ద ఘాట్", "ప్రధాన ఘాట్", "అతి పెద్ద ఘాట్"],
      hi: ["सबसे बड़ा घाट", "मुख्य घाट", "बड़ा घाट"],
      en: ["biggest ghat", "largest ghat", "main ghat", "most popular ghat"],
    },
    result: {
      intent: "qa_biggest_ghat", route: null, emoji: "🛕", category: "qa",
      label: { te: "పెద్ద ఘాట్", hi: "सबसे बड़ा घाट", en: "Biggest Ghat" },
      confirmation: { te: "పెద్ద ఘాట్", hi: "सबसे बड़ा घाट", en: "Biggest Ghat" },
      dataResponse: {
        te: "కోటిలింగాల ఘాట్ అతి పెద్దది, 4 లక్షల 80 వేల మంది సామర్థ్యం ఉంది. పుష్కర్ ఘాట్ అత్యంత ప్రసిద్ధమైనది.",
        hi: "कोटिलिंगाला घाट सबसे बड़ा है, 4 लाख 80 हज़ार लोगों की क्षमता है। पुष्कर घाट सबसे प्रसिद्ध है।",
        en: "Kotilingala Ghat is the largest with a capacity of 4 lakh 80 thousand people. Pushkar Ghat is the most popular and well-equipped.",
      },
    },
  },
  {
    keywords: {
      te: ["ఘాట్ సమయం", "ఎప్పుడు తెరుస్తారు", "ఘాట్ టైమింగ్"],
      hi: ["घाट समय", "कब खुलते", "घाट टाइमिंग"],
      en: ["ghat timing", "ghat open", "what time ghat", "ghat hours"],
    },
    result: {
      intent: "qa_ghat_timings", route: null, emoji: "🕐", category: "qa",
      label: { te: "ఘాట్ సమయాలు", hi: "घाट समय", en: "Ghat Timings" },
      confirmation: { te: "ఘాట్ సమయాలు", hi: "घाट समय", en: "Ghat Timings" },
      dataResponse: {
        te: "పుష్కరాల సమయంలో ఘాట్లు 24 గంటలూ తెరిచి ఉంటాయి. పవిత్ర స్నానానికి ఉదయం 4 నుండి 8 గంటల వరకు మంచి సమయం.",
        hi: "पुष्कराल के दौरान घाट 24 घंटे खुले रहते हैं। पवित्र स्नान के लिए सुबह 4 से 8 बजे सबसे अच्छा समय है।",
        en: "Ghats are open 24 hours during Pushkaralu. Best time for holy bath is early morning 4 AM to 8 AM.",
      },
    },
  },
  {
    keywords: {
      te: ["మంచి ఘాట్", "ఏ ఘాట్ వెళ్ళాలి", "ఘాట్ సూచన"],
      hi: ["अच्छा घाट", "कौन सा घाट जाऊं", "घाट सुझाव"],
      en: ["best ghat", "recommended ghat", "which ghat should", "suggest ghat"],
    },
    result: {
      intent: "qa_best_ghat", route: null, emoji: "⭐", category: "qa",
      label: { te: "మంచి ఘాట్", hi: "अच्छा घाट", en: "Best Ghat" },
      confirmation: { te: "ఘాట్ సూచన", hi: "घाट सुझाव", en: "Ghat Suggestion" },
      dataResponse: {
        te: "పుష్కర్ ఘాట్ అత్యంత ప్రసిద్ధమైనది, అన్ని సౌకర్యాలు ఉన్నాయి. తక్కువ రద్దీ కోసం సరస్వతి ఘాట్ లేదా గౌతమి ఘాట్ ప్రయత్నించండి. వెళ్ళే ముందు యాప్‌లో రద్దీ చూడండి.",
        hi: "पुष्कर घाट सबसे प्रसिद्ध है, सभी सुविधाएं हैं। कम भीड़ के लिए सरस्वती घाट या गौतमी घाट जाएं। जाने से पहले ऐप में भीड़ देखें।",
        en: "Pushkar Ghat is the most popular and well-equipped. For less crowd, try Saraswati Ghat or Gowthami Ghat. Check crowd status in the app before going.",
      },
    },
  },
  {
    keywords: {
      te: ["వృద్ధులకు ఘాట్", "వయసు పెద్దవారికి", "వీల్ చైర్"],
      hi: ["बुजुर्ग घाट", "बूढ़े लोग", "वरिष्ठ नागरिक", "व्हीलचेयर"],
      en: ["elderly ghat", "old people ghat", "senior citizen", "wheelchair", "easy access ghat"],
    },
    result: {
      intent: "qa_ghat_elderly", route: null, emoji: "👴", category: "qa",
      label: { te: "వృద్ధులకు ఘాట్", hi: "बुजुर्गों के लिए घाट", en: "Ghats for Elderly" },
      confirmation: { te: "వృద్ధులకు ఘాట్ సమాచారం", hi: "बुजुर्गों के लिए घाट जानकारी", en: "Ghats for Elderly" },
      dataResponse: {
        te: "పుష్కర్ ఘాట్ మరియు TTD ఘాట్ వృద్ధులకు అనుకూలం, రాంప్‌లు, వాలంటీర్లు మరియు వైద్య శిబిరాలు ఉన్నాయి. కోటిలింగాల సేవా కేంద్రంలో వీల్ చైర్ సపోర్ట్ ఉంది.",
        hi: "पुष्कर घाट और TTD घाट बुजुर्गों के लिए सबसे अच्छे हैं, रैंप, स्वयंसेवक और मेडिकल कैंप हैं। कोटिलिंगाला सेवा केंद्र में व्हीलचेयर सपोर्ट है।",
        en: "Pushkar Ghat and TTD Ghat have the best facilities for elderly with ramps, volunteers, and medical camps nearby. Wheelchair support is available at Kotilingala Seva Kendra.",
      },
    },
  },
  {
    keywords: {
      te: ["నది లోతు", "స్నానం సేఫ్", "లోతు ఎంత", "నీళ్ళు లోతు"],
      hi: ["नदी गहरी", "पानी गहरा", "स्नान सुरक्षित", "डूबना"],
      en: ["river deep", "water deep", "safe to bathe", "swimming", "danger river", "drown"],
    },
    result: {
      intent: "qa_ghat_depth", route: null, emoji: "🌊", category: "qa",
      label: { te: "నది భద్రత", hi: "नदी सुरक्षा", en: "River Safety" },
      confirmation: { te: "నది భద్రత సమాచారం", hi: "नदी सुरक्षा जानकारी", en: "River Safety Info" },
      dataResponse: {
        te: "ప్రతి ఘాట్ వద్ద నిర్ణీత స్నాన ప్రాంతాలు సురక్షితంగా ఉన్నాయి. లైఫ్‌గార్డ్‌లు మరియు వాలంటీర్లు ఉన్నారు. తాళ్ళ అడ్డంకులు దాటి వెళ్ళకండి. పిల్లలు పెద్దల వెంట ఉండాలి.",
        hi: "हर घाट पर निर्धारित स्नान क्षेत्र सुरक्षित हैं। लाइफगार्ड और स्वयंसेवक मौजूद हैं। रस्सी की बाधाओं से आगे न जाएं। बच्चे बड़ों के साथ रहें।",
        en: "Designated bathing areas at each ghat are safe with controlled water levels. Lifeguards and volunteers are present. Do not go beyond the roped barriers. Children must be accompanied by adults.",
      },
    },
  },
  // ── B. About Pushkaralu / Festival ──
  {
    keywords: {
      te: ["పుష్కరాలు అంటే", "పుష్కరాలు గురించి", "పుష్కరాలు ఏమిటి"],
      hi: ["पुष्कराल क्या है", "पुष्कराल के बारे में", "पुष्कराल का मतलब"],
      en: ["what is pushkaralu", "about pushkaralu", "pushkaralu meaning", "what are pushkaralu"],
    },
    result: {
      intent: "qa_what_pushkaralu", route: null, emoji: "🙏", category: "qa",
      label: { te: "పుష్కరాలు అంటే", hi: "पुष्कराल क्या है", en: "What is Pushkaralu" },
      confirmation: { te: "పుష్కరాలు సమాచారం", hi: "पुष्कराल जानकारी", en: "Pushkaralu Info" },
      dataResponse: {
        te: "గోదావరి పుష్కరాలు ప్రతి 12 సంవత్సరాలకు ఒకసారి రాజమహేంద్రవరంలో గోదావరి నది ఒడ్డున జరిగే పవిత్ర హిందూ పండుగ. యాత్రికులు ఆధ్యాత్మిక శుద్ధి కోసం పవిత్ర స్నానం చేస్తారు.",
        hi: "गोदावरी पुष्कराल हर 12 साल में एक बार राजमहेंद्रवरम में गोदावरी नदी के तट पर होने वाला पवित्र हिंदू त्योहार है। तीर्थयात्री आध्यात्मिक शुद्धि के लिए पवित्र स्नान करते हैं।",
        en: "Godavari Pushkaralu is a sacred Hindu festival held once every 12 years on the banks of the Godavari river in Rajahmundry. Pilgrims take a holy bath for spiritual purification and to wash away sins.",
      },
    },
  },
  {
    keywords: {
      te: ["ఎన్ని రోజులు", "ఎంత కాలం", "పుష్కరాలు ఎన్ని రోజులు"],
      hi: ["कितने दिन", "कब तक", "पुष्कराल कितने दिन"],
      en: ["how many days", "pushkaralu duration", "how long pushkaralu", "how many days pushkaralu"],
    },
    result: {
      intent: "qa_pushkaralu_duration", route: null, emoji: "📅", category: "qa",
      label: { te: "పుష్కరాలు వ్యవధి", hi: "पुष्कराल अवधि", en: "Pushkaralu Duration" },
      confirmation: { te: "పుష్కరాలు వ్యవధి", hi: "पुष्कराल अवधि", en: "Pushkaralu Duration" },
      dataResponse: {
        te: "పుష్కరాలు 12 రోజులు జరుగుతాయి. మొదటి రోజు మరియు చివరి రోజు అత్యంత పవిత్రమైనవి.",
        hi: "पुष्कराल 12 दिन चलते हैं। पहला दिन और आखिरी दिन सबसे पवित्र माने जाते हैं।",
        en: "Pushkaralu lasts for 12 days. The first day and last day are considered most auspicious.",
      },
    },
  },
  {
    keywords: {
      te: ["పుష్కరాలు ఎక్కడ", "ఏ ఊరు", "ఏ నగరం"],
      hi: ["पुष्कराल कहां", "कौन सा शहर", "किस शहर"],
      en: ["where is pushkaralu", "pushkaralu city", "which city pushkaralu"],
    },
    result: {
      intent: "qa_pushkaralu_location", route: null, emoji: "📍", category: "qa",
      label: { te: "పుష్కరాలు ఎక్కడ", hi: "पुष्कराल कहां", en: "Pushkaralu Location" },
      confirmation: { te: "పుష్కరాలు స్థానం", hi: "पुष्कराल स्थान", en: "Pushkaralu Location" },
      dataResponse: {
        te: "గోదావరి పుష్కరాలు ఆంధ్ర ప్రదేశ్, తూర్పు గోదావరి జిల్లా, రాజమహేంద్రవరంలో గోదావరి నది ఒడ్డున జరుగుతాయి.",
        hi: "गोदावरी पुष्कराल आंध्र प्रदेश, पूर्वी गोदावरी जिला, राजमहेंद्रवरम में गोदावरी नदी के तट पर होते हैं।",
        en: "Godavari Pushkaralu is held in Rajahmundry, East Godavari district, Andhra Pradesh, along the banks of the Godavari river.",
      },
    },
  },
  {
    keywords: {
      te: ["పుష్కరాలు ఎందుకు", "ప్రాముఖ్యత", "పవిత్రం ఎందుకు", "పుణ్యం"],
      hi: ["पुष्कराल क्यों", "महत्व", "पवित्र क्यों", "पुण्य"],
      en: ["why pushkaralu", "significance", "importance pushkaralu", "why important", "sacred why"],
    },
    result: {
      intent: "qa_pushkaralu_significance", route: null, emoji: "✨", category: "qa",
      label: { te: "ప్రాముఖ్యత", hi: "महत्व", en: "Significance" },
      confirmation: { te: "పుష్కరాల ప్రాముఖ్యత", hi: "पुष्कराल का महत्व", en: "Pushkaralu Significance" },
      dataResponse: {
        te: "బృహస్పతి నదికి సంబంధించిన రాశిలో ప్రవేశించినప్పుడు పుష్కరాలు వస్తాయి. పుష్కరాల సమయంలో పవిత్ర స్నానం అనేక సంవత్సరాల తపస్సుతో సమానం. పాపాలు తొలగి పుణ్యం లభిస్తుంది.",
        hi: "बृहस्पति जब नदी से जुड़ी राशि में प्रवेश करता है तब पुष्कराल आते हैं। पुष्कराल में पवित्र स्नान कई वर्षों की तपस्या के बराबर माना जाता है। पाप धुलते हैं और पुण्य मिलता है।",
        en: "Pushkaralu occurs when Jupiter enters a zodiac sign associated with the river. A holy bath during Pushkaralu is considered equivalent to many years of penance. It washes away sins and brings spiritual merit.",
      },
    },
  },
  {
    keywords: {
      te: ["ఏం చేయాలి", "పూజ", "తర్పణం", "ఆచారాలు"],
      hi: ["क्या करें", "पूजा", "तर्पण", "अनुष्ठान", "रीति"],
      en: ["what rituals", "what to do at ghat", "pooja", "puja", "ritual", "ceremony", "how to pray", "tarpan"],
    },
    result: {
      intent: "qa_pushkaralu_rituals", route: null, emoji: "🙏", category: "qa",
      label: { te: "ఆచారాలు", hi: "अनुष्ठान", en: "Rituals" },
      confirmation: { te: "పూజా సమాచారం", hi: "पूजा जानकारी", en: "Ritual Information" },
      dataResponse: {
        te: "నదిలో పవిత్ర స్నానం చేయండి, సూర్య భగవానుడికి ప్రార్థన చేయండి, పూర్వీకులకు తర్పణం ఇవ్వండి, దానం చేయండి. అన్ని ఘాట్ల వద్ద పూజారులు మార్గదర్శనం చేస్తారు. పూజ సామాగ్రి ఘాట్ దగ్గర కొనుగోలు చేయవచ్చు.",
        hi: "नदी में पवित्र स्नान करें, सूर्य भगवान को प्रार्थना करें, पूर्वजों को तर्पण दें, दान करें। सभी घाटों पर पुजारी मार्गदर्शन करते हैं। पूजा सामग्री घाट के पास खरीद सकते हैं।",
        en: "Take a holy bath in the river, offer prayers to the Sun God, perform Tarpan for ancestors, and do Daan. Priests are available at all ghats to guide you. Pooja items can be purchased near the ghats.",
      },
    },
  },
  {
    keywords: {
      te: ["పూజ సామాగ్రి", "ఏం తేవాలి పూజకు", "పూలు కొనాలి"],
      hi: ["पूजा सामग्री", "क्या लाना पूजा", "फूल कहां"],
      en: ["pooja items", "puja items", "what to bring for pooja", "buy pooja", "flowers", "pooja samagri"],
    },
    result: {
      intent: "qa_pooja_items", route: null, emoji: "🌺", category: "qa",
      label: { te: "పూజ సామాగ్రి", hi: "पूजा सामग्री", en: "Pooja Items" },
      confirmation: { te: "పూజ సామాగ్రి సమాచారం", hi: "पूजा सामग्री जानकारी", en: "Pooja Items Info" },
      dataResponse: {
        te: "పూలు, పసుపు, కుంకుమ, కొబ్బరికాయ, అగరబత్తులు వంటి పూజ సామాగ్రి ప్రతి ఘాట్ ప్రవేశం దగ్గర కొనుగోలుకు అందుబాటులో ఉంది. ధరలు అధికారులచే నియంత్రించబడతాయి.",
        hi: "फूल, हल्दी, कुमकुम, नारियल, अगरबत्ती जैसी पूजा सामग्री हर घाट के प्रवेश द्वार पर उपलब्ध है। कीमतें अधिकारियों द्वारा नियंत्रित हैं।",
        en: "Pooja items like flowers, turmeric, kumkum, coconut, and incense are available for purchase near every ghat entrance. Prices are regulated by authorities.",
      },
    },
  },
  {
    keywords: {
      te: ["మహా హారతి", "హారతి సమయం", "ఆరతి ఎప్పుడు"],
      hi: ["महा आरती", "आरती समय", "शाम की आरती", "आरती कब"],
      en: ["maha harathi", "aarti time", "harathi", "evening ceremony", "maha arti", "aarti", "arati"],
    },
    result: {
      intent: "qa_maha_harathi", route: null, emoji: "🪔", category: "qa",
      label: { te: "మహా హారతి", hi: "महा आरती", en: "Maha Harathi" },
      confirmation: { te: "మహా హారతి సమాచారం", hi: "महा आरती जानकारी", en: "Maha Harathi Info" },
      dataResponse: {
        te: "మహా హారతి ప్రతి సాయంత్రం 7 గంటలకు పుష్కర్ ఘాట్ వద్ద జరుగుతుంది. నదిపై వేలాది దీపాలతో గొప్ప వేడుక. మంచి స్థానం కోసం ముందుగా చేరుకోండి.",
        hi: "महा आरती हर शाम 7 बजे पुष्कर घाट पर होती है। नदी पर हजारों दीपों के साथ भव्य समारोह। अच्छी जगह के लिए जल्दी पहुंचें।",
        en: "Maha Harathi is performed at Pushkar Ghat every evening at 7 PM. It is a grand ceremony with thousands of lamps on the river. Reach early to get a good spot.",
      },
    },
  },
  // ── C. About Facilities ──
  {
    keywords: {
      te: ["ఏ సౌకర్యాలు", "సేవలు ఏమిటి", "ఏం సౌకర్యాలు ఉన్నాయి"],
      hi: ["क्या सुविधाएं", "कौन सी सेवाएं", "सुविधाएं क्या हैं"],
      en: ["what facilities", "facilities available", "what services", "what is available"],
    },
    result: {
      intent: "qa_facilities_overview", route: null, emoji: "🏗️", category: "qa",
      label: { te: "సౌకర్యాలు", hi: "सुविधाएं", en: "Facilities" },
      confirmation: { te: "సౌకర్యాల సమాచారం", hi: "सुविधाओं की जानकारी", en: "Facilities Info" },
      dataResponse: {
        te: "6 ఉచిత భోజన కేంద్రాలు, 6 నీటి కేంద్రాలు, 200 పైగా టాయిలెట్ యూనిట్లు, 5 వైద్య శిబిరాలు, 4 పోలీస్ హెల్ప్ డెస్క్‌లు, 4 విశ్రాంతి ప్రాంతాలు, 3 వాలంటీర్ కేంద్రాలు ఘాట్ల దగ్గర ఉన్నాయి.",
        hi: "6 मुफ्त भोजन केंद्र, 6 पानी केंद्र, 200 से अधिक टॉयलेट, 5 मेडिकल कैंप, 4 पुलिस हेल्प डेस्क, 4 विश्राम स्थल, 3 स्वयंसेवक केंद्र घाटों के पास उपलब्ध हैं।",
        en: "Free food at 6 centers, drinking water at 6 points, over 200 toilet units, 5 medical camps, 4 police help desks, 4 rest areas, and 3 volunteer centers are available near ghats.",
      },
    },
  },
  {
    keywords: {
      te: ["ఉచిత భోజనం", "అన్నదానం ఉచితమా", "భోజనం ఫ్రీ"],
      hi: ["मुफ्त खाना", "अन्नदानम मुफ्त", "खाना फ्री"],
      en: ["food free", "annadanam free", "free food", "free meals", "is food free"],
    },
    result: {
      intent: "qa_food_free", route: null, emoji: "🍲", category: "qa",
      label: { te: "ఉచిత భోజనం", hi: "मुफ्त भोजन", en: "Free Food" },
      confirmation: { te: "ఉచిత భోజన సమాచారం", hi: "मुफ्त भोजन जानकारी", en: "Free Food Info" },
      dataResponse: {
        te: "అవును, ఘాట్ల దగ్గర 6 ప్రదేశాల్లో ఉచిత అన్నదానం అందుబాటులో ఉంది, ఇస్కాన్ మరియు TTD కేంద్రాలు కూడా ఉన్నాయి. ఉదయం 6 నుండి రాత్రి 10 వరకు తెరిచి ఉంటాయి.",
        hi: "हां, घाटों के पास 6 जगहों पर मुफ्त अन्नदानम उपलब्ध है, इस्कॉन और TTD केंद्र भी हैं। सुबह 6 से रात 10 बजे तक खुले रहते हैं।",
        en: "Yes, free Annadanam meals are available at 6 locations near the ghats, including ISKCON and TTD centers. Open from 6 AM to 10 PM.",
      },
    },
  },
  {
    keywords: {
      te: ["టాయిలెట్ ఉచితమా", "ఉచిత టాయిలెట్", "టాయిలెట్ ఛార్జ్"],
      hi: ["टॉयलेट मुफ्त", "शौचालय मुफ्त", "टॉयलेट चार्ज"],
      en: ["toilet free", "free toilet", "toilet charge", "are toilets free"],
    },
    result: {
      intent: "qa_toilet_free", route: null, emoji: "🚻", category: "qa",
      label: { te: "ఉచిత టాయిలెట్", hi: "मुफ्त शौचालय", en: "Free Toilets" },
      confirmation: { te: "టాయిలెట్ సమాచారం", hi: "शौचालय जानकारी", en: "Toilet Info" },
      dataResponse: {
        te: "అవును, ఘాట్ల దగ్గర అన్ని సులభ్ టాయిలెట్లు మరియు మొబైల్ టాయిలెట్లు యాత్రికులకు ఉచితం. 200 పైగా టాయిలెట్ యూనిట్లు ఉన్నాయి.",
        hi: "हां, घाटों के पास सभी सुलभ शौचालय और मोबाइल शौचालय तीर्थयात्रियों के लिए मुफ्त हैं। 200 से अधिक टॉयलेट यूनिट हैं।",
        en: "Yes, all toilets near the ghats are free for pilgrims. Over 200 toilet units including Sulabh and mobile toilets are available.",
      },
    },
  },
  {
    keywords: {
      te: ["మంచినీళ్ళు ఉన్నాయా", "RO వాటర్", "తాగు నీరు సేఫ్"],
      hi: ["पीने का पानी", "RO पानी", "सुरक्षित पानी", "पानी मिलेगा"],
      en: ["drinking water safe", "water available", "purified water", "RO water", "is water safe"],
    },
    result: {
      intent: "qa_drinking_water", route: null, emoji: "💧", category: "qa",
      label: { te: "తాగు నీరు", hi: "पीने का पानी", en: "Drinking Water" },
      confirmation: { te: "నీటి సమాచారం", hi: "पानी जानकारी", en: "Water Info" },
      dataResponse: {
        te: "అవును, అన్ని ప్రధాన ఘాట్ల దగ్గర 6 కేంద్రాల్లో ఉచిత శుద్ధి చేసిన RO తాగునీరు అందుబాటులో ఉంది. కొన్ని చోట్ల మధ్యాహ్నం మజ్జిగ మరియు కొబ్బరి నీళ్ళు కూడా పంపిణీ చేస్తారు.",
        hi: "हां, सभी प्रमुख घाटों के पास 6 केंद्रों पर मुफ्त शुद्ध RO पीने का पानी उपलब्ध है। कुछ जगहों पर दोपहर में छाछ और नारियल पानी भी बांटा जाता है।",
        en: "Yes, free purified RO drinking water is available at 6 stations near all major ghats. Buttermilk and coconut water are also distributed at some points in the afternoon.",
      },
    },
  },
  {
    keywords: {
      te: ["విశ్రాంతి", "ఎక్కడ పడుకోవాలి", "వసతి", "హోటల్ ఉందా", "ఉండే చోటు"],
      hi: ["आराम", "कहां सोएं", "रहने की जगह", "आवास", "धर्मशाला", "होटल"],
      en: ["rest area", "place to rest", "sleep", "shelter", "rest house", "accommodation", "stay", "lodge", "where to stay"],
    },
    result: {
      intent: "qa_rest_areas", route: null, emoji: "🏨", category: "qa",
      label: { te: "విశ్రాంతి", hi: "विश्राम", en: "Rest Areas" },
      confirmation: { te: "విశ్రాంతి సమాచారం", hi: "विश्राम जानकारी", en: "Rest Area Info" },
      dataResponse: {
        te: "4 విశ్రాంతి ప్రాంతాలు ఉన్నాయి: పుష్కర్ ఘాట్ రెస్ట్ పందిరి ఫ్యాన్లతో, కోటిలింగాల తీర్థయాత్ర షెల్టర్ వృద్ధులకు మంచాలు మరియు లగేజ్ స్టోరేజ్‌తో, రైల్వే స్టేషన్ వెయిటింగ్ హాల్ AC తో, TTD పిల్గ్రిమ్ రెస్ట్ హౌస్ గదులు మరియు డార్మిటరీతో.",
        hi: "4 विश्राम स्थल हैं: पुष्कर घाट रेस्ट पंडाल पंखों के साथ, कोटिलिंगाला तीर्थयात्री शेल्टर बुजुर्गों के लिए चारपाई और सामान रखने की जगह, रेलवे स्टेशन वेटिंग हॉल AC के साथ, TTD तीर्थयात्री विश्राम गृह कमरे और डॉर्मिटरी।",
        en: "4 rest areas are available: Pushkar Ghat Rest Pandal with fans, Kotilingala Pilgrim Shelter with cots for elderly and luggage storage, Railway Station Waiting Hall with AC, and TTD Pilgrim Rest House with rooms and dormitory.",
      },
    },
  },
  {
    keywords: {
      te: ["లగేజ్", "సామాన్లు ఎక్కడ", "లాకర్", "బ్యాగ్ ఎక్కడ పెట్టాలి"],
      hi: ["सामान", "लॉकर", "बैग कहां रखें", "सामान कहां"],
      en: ["luggage", "locker", "bag", "keep bags", "safe keep", "cloakroom", "where to keep bags"],
    },
    result: {
      intent: "qa_luggage", route: null, emoji: "🧳", category: "qa",
      label: { te: "లగేజ్", hi: "सामान", en: "Luggage" },
      confirmation: { te: "లగేజ్ సమాచారం", hi: "सामान जानकारी", en: "Luggage Info" },
      dataResponse: {
        te: "కోటిలింగాల తీర్థయాత్ర షెల్టర్ మరియు రైల్వే స్టేషన్ వెయిటింగ్ హాల్ వద్ద లగేజ్ స్టోరేజ్ అందుబాటులో ఉంది. విలువైన వస్తువులు జాగ్రత్తగా ఉంచండి, ఘాట్ల వద్ద బ్యాగ్‌లు వదిలి పెట్టకండి.",
        hi: "कोटिलिंगाला तीर्थयात्री शेल्टर और रेलवे स्टेशन वेटिंग हॉल में सामान रखने की जगह है। कीमती सामान सुरक्षित रखें, घाटों पर बैग न छोड़ें।",
        en: "Luggage storage is available at Kotilingala Pilgrim Shelter and Railway Station Waiting Hall. Keep your valuables safe and do not leave bags unattended at the ghats.",
      },
    },
  },
  // ── D. About Transport ──
  {
    keywords: {
      te: ["షటిల్ ఉచితమా", "ఉచిత బస్", "బస్ ఫ్రీ"],
      hi: ["शटल मुफ्त", "मुफ्त बस", "बस फ्री"],
      en: ["shuttle free", "free bus", "free shuttle", "bus free", "is shuttle free"],
    },
    result: {
      intent: "qa_shuttle_free", route: null, emoji: "🚌", category: "qa",
      label: { te: "ఉచిత షటిల్", hi: "मुफ्त शटल", en: "Free Shuttle" },
      confirmation: { te: "షటిల్ సమాచారం", hi: "शटल जानकारी", en: "Shuttle Info" },
      dataResponse: {
        te: "అవును, ఉచిత షటిల్ బస్సులు ప్రతి 10 నుండి 15 నిమిషాలకు అన్ని ఘాట్ల మధ్య ఉదయం 5 నుండి రాత్రి 11 వరకు నడుస్తాయి.",
        hi: "हां, मुफ्त शटल बसें हर 10 से 15 मिनट में सभी घाटों के बीच सुबह 5 से रात 11 बजे तक चलती हैं।",
        en: "Yes, free shuttle buses run every 10 to 15 minutes between all ghats from 5 AM to 11 PM.",
      },
    },
  },
  {
    keywords: {
      te: ["షటిల్ సమయం", "బస్ ఎప్పుడు", "షటిల్ టైమింగ్"],
      hi: ["शटल समय", "बस कब", "शटल टाइमिंग"],
      en: ["shuttle timing", "shuttle time", "bus timing", "when shuttle", "shuttle schedule"],
    },
    result: {
      intent: "qa_shuttle_timing", route: null, emoji: "🕐", category: "qa",
      label: { te: "షటిల్ సమయం", hi: "शटल समय", en: "Shuttle Timing" },
      confirmation: { te: "షటిల్ సమయం", hi: "शटल समय", en: "Shuttle Timing" },
      dataResponse: {
        te: "ఉచిత షటిల్ బస్సులు ఉదయం 5 నుండి రాత్రి 11 వరకు, ప్రతి 10 నుండి 15 నిమిషాలకు నడుస్తాయి.",
        hi: "मुफ्त शटल बसें सुबह 5 से रात 11 बजे तक, हर 10 से 15 मिनट में चलती हैं।",
        en: "Free shuttle buses run from 5 AM to 11 PM, every 10 to 15 minutes.",
      },
    },
  },
  {
    keywords: {
      te: ["షటిల్ రూట్", "బస్ ఎక్కడ", "షటిల్ ఎక్కడికి"],
      hi: ["शटल रूट", "बस कहां जाती", "शटल कहां"],
      en: ["shuttle route", "shuttle stops", "bus route", "where does shuttle", "shuttle path"],
    },
    result: {
      intent: "qa_shuttle_route", route: null, emoji: "🗺️", category: "qa",
      label: { te: "షటిల్ రూట్", hi: "शटल रूट", en: "Shuttle Route" },
      confirmation: { te: "షటిల్ రూట్ సమాచారం", hi: "शटल रूट जानकारी", en: "Shuttle Route Info" },
      dataResponse: {
        te: "రూట్ 1: రైల్వే స్టేషన్ → బస్ స్టాండ్ → పుష్కర్ ఘాట్ → కోటిలింగాల → సరస్వతి ఘాట్. రూట్ 2: దౌలేశ్వరం → గౌతమి ఘాట్ → బోట్ ఆఫీస్ → పుష్కర్ ఘాట్ → రైల్వే స్టేషన్. రెండూ ఉచితం.",
        hi: "रूट 1: रेलवे स्टेशन → बस स्टैंड → पुष्कर घाट → कोटिलिंगाला → सरस्वती घाट। रूट 2: दौलेश्वरम → गौतमी घाट → बोट ऑफिस → पुष्कर घाट → रेलवे स्टेशन। दोनों मुफ्त हैं।",
        en: "Route 1: Railway Station to Bus Stand to Pushkar Ghat to Kotilingala to Saraswati Ghat. Route 2: Dowlaishwaram to Gowthami Ghat to Boat Office to Pushkar Ghat to Railway Station. Both are free.",
      },
    },
  },
  {
    keywords: {
      te: ["బోట్ సర్వీస్", "పడవ", "ఫెర్రీ", "బోటు"],
      hi: ["नाव सेवा", "बोट सर्विस", "फेरी"],
      en: ["boat available", "boat service", "ferry service", "boat ride"],
    },
    result: {
      intent: "qa_boat_service", route: null, emoji: "⛵", category: "qa",
      label: { te: "బోట్ సర్వీస్", hi: "नाव सेवा", en: "Boat Service" },
      confirmation: { te: "బోట్ సమాచారం", hi: "नाव जानकारी", en: "Boat Info" },
      dataResponse: {
        te: "అవును, గోదావరి నదిపై పుష్కర్ ఘాట్ మరియు బోట్ ఆఫీస్ ఘాట్ దగ్గర బోట్ మరియు ఫెర్రీ సర్వీసులు అందుబాటులో ఉన్నాయి.",
        hi: "हां, गोदावरी नदी पर पुष्कर घाट और बोट ऑफिस घाट के पास नाव और फेरी सेवाएं उपलब्ध हैं।",
        en: "Yes, boat and ferry services are available on the Godavari river near Pushkar Ghat and Boat Office Ghat.",
      },
    },
  },
  {
    keywords: {
      te: ["పార్కింగ్ ఉందా", "పార్కింగ్ ఎక్కడ", "కారు పార్క్"],
      hi: ["पार्किंग कहां", "गाड़ी कहां", "पार्किंग है"],
      en: ["parking available", "where to park", "parking facility", "car park", "is there parking"],
    },
    result: {
      intent: "qa_parking_info", route: null, emoji: "🅿️", category: "qa",
      label: { te: "పార్కింగ్", hi: "पार्किंग", en: "Parking" },
      confirmation: { te: "పార్కింగ్ సమాచారం", hi: "पार्किंग जानकारी", en: "Parking Info" },
      dataResponse: {
        te: "నిర్ణీత పార్కింగ్ లాట్లలో పార్కింగ్ అందుబాటులో ఉంది. ఉచిత షటిల్ బస్సులు ప్రతి 10 నిమిషాలకు పార్కింగ్ ప్రాంతాల నుండి అన్ని ఘాట్లకు తీసుకెళ్తాయి.",
        hi: "निर्धारित पार्किंग लॉट में पार्किंग उपलब्ध है। मुफ्त शटल बसें हर 10 मिनट में पार्किंग से सभी घाटों तक ले जाती हैं।",
        en: "Parking is available at designated lots. Free shuttle buses connect parking areas to all ghats every 10 minutes.",
      },
    },
  },
  {
    keywords: {
      te: ["రాజమహేంద్రవరం ఎలా రావాలి", "ఎలా వస్తాం", "ఎలా చేరాలి"],
      hi: ["राजमहेंद्रवरम कैसे आएं", "कैसे पहुंचें", "कैसे आएं"],
      en: ["how to reach", "how to come", "reach rajahmundry", "come rajahmundry", "how to get to rajahmundry"],
    },
    result: {
      intent: "qa_reach_rajahmundry", route: null, emoji: "🚆", category: "qa",
      label: { te: "ఎలా రావాలి", hi: "कैसे आएं", en: "How to Reach" },
      confirmation: { te: "రవాణా సమాచారం", hi: "यात्रा जानकारी", en: "Travel Info" },
      dataResponse: {
        te: "రాజమహేంద్రవరం బాగా కనెక్ట్ అయి ఉంది. రైలు: రాజమహేంద్రవరం రైల్వే స్టేషన్. బస్: హైదరాబాద్ నుండి 7 గంటలు, విజయవాడ నుండి 4 గంటలు, విశాఖపట్నం నుండి 5 గంటలు. విమానం: రాజమహేంద్రవరం ఎయిర్‌పోర్ట్.",
        hi: "राजमहेंद्रवरम अच्छी तरह जुड़ा है। ट्रेन: राजमहेंद्रवरम रेलवे स्टेशन। बस: हैदराबाद से 7 घंटे, विजयवाड़ा से 4 घंटे, विशाखापट्टनम से 5 घंटे। हवाई: राजमहेंद्रवरम एयरपोर्ट।",
        en: "Rajahmundry is well connected. By train: Rajahmundry Railway Station. By bus: APSRTC buses from Hyderabad 7 hours, Vijayawada 4 hours, Visakhapatnam 5 hours. By air: Rajahmundry Airport has flights from major cities.",
      },
    },
  },
  {
    keywords: {
      te: ["ఆటో ఛార్జ్", "ఆటో ఎంత", "ఆటో ధర"],
      hi: ["ऑटो किराया", "ऑटो कितना", "ऑटो चार्ज"],
      en: ["auto fare", "auto cost", "auto price", "auto charge", "how much auto"],
    },
    result: {
      intent: "qa_auto_fare", route: null, emoji: "🛺", category: "qa",
      label: { te: "ఆటో ఛార్జ్", hi: "ऑटो किराया", en: "Auto Fare" },
      confirmation: { te: "ఆటో ఛార్జ్ సమాచారం", hi: "ऑटो किराया जानकारी", en: "Auto Fare Info" },
      dataResponse: {
        te: "రైల్వే స్టేషన్ నుండి ఘాట్లకు ఆటో ఛార్జ్ సుమారు 50 నుండి 100 రూపాయలు. బస్ స్టాండ్ నుండి 30 నుండి 80 రూపాయలు. కానీ ఉచిత షటిల్ బస్సులు ఉన్నాయి, డబ్బు ఆదా చేయవచ్చు.",
        hi: "रेलवे स्टेशन से घाटों तक ऑटो किराया लगभग 50 से 100 रुपये। बस स्टैंड से 30 से 80 रुपये। लेकिन मुफ्त शटल बसें हैं, पैसे बचा सकते हैं।",
        en: "Auto fare from Railway Station to ghats is approximately 50 to 100 rupees. From Bus Stand to ghats is 30 to 80 rupees. But free shuttle buses are available, so you can save money.",
      },
    },
  },
  // ── D2. Intercity Train & Bus Schedules (bus-only, train-only, and combined per city) ──
  // --- HYDERABAD ---
  // Buses only
  {
    keywords: {
      te: ["హైదరాబాద్ బస్", "హైదరాబాద్ బస్సు", "హైదరాబాద్ బస్సులు", "సికింద్రాబాద్ బస్"],
      hi: ["हैदराबाद बस", "हैदराबाद बसें"],
      en: ["bus to hyderabad", "buses to hyderabad", "hyderabad bus", "hyderabad buses"],
    },
    result: {
      intent: "qa_hyderabad_buses", route: "/transport?dest=hyderabad&mode=buses", emoji: "🚌", category: "transport",
      label: { te: "హైదరాబాద్ బస్సులు", hi: "हैदराबाद बसें", en: "Buses to Hyderabad" },
      confirmation: { te: "హైదరాబాద్ బస్సులు చూపిస్తున్నాను", hi: "हैदराबाद बसें दिखा रहे हैं", en: "Showing buses to Hyderabad" },
      dataResponse: {
        te: "హైదరాబాద్ బస్సులు: APSRTC సూపర్ లగ్జరీ AC మధ్యాహ్నం 2:00 ఏడు గంటలు 900 రూపాయలు. APSRTC ఎక్స్‌ప్రెస్ సాయంత్రం 6:00 ఎనిమిదిన్నర గంటలు 550 రూపాయలు.",
        hi: "हैदराबाद बसें: APSRTC सुपर लग्ज़री AC दोपहर 2:00 सात घंटे 900 रुपये। APSRTC एक्सप्रेस शाम 6:00 साढ़े आठ घंटे 550 रुपये।",
        en: "Buses to Hyderabad: APSRTC Super Luxury AC at 2 PM, 7 hours, 900 rupees. APSRTC Express at 6 PM, 8 and half hours, 550 rupees.",
      },
    },
  },
  // Trains only
  {
    keywords: {
      te: ["హైదరాబాద్ రైలు", "హైదరాబాద్ ట్రైన్", "హైదరాబాద్ రైళ్ళు", "సికింద్రాబాద్ రైలు"],
      hi: ["हैदराबाद ट्रेन", "हैदराबाद रेल", "हैदराबाद ट्रेनें"],
      en: ["train to hyderabad", "trains to hyderabad", "hyderabad train", "hyderabad trains"],
    },
    result: {
      intent: "qa_hyderabad_trains", route: "/transport?dest=hyderabad&mode=trains", emoji: "🚆", category: "transport",
      label: { te: "హైదరాబాద్ రైళ్ళు", hi: "हैदराबाद ट्रेनें", en: "Trains to Hyderabad" },
      confirmation: { te: "హైదరాబాద్ రైళ్ళు చూపిస్తున్నాను", hi: "हैदराबाद ट्रेनें दिखा रहे हैं", en: "Showing trains to Hyderabad" },
      dataResponse: {
        te: "హైదరాబాద్ రైళ్ళు: గోదావరి ఎక్స్‌ప్రెస్ 1 2 7 2 7 మధ్యాహ్నం 2:30 ప్లాట్‌ఫాం 1 పదిన్నర గంటలు. ఈస్ట్ కోస్ట్ ఎక్స్‌ప్రెస్ 1 8 6 4 5 రాత్రి 10:30 ప్లాట్‌ఫాం 3 పన్నెండు గంటలు.",
        hi: "हैदराबाद ट्रेनें: गोदावरी एक्सप्रेस 1 2 7 2 7 दोपहर 2:30 प्लेटफॉर्म 1 साढ़े दस घंटे। ईस्ट कोस्ट एक्सप्रेस 1 8 6 4 5 रात 10:30 प्लेटफॉर्म 3 बारह घंटे।",
        en: "Trains to Hyderabad: Godavari Express 1 2 7 2 7 departs 2:30 PM Platform 1, 10 and half hours. East Coast Express 1 8 6 4 5 departs 10:30 PM Platform 3, 12 hours.",
      },
    },
  },
  // Combined (go to / how to reach)
  {
    keywords: {
      te: ["హైదరాబాద్ ఎలా వెళ్ళాలి", "హైదరాబాద్ ప్రయాణం"],
      hi: ["हैदराबाद कैसे जाएं"],
      en: ["go to hyderabad", "how to go hyderabad", "hyderabad transport"],
    },
    result: {
      intent: "qa_hyderabad_schedule", route: "/transport?dest=hyderabad", emoji: "🚆", category: "transport",
      label: { te: "హైదరాబాద్ రైళ్ళు & బస్సులు", hi: "हैदराबाद ट्रेन और बस", en: "Hyderabad Trains & Buses" },
      confirmation: { te: "హైదరాబాద్ రైళ్ళు & బస్సులు చూపిస్తున్నాను", hi: "हैदराबाद ट्रेन और बस दिखा रहे हैं", en: "Showing trains and buses to Hyderabad" },
      dataResponse: {
        te: "హైదరాబాద్‌కు రైళ్ళు: గోదావరి ఎక్స్‌ప్రెస్ 1 2 7 2 7 మధ్యాహ్నం 2:30 ప్లాట్‌ఫాం 1. ఈస్ట్ కోస్ట్ ఎక్స్‌ప్రెస్ 1 8 6 4 5 రాత్రి 10:30. బస్సులు: APSRTC సూపర్ లగ్జరీ AC మధ్యాహ్నం 2:00 900 రూపాయలు. APSRTC ఎక్స్‌ప్రెస్ సాయంత్రం 6:00 550 రూపాయలు.",
        hi: "हैदराबाद ट्रेनें: गोदावरी एक्सप्रेस 1 2 7 2 7 दोपहर 2:30 प्लेटफॉर्म 1। ईस्ट कोस्ट एक्सप्रेस 1 8 6 4 5 रात 10:30। बसें: APSRTC सुपर लग्ज़री AC दोपहर 2:00 900 रुपये। APSRTC एक्सप्रेस शाम 6:00 550 रुपये।",
        en: "Trains to Hyderabad: Godavari Express 1 2 7 2 7 at 2:30 PM Platform 1. East Coast Express 1 8 6 4 5 at 10:30 PM. Buses: APSRTC Super Luxury AC at 2 PM, 900 rupees. APSRTC Express at 6 PM, 550 rupees.",
      },
    },
  },
  // --- VIJAYAWADA ---
  {
    keywords: {
      te: ["విజయవాడ బస్", "విజయవాడ బస్సు", "విజయవాడ బస్సులు"],
      hi: ["विजयवाड़ा बस", "विजयवाड़ा बसें"],
      en: ["bus to vijayawada", "buses to vijayawada", "vijayawada bus", "vijayawada buses"],
    },
    result: {
      intent: "qa_vijayawada_buses", route: "/transport?dest=vijayawada&mode=buses", emoji: "🚌", category: "transport",
      label: { te: "విజయవాడ బస్సులు", hi: "विजयवाड़ा बसें", en: "Buses to Vijayawada" },
      confirmation: { te: "విజయవాడ బస్సులు చూపిస్తున్నాను", hi: "विजयवाड़ा बसें दिखा रहे हैं", en: "Showing buses to Vijayawada" },
      dataResponse: {
        te: "విజయవాడ బస్సులు: APSRTC గరుడ AC ఉదయం 7:00 నాలుగు గంటలు 400 రూపాయలు. APSRTC ఎక్స్‌ప్రెస్ ఉదయం 11:30 ఐదు గంటలు 250 రూపాయలు.",
        hi: "विजयवाड़ा बसें: APSRTC गरुड़ AC सुबह 7:00 चार घंटे 400 रुपये। APSRTC एक्सप्रेस सुबह 11:30 पांच घंटे 250 रुपये।",
        en: "Buses to Vijayawada: APSRTC Garuda AC at 7 AM, 4 hours, 400 rupees. APSRTC Express at 11:30 AM, 5 hours, 250 rupees.",
      },
    },
  },
  {
    keywords: {
      te: ["విజయవాడ రైలు", "విజయవాడ ట్రైన్", "విజయవాడ రైళ్ళు"],
      hi: ["विजयवाड़ा ट्रेन", "विजयवाड़ा रेल", "विजयवाड़ा ट्रेनें"],
      en: ["train to vijayawada", "trains to vijayawada", "vijayawada train", "vijayawada trains"],
    },
    result: {
      intent: "qa_vijayawada_trains", route: "/transport?dest=vijayawada&mode=trains", emoji: "🚆", category: "transport",
      label: { te: "విజయవాడ రైళ్ళు", hi: "विजयवाड़ा ट्रेनें", en: "Trains to Vijayawada" },
      confirmation: { te: "విజయవాడ రైళ్ళు చూపిస్తున్నాను", hi: "विजयवाड़ा ट्रेनें दिखा रहे हैं", en: "Showing trains to Vijayawada" },
      dataResponse: {
        te: "విజయవాడ రైళ్ళు: జన్మభూమి ఎక్స్‌ప్రెస్ 1 2 8 0 5 ఉదయం 6:45 ప్లాట్‌ఫాం 2 నాలుగున్నర గంటలు. ప్యాసింజర్ 5 7 2 6 4 ఉదయం 10:30 ప్లాట్‌ఫాం 4 ఐదున్నర గంటలు.",
        hi: "विजयवाड़ा ट्रेनें: जन्मभूमि एक्सप्रेस 1 2 8 0 5 सुबह 6:45 प्लेटफॉर्म 2 साढ़े चार घंटे। पैसेंजर 5 7 2 6 4 सुबह 10:30 प्लेटफॉर्म 4 साढ़े पांच घंटे।",
        en: "Trains to Vijayawada: Janmabhoomi Express 1 2 8 0 5 departs 6:45 AM Platform 2, 4 hours 15 minutes. Passenger 5 7 2 6 4 departs 10:30 AM Platform 4, 5 hours 30 minutes.",
      },
    },
  },
  {
    keywords: {
      te: ["విజయవాడ ఎలా వెళ్ళాలి", "విజయవాడ ప్రయాణం"],
      hi: ["विजयवाड़ा कैसे जाएं"],
      en: ["go to vijayawada", "how to go vijayawada", "vijayawada transport"],
    },
    result: {
      intent: "qa_vijayawada_schedule", route: "/transport?dest=vijayawada", emoji: "🚆", category: "transport",
      label: { te: "విజయవాడ రైళ్ళు & బస్సులు", hi: "विजयवाड़ा ट्रेन और बस", en: "Vijayawada Trains & Buses" },
      confirmation: { te: "విజయవాడ రైళ్ళు & బస్సులు చూపిస్తున్నాను", hi: "विजयवाड़ा ट्रेन और बस दिखा रहे हैं", en: "Showing trains and buses to Vijayawada" },
      dataResponse: {
        te: "విజయవాడకు రైళ్ళు: జన్మభూమి ఎక్స్‌ప్రెస్ 1 2 8 0 5 ఉదయం 6:45. ప్యాసింజర్ 5 7 2 6 4 ఉదయం 10:30. బస్సులు: APSRTC గరుడ AC ఉదయం 7:00 400 రూపాయలు. APSRTC ఎక్స్‌ప్రెస్ ఉదయం 11:30 250 రూపాయలు.",
        hi: "विजयवाड़ा ट्रेनें: जन्मभूमि एक्सप्रेस 1 2 8 0 5 सुबह 6:45। पैसेंजर 5 7 2 6 4 सुबह 10:30। बसें: APSRTC गरुड़ AC सुबह 7:00 400 रुपये। APSRTC एक्सप्रेस सुबह 11:30 250 रुपये।",
        en: "Trains to Vijayawada: Janmabhoomi Express 1 2 8 0 5 at 6:45 AM. Passenger 5 7 2 6 4 at 10:30 AM. Buses: APSRTC Garuda AC at 7 AM, 400 rupees. APSRTC Express at 11:30 AM, 250 rupees.",
      },
    },
  },
  // --- VISAKHAPATNAM ---
  {
    keywords: {
      te: ["విశాఖపట్నం బస్", "విశాఖపట్నం బస్సులు", "వైజాగ్ బస్"],
      hi: ["विशाखापट्टनम बस", "विशाखापट्टनम बसें", "वाइजैग बस"],
      en: ["bus to visakhapatnam", "buses to visakhapatnam", "visakhapatnam bus", "visakhapatnam buses", "vizag bus", "vizag buses", "buses to vizag"],
    },
    result: {
      intent: "qa_visakhapatnam_buses", route: "/transport?dest=visakhapatnam&mode=buses", emoji: "🚌", category: "transport",
      label: { te: "విశాఖపట్నం బస్సులు", hi: "विशाखापट्टनम बसें", en: "Buses to Visakhapatnam" },
      confirmation: { te: "విశాఖపట్నం బస్సులు చూపిస్తున్నాను", hi: "विशाखापट्टनम बसें दिखा रहे हैं", en: "Showing buses to Visakhapatnam" },
      dataResponse: {
        te: "విశాఖపట్నం బస్సులు: APSRTC సూపర్ లగ్జరీ AC ఉదయం 9:00 ఐదు గంటలు 600 రూపాయలు. APSRTC ఎక్స్‌ప్రెస్ మధ్యాహ్నం 3:30 ఆరున్నర గంటలు 350 రూపాయలు.",
        hi: "विशाखापट्टनम बसें: APSRTC सुपर लग्ज़री AC सुबह 9:00 पांच घंटे 600 रुपये। APSRTC एक्सप्रेस दोपहर 3:30 साढ़े छह घंटे 350 रुपये।",
        en: "Buses to Visakhapatnam: APSRTC Super Luxury AC at 9 AM, 5 hours, 600 rupees. APSRTC Express at 3:30 PM, 6 and half hours, 350 rupees.",
      },
    },
  },
  {
    keywords: {
      te: ["విశాఖపట్నం రైలు", "విశాఖపట్నం ట్రైన్", "విశాఖపట్నం రైళ్ళు", "వైజాగ్ రైలు"],
      hi: ["विशाखापट्टनम ट्रेन", "विशाखापट्टनम रेल", "विशाखापट्टनम ट्रेनें", "वाइजैग ट्रेन"],
      en: ["train to visakhapatnam", "trains to visakhapatnam", "visakhapatnam train", "visakhapatnam trains", "vizag train", "vizag trains", "trains to vizag"],
    },
    result: {
      intent: "qa_visakhapatnam_trains", route: "/transport?dest=visakhapatnam&mode=trains", emoji: "🚆", category: "transport",
      label: { te: "విశాఖపట్నం రైళ్ళు", hi: "विशाखापट्टनम ट्रेनें", en: "Trains to Visakhapatnam" },
      confirmation: { te: "విశాఖపట్నం రైళ్ళు చూపిస్తున్నాను", hi: "विशाखापट्टनम ट्रेनें दिखा रहे हैं", en: "Showing trains to Visakhapatnam" },
      dataResponse: {
        te: "విశాఖపట్నం రైళ్ళు: గౌతమి ఎక్స్‌ప్రెస్ 1 2 7 3 7 ఉదయం 8:00 ప్లాట్‌ఫాం 2 నాలుగున్నర గంటలు. విశాఖ ఎక్స్‌ప్రెస్ 1 7 4 8 8 సాయంత్రం 4:15 ప్లాట్‌ఫాం 1 ఐదు గంటలు.",
        hi: "विशाखापट्टनम ट्रेनें: गौतमी एक्सप्रेस 1 2 7 3 7 सुबह 8:00 प्लेटफॉर्म 2 साढ़े चार घंटे। विशाखा एक्सप्रेस 1 7 4 8 8 शाम 4:15 प्लेटफॉर्म 1 पांच घंटे।",
        en: "Trains to Visakhapatnam: Gautami Express 1 2 7 3 7 departs 8 AM Platform 2, 4 and half hours. Visakha Express 1 7 4 8 8 departs 4:15 PM Platform 1, 5 hours.",
      },
    },
  },
  {
    keywords: {
      te: ["విశాఖపట్నం ఎలా వెళ్ళాలి", "వైజాగ్ ఎలా వెళ్ళాలి"],
      hi: ["विशाखापट्टनम कैसे जाएं"],
      en: ["go to visakhapatnam", "go to vizag", "how to go visakhapatnam", "visakhapatnam transport"],
    },
    result: {
      intent: "qa_visakhapatnam_schedule", route: "/transport?dest=visakhapatnam", emoji: "🚆", category: "transport",
      label: { te: "విశాఖపట్నం రైళ్ళు & బస్సులు", hi: "विशाखापट्टनम ट्रेन और बस", en: "Visakhapatnam Trains & Buses" },
      confirmation: { te: "విశాఖపట్నం రైళ్ళు & బస్సులు చూపిస్తున్నాను", hi: "विशाखापट्टनम ट्रेन और बस दिखा रहे हैं", en: "Showing trains and buses to Visakhapatnam" },
      dataResponse: {
        te: "విశాఖపట్నం రైళ్ళు: గౌతమి ఎక్స్‌ప్రెస్ 1 2 7 3 7 ఉదయం 8:00. విశాఖ ఎక్స్‌ప్రెస్ 1 7 4 8 8 సాయంత్రం 4:15. బస్సులు: APSRTC సూపర్ లగ్జరీ AC ఉదయం 9:00 600 రూపాయలు. APSRTC ఎక్స్‌ప్రెస్ మధ్యాహ్నం 3:30 350 రూపాయలు.",
        hi: "विशाखापट्टनम ट्रेनें: गौतमी एक्सप्रेस 1 2 7 3 7 सुबह 8:00। विशाखा एक्सप्रेस 1 7 4 8 8 शाम 4:15। बसें: APSRTC सुपर लग्ज़री AC सुबह 9:00 600 रुपये। APSRTC एक्सप्रेस दोपहर 3:30 350 रुपये।",
        en: "Trains to Visakhapatnam: Gautami Express 1 2 7 3 7 at 8 AM. Visakha Express 1 7 4 8 8 at 4:15 PM. Buses: APSRTC Super Luxury AC at 9 AM, 600 rupees. APSRTC Express at 3:30 PM, 350 rupees.",
      },
    },
  },
  // --- KAKINADA ---
  {
    keywords: {
      te: ["కాకినాడ బస్", "కాకినాడ బస్సు", "కాకినాడ బస్సులు"],
      hi: ["काकीनाडा बस", "काकीनाडा बसें"],
      en: ["bus to kakinada", "buses to kakinada", "kakinada bus", "kakinada buses"],
    },
    result: {
      intent: "qa_kakinada_buses", route: "/transport?dest=kakinada&mode=buses", emoji: "🚌", category: "transport",
      label: { te: "కాకినాడ బస్సులు", hi: "काकीनाडा बसें", en: "Buses to Kakinada" },
      confirmation: { te: "కాకినాడ బస్సులు చూపిస్తున్నాను", hi: "काकीनाडा बसें दिखा रहे हैं", en: "Showing buses to Kakinada" },
      dataResponse: {
        te: "కాకినాడ బస్సులు: APSRTC డీలక్స్ ఉదయం 8:00 గంటన్నర 120 రూపాయలు. సిటీ బస్ ప్రతి 15 నిమిషాలు 80 రూపాయలు.",
        hi: "काकीनाडा बसें: APSRTC डीलक्स सुबह 8:00 डेढ़ घंटे 120 रुपये। सिटी बस हर 15 मिनट 80 रुपये।",
        en: "Buses to Kakinada: APSRTC Deluxe at 8 AM, 1 and half hours, 120 rupees. City Bus every 15 minutes, 80 rupees.",
      },
    },
  },
  {
    keywords: {
      te: ["కాకినాడ రైలు", "కాకినాడ ట్రైన్", "కాకినాడ రైళ్ళు"],
      hi: ["काकीनाडा ट्रेन", "काकीनाडा रेल", "काकीनाडा ट्रेनें"],
      en: ["train to kakinada", "trains to kakinada", "kakinada train", "kakinada trains"],
    },
    result: {
      intent: "qa_kakinada_trains", route: "/transport?dest=kakinada&mode=trains", emoji: "🚆", category: "transport",
      label: { te: "కాకినాడ రైళ్ళు", hi: "काकीनाडा ट्रेनें", en: "Trains to Kakinada" },
      confirmation: { te: "కాకినాడ రైళ్ళు చూపిస్తున్నాను", hi: "काकीनाडा ट्रेनें दिखा रहे हैं", en: "Showing trains to Kakinada" },
      dataResponse: {
        te: "కాకినాడ రైళ్ళు: ప్యాసింజర్ 5 7 3 7 9 ఉదయం 7:30 ప్లాట్‌ఫాం 3 గంటన్నర. పుష్కరం స్పెషల్ 0 7 1 1 7 మధ్యాహ్నం 12:00 ప్లాట్‌ఫాం 5 గంట పావు.",
        hi: "काकीनाडा ट्रेनें: पैसेंजर 5 7 3 7 9 सुबह 7:30 प्लेटफॉर्म 3 डेढ़ घंटे। पुष्करम स्पेशल 0 7 1 1 7 दोपहर 12:00 प्लेटफॉर्म 5 सवा घंटा।",
        en: "Trains to Kakinada: Passenger 5 7 3 7 9 departs 7:30 AM Platform 3, 1 and half hours. Pushkaram Special 0 7 1 1 7 departs 12 PM Platform 5, 1 hour 15 minutes.",
      },
    },
  },
  {
    keywords: {
      te: ["కాకినాడ ఎలా వెళ్ళాలి"],
      hi: ["काकीनाडा कैसे जाएं"],
      en: ["go to kakinada", "how to go kakinada", "kakinada transport"],
    },
    result: {
      intent: "qa_kakinada_schedule", route: "/transport?dest=kakinada", emoji: "🚆", category: "transport",
      label: { te: "కాకినాడ రైళ్ళు & బస్సులు", hi: "काकीनाडा ट्रेन और बस", en: "Kakinada Trains & Buses" },
      confirmation: { te: "కాకినాడ రైళ్ళు & బస్సులు చూపిస్తున్నాను", hi: "काकीनाडा ट्रेन और बस दिखा रहे हैं", en: "Showing trains and buses to Kakinada" },
      dataResponse: {
        te: "కాకినాడకు రైళ్ళు: ప్యాసింజర్ 5 7 3 7 9 ఉదయం 7:30. పుష్కరం స్పెషల్ 0 7 1 1 7 మధ్యాహ్నం 12:00. బస్సులు: APSRTC డీలక్స్ ఉదయం 8:00 120 రూపాయలు. సిటీ బస్ ప్రతి 15 నిమిషాలు 80 రూపాయలు.",
        hi: "काकीनाडा ट्रेनें: पैसेंजर 5 7 3 7 9 सुबह 7:30। पुष्करम स्पेशल 0 7 1 1 7 दोपहर 12:00। बसें: APSRTC डीलक्स सुबह 8:00 120 रुपये। सिटी बस हर 15 मिनट 80 रुपये।",
        en: "Trains to Kakinada: Passenger 5 7 3 7 9 at 7:30 AM. Pushkaram Special 0 7 1 1 7 at 12 PM. Buses: APSRTC Deluxe at 8 AM, 120 rupees. City Bus every 15 minutes, 80 rupees.",
      },
    },
  },
  // --- TIRUPATI ---
  {
    keywords: {
      te: ["తిరుపతి బస్", "తిరుపతి బస్సు", "తిరుపతి బస్సులు"],
      hi: ["तिरुपति बस", "तिरुपति बसें"],
      en: ["bus to tirupati", "buses to tirupati", "tirupati bus", "tirupati buses"],
    },
    result: {
      intent: "qa_tirupati_buses", route: "/transport?dest=tirupati&mode=buses", emoji: "🚌", category: "transport",
      label: { te: "తిరుపతి బస్సులు", hi: "तिरुपति बसें", en: "Buses to Tirupati" },
      confirmation: { te: "తిరుపతి బస్సులు చూపిస్తున్నాను", hi: "तिरुपति बसें दिखा रहे हैं", en: "Showing buses to Tirupati" },
      dataResponse: {
        te: "తిరుపతి బస్సులు: APSRTC ఎక్స్‌ప్రెస్ సాయంత్రం 5:00 పదిహేను గంటలు 700 రూపాయలు. APSRTC గరుడ AC రాత్రి 8:30 పదమూడు గంటలు 1100 రూపాయలు.",
        hi: "तिरुपति बसें: APSRTC एक्सप्रेस शाम 5:00 पंद्रह घंटे 700 रुपये। APSRTC गरुड़ AC रात 8:30 तेरह घंटे 1100 रुपये।",
        en: "Buses to Tirupati: APSRTC Express at 5 PM, 15 hours, 700 rupees. APSRTC Garuda AC at 8:30 PM, 13 hours, 1100 rupees.",
      },
    },
  },
  {
    keywords: {
      te: ["తిరుపతి రైలు", "తిరుపతి ట్రైన్", "తిరుపతి రైళ్ళు"],
      hi: ["तिरुपति ट्रेन", "तिरुपति रेल", "तिरुपति ट्रेनें"],
      en: ["train to tirupati", "trains to tirupati", "tirupati train", "tirupati trains"],
    },
    result: {
      intent: "qa_tirupati_trains", route: "/transport?dest=tirupati&mode=trains", emoji: "🚆", category: "transport",
      label: { te: "తిరుపతి రైళ్ళు", hi: "तिरुपति ट्रेनें", en: "Trains to Tirupati" },
      confirmation: { te: "తిరుపతి రైళ్ళు చూపిస్తున్నాను", hi: "तिरुपति ट्रेनें दिखा रहे हैं", en: "Showing trains to Tirupati" },
      dataResponse: {
        te: "తిరుపతి రైళ్ళు: తిరుపతి ఎక్స్‌ప్రెస్ 1 7 4 8 1 రాత్రి 8:00 ప్లాట్‌ఫాం 2 పద్నాలుగు గంటలు. పుష్కరం స్పెషల్ 0 7 1 1 9 ఉదయం 9:00 ప్లాట్‌ఫాం 4 పదమూడు గంటలు.",
        hi: "तिरुपति ट्रेनें: तिरुपति एक्सप्रेस 1 7 4 8 1 रात 8:00 प्लेटफॉर्म 2 चौदह घंटे। पुष्करम स्पेशल 0 7 1 1 9 सुबह 9:00 प्लेटफॉर्म 4 तेरह घंटे।",
        en: "Trains to Tirupati: Tirupati Express 1 7 4 8 1 departs 8 PM Platform 2, 14 hours. Pushkaram Special 0 7 1 1 9 departs 9 AM Platform 4, 13 hours.",
      },
    },
  },
  {
    keywords: {
      te: ["తిరుపతి ఎలా వెళ్ళాలి"],
      hi: ["तिरुपति कैसे जाएं"],
      en: ["go to tirupati", "how to go tirupati", "tirupati transport"],
    },
    result: {
      intent: "qa_tirupati_schedule", route: "/transport?dest=tirupati", emoji: "🚆", category: "transport",
      label: { te: "తిరుపతి రైళ్ళు & బస్సులు", hi: "तिरुपति ट्रेन और बस", en: "Tirupati Trains & Buses" },
      confirmation: { te: "తిరుపతి రైళ్ళు & బస్సులు చూపిస్తున్నాను", hi: "तिरुपति ट्रेन और बस दिखा रहे हैं", en: "Showing trains and buses to Tirupati" },
      dataResponse: {
        te: "తిరుపతికి రైళ్ళు: తిరుపతి ఎక్స్‌ప్రెస్ 1 7 4 8 1 రాత్రి 8:00. పుష్కరం స్పెషల్ 0 7 1 1 9 ఉదయం 9:00. బస్సులు: APSRTC ఎక్స్‌ప్రెస్ సాయంత్రం 5:00 700 రూపాయలు. APSRTC గరుడ AC రాత్రి 8:30 1100 రూపాయలు.",
        hi: "तिरुपति ट्रेनें: तिरुपति एक्सप्रेस 1 7 4 8 1 रात 8:00। पुष्करम स्पेशल 0 7 1 1 9 सुबह 9:00। बसें: APSRTC एक्सप्रेस शाम 5:00 700 रुपये। APSRTC गरुड़ AC रात 8:30 1100 रुपये।",
        en: "Trains to Tirupati: Tirupati Express 1 7 4 8 1 at 8 PM. Pushkaram Special 0 7 1 1 9 at 9 AM. Buses: APSRTC Express at 5 PM, 700 rupees. APSRTC Garuda AC at 8:30 PM, 1100 rupees.",
      },
    },
  },
  // ── E. About Emergency & Safety ──
  {
    keywords: {
      te: ["ఎమర్జెన్సీ నంబర్", "హెల్ప్‌లైన్", "ముఖ్యమైన నంబర్లు"],
      hi: ["इमरजेंसी नंबर", "हेल्पलाइन", "महत्वपूर्ण नंबर"],
      en: ["emergency number", "helpline number", "important numbers", "emergency contacts", "what is helpline"],
    },
    result: {
      intent: "qa_emergency_numbers", route: null, emoji: "📞", category: "qa",
      label: { te: "ఎమర్జెన్సీ నంబర్లు", hi: "इमरजेंसी नंबर", en: "Emergency Numbers" },
      confirmation: { te: "ఎమర్జెన్సీ నంబర్లు", hi: "इमरजेंसी नंबर", en: "Emergency Numbers" },
      dataResponse: {
        te: "పోలీస్ 100. అంబులెన్స్ 108. ఫైర్ 101. పుష్కరాల హెల్ప్‌లైన్ 1800-425-0027 టోల్ ఫ్రీ.",
        hi: "पुलिस 100। एम्बुलेंस 108। फायर 101। पुष्कराल हेल्पलाइन 1800-425-0027 टोल फ्री।",
        en: "Police 100. Ambulance 108. Fire 101. Pushkaralu Helpline 1800-425-0027 toll free.",
      },
    },
  },
  {
    keywords: {
      te: ["తప్పిపోయిన వ్యక్తి", "పిల్లలు తప్పిపోయారు", "మిస్సింగ్"],
      hi: ["खोया हुआ", "बच्चा खो गया", "लापता", "खोई हुई"],
      en: ["lost person center", "missing person", "lost child", "lost family", "someone lost"],
    },
    result: {
      intent: "qa_lost_person", route: null, emoji: "🔍", category: "qa",
      label: { te: "తప్పిపోయిన వ్యక్తి", hi: "लापता व्यक्ति", en: "Lost Person" },
      confirmation: { te: "తప్పిపోయిన వ్యక్తి సమాచారం", hi: "लापता व्यक्ति जानकारी", en: "Lost Person Info" },
      dataResponse: {
        te: "తప్పిపోయిన వ్యక్తుల కేంద్రం పుష్కర్ ఘాట్ దగ్గర ఉంది. 0883-2424000 కు ఫోన్ చేయండి. ఏ పోలీస్ హెల్ప్ డెస్క్ వద్ద అయినా రిపోర్ట్ చేయవచ్చు.",
        hi: "लापता व्यक्ति केंद्र पुष्कर घाट के पास है। 0883-2424000 पर कॉल करें। किसी भी पुलिस हेल्प डेस्क पर भी रिपोर्ट कर सकते हैं।",
        en: "Lost Person Center is near Pushkar Ghat. Call 0883-2424000. You can also report at any police help desk.",
      },
    },
  },
  {
    keywords: {
      te: ["మహిళా హెల్ప్‌లైన్", "స్త్రీలకు", "మహిళల రక్షణ"],
      hi: ["महिला हेल्पलाइन", "औरत", "महिला सुरक्षा"],
      en: ["women helpline", "women help", "mahila helpline", "child helpline"],
    },
    result: {
      intent: "qa_women_helpline", route: null, emoji: "👩", category: "qa",
      label: { te: "మహిళా హెల్ప్‌లైన్", hi: "महिला हेल्पलाइन", en: "Women Helpline" },
      confirmation: { te: "మహిళా హెల్ప్‌లైన్", hi: "महिला हेल्पलाइन", en: "Women Helpline" },
      dataResponse: {
        te: "మహిళా హెల్ప్‌లైన్ నంబర్ 181. బాలల హెల్ప్‌లైన్ 1098.",
        hi: "महिला हेल्पलाइन नंबर 181। बाल हेल्पलाइन 1098।",
        en: "Women Helpline number is 181. Child Helpline is 1098.",
      },
    },
  },
  {
    keywords: {
      te: ["జాగ్రత్తలు", "సేఫ్టీ టిప్స్", "ఏం జాగ్రత్త"],
      hi: ["सावधानी", "सुरक्षा टिप्स", "क्या ध्यान रखें"],
      en: ["precautions", "safety tips", "be careful", "what precaution", "safety advice"],
    },
    result: {
      intent: "qa_safety_tips", route: null, emoji: "⚠️", category: "qa",
      label: { te: "జాగ్రత్తలు", hi: "सावधानी", en: "Safety Tips" },
      confirmation: { te: "భద్రతా సూచనలు", hi: "सुरक्षा सुझाव", en: "Safety Tips" },
      dataResponse: {
        te: "పిల్లలను ఎప్పుడూ దగ్గరగా ఉంచండి. ఘాట్లకు విలువైన వస్తువులు తీసుకెళ్ళకండి. సౌకర్యవంతమైన చెప్పులు వేసుకోండి. నీరు తాగుతూ ఉండండి. వాలంటీర్ల సూచనలు పాటించండి. మీ ఘాట్ ఎంట్రీ పాయింట్ గుర్తు పెట్టుకోండి.",
        hi: "बच्चों को हमेशा पास रखें। घाटों पर कीमती सामान न ले जाएं। आरामदायक जूते पहनें। पानी पीते रहें। स्वयंसेवकों के निर्देशों का पालन करें। अपने घाट प्रवेश बिंदु को याद रखें।",
        en: "Keep children close to you at all times. Do not carry valuables to the ghats. Wear comfortable footwear. Stay hydrated and carry water. Follow volunteer instructions. Note your ghat entry point to find your way back.",
      },
    },
  },
  {
    keywords: {
      te: ["రాత్రి సేఫ్", "రాత్రి భద్రత", "రాత్రి వెళ్ళవచ్చా"],
      hi: ["रात को सुरक्षित", "रात में सेफ", "रात को जा सकते"],
      en: ["safe at night", "night time", "night safety", "is it safe at night"],
    },
    result: {
      intent: "qa_night_safety", route: null, emoji: "🌙", category: "qa",
      label: { te: "రాత్రి భద్రత", hi: "रात की सुरक्षा", en: "Night Safety" },
      confirmation: { te: "రాత్రి భద్రతా సమాచారం", hi: "रात की सुरक्षा जानकारी", en: "Night Safety Info" },
      dataResponse: {
        te: "అన్ని ఘాట్లు బాగా వెలుతురుతో 24 గంటలూ పోలీస్ సమక్షంలో ఉంటాయి. అయితే, కుటుంబాలు మరియు వృద్ధులు రాత్రి 10 లోపు ఘాట్లకు వెళ్ళడం మంచిది.",
        hi: "सभी घाट अच्छी रोशनी और 24 घंटे पुलिस की मौजूदगी में हैं। लेकिन परिवारों और बुजुर्गों को रात 10 बजे से पहले घाट जाने की सलाह है।",
        en: "All ghats are well-lit and have police presence 24 hours. However, it is recommended to visit ghats before 10 PM, especially for families with children and elderly.",
      },
    },
  },
  {
    keywords: {
      te: ["తొక్కిసలాట", "తొక్కిడి", "ఏం చేయాలి ఎమర్జెన్సీలో"],
      hi: ["भगदड़", "अगर भगदड़", "भीड़ में फंस"],
      en: ["stampede", "crowd crush", "overcrowd danger", "what to do emergency", "if stampede"],
    },
    result: {
      intent: "qa_stampede", route: null, emoji: "🚨", category: "qa",
      label: { te: "తొక్కిసలాట", hi: "भगदड़", en: "Stampede Safety" },
      confirmation: { te: "అత్యవసర సూచనలు", hi: "आपातकालीन सुझाव", en: "Emergency Tips" },
      dataResponse: {
        te: "ప్రశాంతంగా ఉండండి, తోయకండి. జనం వెళ్ళే వైపు కాకుండా పక్కలకు వెళ్ళండి. పోలీస్ మరియు వాలంటీర్ల సూచనలు పాటించండి. అసురక్షితంగా అనిపిస్తే ఈ యాప్‌లో SOS బటన్ నొక్కండి. ఎమర్జెన్సీ నంబర్ 100.",
        hi: "शांत रहें, धक्का न दें। भीड़ के विपरीत नहीं, बगल की ओर जाएं। पुलिस और स्वयंसेवकों के निर्देश मानें। असुरक्षित लगे तो इस ऐप में SOS बटन दबाएं। इमरजेंसी नंबर 100।",
        en: "Stay calm and do not push. Move to the sides, not against the crowd. Follow police and volunteer instructions. If you feel unsafe, press the SOS button in this app to alert authorities. Emergency number is 100.",
      },
    },
  },
  // ── F. Practical Pilgrim Tips ──
  {
    keywords: {
      te: ["ఏం తీసుకెళ్ళాలి", "ఏం తేవాలి", "ఏం కావాలి తెచ్చుకోవాలి"],
      hi: ["क्या ले जाएं", "क्या लेकर आएं", "क्या लाना चाहिए"],
      en: ["what to carry", "what to bring", "what to take", "items to bring", "what should i carry"],
    },
    result: {
      intent: "qa_what_to_carry", route: null, emoji: "🎒", category: "qa",
      label: { te: "ఏం తేవాలి", hi: "क्या ले जाएं", en: "What to Carry" },
      confirmation: { te: "తెచ్చుకోవలసినవి", hi: "क्या ले जाएं", en: "What to Carry" },
      dataResponse: {
        te: "టవల్, స్నానం తర్వాత మార్చుకునే బట్టలు, వాటర్ బాటిల్, బేసిక్ మందులు, ఈ యాప్ ఉన్న ఫోన్, కొంచెం క్యాష్ తీసుకెళ్ళండి. పూజ సామాగ్రి ఘాట్ దగ్గర కొనుగోలు చేయవచ్చు. విలువైన వస్తువులు తీసుకెళ్ళకండి.",
        hi: "तौलिया, स्नान के बाद बदलने के कपड़े, पानी की बोतल, बेसिक दवाइयां, इस ऐप वाला फोन, और कुछ कैश ले जाएं। पूजा सामग्री घाट के पास खरीद सकते हैं। कीमती सामान न ले जाएं।",
        en: "Carry a towel, extra clothes to change after bath, water bottle, basic medicines, phone with this app, and some cash. Pooja items can be bought near the ghats. Avoid carrying valuables.",
      },
    },
  },
  {
    keywords: {
      te: ["ఏం వేసుకోవాలి", "బట్టలు", "డ్రెస్ కోడ్"],
      hi: ["क्या पहनें", "कपड़े", "ड्रेस कोड"],
      en: ["what to wear", "dress code", "clothing", "what should i wear"],
    },
    result: {
      intent: "qa_what_to_wear", route: null, emoji: "👕", category: "qa",
      label: { te: "ఏం వేసుకోవాలి", hi: "क्या पहनें", en: "What to Wear" },
      confirmation: { te: "దుస్తుల సమాచారం", hi: "कपड़ों की जानकारी", en: "Clothing Info" },
      dataResponse: {
        te: "స్నానానికి అనువైన సౌకర్యవంతమైన బట్టలు వేసుకోండి. పవిత్ర స్నానానికి పంచె, చీర వంటి సాంప్రదాయ బట్టలు మంచివి. ఎండిన బట్టల సెట్ తీసుకెళ్ళండి. జారని చెప్పులు వేసుకోండి.",
        hi: "स्नान के लिए आरामदायक कपड़े पहनें। पवित्र स्नान के लिए धोती, साड़ी जैसे पारंपरिक कपड़े अच्छे हैं। सूखे कपड़ों का एक सेट साथ रखें। आरामदायक नॉन-स्लिप जूते पहनें।",
        en: "Wear comfortable clothes suitable for bathing. Traditional clothes like dhoti and saree are preferred for the holy bath. Carry an extra set of dry clothes. Wear comfortable non-slip footwear.",
      },
    },
  },
  {
    keywords: {
      te: ["మంచి సమయం", "ఎప్పుడు వెళ్ళాలి", "ఎప్పుడు మంచిది"],
      hi: ["अच्छा समय", "कब जाएं", "कब अच्छा"],
      en: ["best time", "when to visit", "when to go", "good time", "best time to visit"],
    },
    result: {
      intent: "qa_best_time", route: null, emoji: "⏰", category: "qa",
      label: { te: "మంచి సమయం", hi: "अच्छा समय", en: "Best Time" },
      confirmation: { te: "మంచి సమయం", hi: "अच्छा समय", en: "Best Time" },
      dataResponse: {
        te: "ఉదయం 4 నుండి 8 గంటల వరకు తక్కువ రద్దీ మరియు అత్యంత పవిత్రం. మధ్యాహ్నం 12 నుండి 3 వరకు కూడా తక్కువ రద్దీ. సాయంత్రం రద్దీ ఎక్కువగా ఉంటుంది కాబట్టి నివారించండి. పుష్కరాల మొదటి మరియు చివరి రోజు అత్యంత పవిత్రమైనవి.",
        hi: "सुबह 4 से 8 बजे कम भीड़ और सबसे पवित्र। दोपहर 12 से 3 बजे भी कम भीड़। शाम को भीड़ बढ़ती है इसलिए बचें। पुष्कराल का पहला और आखिरी दिन सबसे पवित्र।",
        en: "Early morning 4 AM to 8 AM has the least crowd and is most auspicious. Afternoon 12 to 3 PM also has less crowd. Avoid evenings as crowd peaks. First and last day of Pushkaralu are most sacred.",
      },
    },
  },
  {
    keywords: {
      te: ["ఫోన్ ఛార్జ్", "చార్జింగ్", "మొబైల్ ఛార్జ్"],
      hi: ["फोन चार्ज", "चार्जिंग पॉइंट", "मोबाइल चार्ज"],
      en: ["charge phone", "charging point", "phone battery", "mobile charging", "where to charge"],
    },
    result: {
      intent: "qa_phone_charging", route: null, emoji: "🔋", category: "qa",
      label: { te: "ఫోన్ ఛార్జింగ్", hi: "फोन चार्जिंग", en: "Phone Charging" },
      confirmation: { te: "ఛార్జింగ్ సమాచారం", hi: "चार्जिंग जानकारी", en: "Charging Info" },
      dataResponse: {
        te: "పుష్కర్ ఘాట్ మరియు కోటిలింగాల ఘాట్ దగ్గర వాలంటీర్ కేంద్రాల్లో మొబైల్ ఛార్జింగ్ పాయింట్లు ఉన్నాయి. రైల్వే స్టేషన్ వెయిటింగ్ హాల్‌లో కూడా ఛార్జింగ్ సౌకర్యం ఉంది.",
        hi: "पुष्कर घाट और कोटिलिंगाला घाट के पास स्वयंसेवक केंद्रों में मोबाइल चार्जिंग पॉइंट हैं। रेलवे स्टेशन वेटिंग हॉल में भी चार्जिंग की सुविधा है।",
        en: "Mobile charging points are available at the volunteer centers near Pushkar Ghat and Kotilingala Ghat. The Railway Station Waiting Hall also has charging facilities.",
      },
    },
  },
  // ── G. About the App ──
  {
    keywords: {
      te: ["ఏ భాషలు", "భాష మార్చు", "ఏ భాషల్లో"],
      hi: ["कौन सी भाषा", "भाषा बदलें", "किस भाषा में"],
      en: ["what languages", "which language", "language support", "change language"],
    },
    result: {
      intent: "qa_languages", route: null, emoji: "🌐", category: "qa",
      label: { te: "భాషలు", hi: "भाषाएं", en: "Languages" },
      confirmation: { te: "భాషల సమాచారం", hi: "भाषा जानकारी", en: "Language Info" },
      dataResponse: {
        te: "ఈ యాప్ తెలుగు, హిందీ, మరియు ఆంగ్లం మూడు భాషల్లో అందుబాటులో ఉంది.",
        hi: "यह ऐप तेलुगु, हिंदी, और अंग्रेजी तीन भाषाओं में उपलब्ध है।",
        en: "The app supports Telugu, Hindi, and English.",
      },
    },
  },
  {
    keywords: {
      te: ["ఎలా వాడాలి", "యాప్ ఎలా", "ఎలా ఉపయోగించాలి"],
      hi: ["कैसे इस्तेमाल", "ऐप कैसे", "कैसे उपयोग"],
      en: ["how to use", "app help", "how does this work", "how to use app"],
    },
    result: {
      intent: "qa_how_to_use", route: null, emoji: "📱", category: "qa",
      label: { te: "ఎలా వాడాలి", hi: "कैसे इस्तेमाल करें", en: "How to Use" },
      confirmation: { te: "యాప్ వాడకం", hi: "ऐप का उपयोग", en: "App Usage" },
      dataResponse: {
        te: "మైక్రోఫోన్ నొక్కి తెలుగు, హిందీ లేదా ఆంగ్లంలో మీ ప్రశ్న చెప్పండి. ఘాట్లు, భోజనం, టాయిలెట్లు, రవాణా, లేదా ఎమర్జెన్సీ గురించి అడగవచ్చు. స్క్రీన్‌పై ఐకాన్‌లను కూడా నొక్కవచ్చు.",
        hi: "माइक्रोफोन दबाएं और तेलुगु, हिंदी या अंग्रेजी में अपना सवाल बोलें। घाट, खाना, टॉयलेट, परिवहन, या इमरजेंसी के बारे में पूछ सकते हैं। स्क्रीन पर आइकन भी दबा सकते हैं।",
        en: "Tap the microphone and speak your question in Telugu, Hindi, or English. You can ask about ghats, food, toilets, transport, or emergencies. You can also tap the icons on the screen.",
      },
    },
  },
  {
    keywords: {
      te: ["ఏం చేయగలరు", "ఏం చేస్తుంది", "యాప్ ఏం చేస్తుంది"],
      hi: ["क्या कर सकते", "ऐप क्या करता", "क्या क्या कर सकते"],
      en: ["what can you do", "app features", "what does this do", "what can this app do"],
    },
    result: {
      intent: "qa_about_app", route: null, emoji: "ℹ️", category: "qa",
      label: { te: "యాప్ గురించి", hi: "ऐप के बारे में", en: "About App" },
      confirmation: { te: "యాప్ సమాచారం", hi: "ऐप जानकारी", en: "App Info" },
      dataResponse: {
        te: "నేను మీకు దగ్గరలోని ఘాట్లు కనుగొనడం, రద్దీ చూడటం, ఉచిత భోజనం మరియు నీరు కనుగొనడం, టాయిలెట్లు మరియు వైద్య శిబిరాలు గుర్తించడం, రవాణా సమాచారం, మ్యాప్ చూపించడం, మరియు అత్యవసర సేవలకు కనెక్ట్ చేయడంలో సహాయం చేయగలను. ఏదైనా అడగండి!",
        hi: "मैं आपको नजदीकी घाट खोजने, भीड़ देखने, मुफ्त भोजन और पानी खोजने, टॉयलेट और मेडिकल कैंप ढूंढने, परिवहन जानकारी, नक्शा दिखाने, और इमरजेंसी सेवाओं से जोड़ने में मदद कर सकता हूं। कुछ भी पूछें!",
        en: "I can help you find nearest ghats, check crowd levels, find free food and water, locate toilets and medical camps, get transport info, show the map, and connect you to emergency services. Just ask me anything!",
      },
    },
  },
  // ── Puja/Aarti Q&A ──
  {
    keywords: {
      te: ["ఆరతి ఎప్పుడు", "ఆరతి సమయం", "ఆరతి టైం"],
      hi: ["आरती कब", "आरती का समय", "आरती टाइम"],
      en: ["aarti time", "when is aarti", "aarti schedule", "what time aarti", "arti time"],
    },
    result: {
      intent: "qa_aarti_time", route: null, emoji: "🪔", category: "qa",
      label: { te: "ఆరతి సమయం", hi: "आरती समय", en: "Aarti Time" },
      confirmation: { te: "ఆరతి సమయాలు", hi: "आरती समय", en: "Aarti Schedule" },
      dataResponse: {
        te: "పుష్కర్ ఘాట్: గోదావరి ఆరతి ఉదయం 6 గంటలు. సంధ్యా ఆరతి సాయంత్రం 6:30. సరస్వతి ఘాట్: ఉదయపు ఆరతి 5:30. సాయంత్ర ఆరతి 6 గంటలు.",
        hi: "पुष्कर घाट: गोदावरी आरती सुबह 6 बजे। संध्या आरती शाम 6:30। सरस्वती घाट: सुबह की आरती 5:30। शाम की आरती 6 बजे।",
        en: "Pushkar Ghat: Godavari Aarti at 6 AM. Sandhya Aarti at 6:30 PM. Saraswati Ghat: Morning Aarti at 5:30 AM. Evening Aarti at 6 PM.",
      },
    },
  },
  {
    keywords: {
      te: ["సాయంత్ర పూజ", "సాయంత్రం పూజ", "సంధ్యా ఆరతి", "సాయంకాల పూజ"],
      hi: ["शाम की पूजा", "शाम पूजा", "संध्या आरती", "शाम की आरती"],
      en: ["evening puja", "evening aarti", "sandhya aarti", "evening prayer", "evening ritual"],
    },
    result: {
      intent: "qa_evening_puja", route: null, emoji: "🌅", category: "qa",
      label: { te: "సాయంత్ర పూజ", hi: "शाम की पूजा", en: "Evening Puja" },
      confirmation: { te: "సాయంత్ర పూజ సమయాలు", hi: "शाम की पूजा समय", en: "Evening Puja Schedule" },
      dataResponse: {
        te: "పుష్కర్ ఘాట్: సంధ్యా ఆరతి సాయంత్రం 6:30. దీపోత్సవం రాత్రి 7:30. సరస్వతి ఘాట్: సాయంత్ర ఆరతి 6 గంటలు. గౌతమి ఘాట్: సాయంత్ర దీపం రాత్రి 7 గంటలు.",
        hi: "पुष्कर घाट: संध्या आरती शाम 6:30। दीपोत्सव रात 7:30। सरस्वती घाट: शाम की आरती 6 बजे। गौतमी घाट: शाम का दीप रात 7 बजे।",
        en: "Pushkar Ghat: Sandhya Aarti at 6:30 PM. Deepotsavam at 7:30 PM. Saraswati Ghat: Evening Aarti at 6 PM. Gowthami Ghat: Evening Deepam at 7 PM.",
      },
    },
  },
  // ── Safety Q&A ──
  {
    keywords: {
      te: ["నది సేఫ్ ఆ", "స్నానం సేఫ్ ఆ", "నీళ్ళలో దిగవచ్చా", "నదిలో స్నానం"],
      hi: ["नदी सुरक्षित", "नहाना सुरक्षित", "पानी में उतरना", "नदी में नहाना"],
      en: ["is river safe", "safe to bathe", "is it safe to swim", "river safe", "can i bathe", "safe to go in water"],
    },
    result: {
      intent: "qa_river_safe", route: null, emoji: "🌊", category: "qa",
      label: { te: "నది భద్రత", hi: "नदी सुरक्षा", en: "River Safety" },
      confirmation: { te: "నది భద్రత సమాచారం", hi: "नदी सुरक्षा जानकारी", en: "River Safety Info" },
      dataResponse: {
        te: "నిర్ణీత స్నాన ప్రాంతాల్లోనే స్నానం చేయండి. ఎర్ర జెండాలు ఉన్నప్పుడు నీటిలోకి వెళ్ళకండి. పిల్లలను మరియు వృద్ధులను గట్టిగా పట్టుకోండి. అందుబాటులో ఉన్న తాళ్ళను ఉపయోగించండి.",
        hi: "निर्धारित स्नान क्षेत्रों में ही नहाएं। लाल झंडे लगे होने पर पानी में न जाएं। बच्चों और बुज़ुर्गों को मज़बूती से पकड़ें। उपलब्ध रस्सियों का उपयोग करें।",
        en: "Bathe only in designated areas. Don't enter water when red flags are raised. Hold children and elderly firmly. Use ropes where provided.",
      },
    },
  },
  {
    keywords: {
      te: ["ఏం తీసుకెళ్ళాలి", "ఏం కావాలి", "ఏం తెచ్చుకోవాలి"],
      hi: ["क्या लेकर जाएं", "क्या ले जाना", "क्या लाएं", "क्या चाहिए"],
      en: ["what to carry", "what to bring", "what should i carry", "what do i need", "packing list", "what to take"],
    },
    result: {
      intent: "qa_what_to_carry", route: null, emoji: "🎒", category: "qa",
      label: { te: "ఏం తీసుకెళ్ళాలి", hi: "क्या लेकर जाएं", en: "What to Carry" },
      confirmation: { te: "తీసుకెళ్ళాల్సిన వస్తువులు", hi: "ले जाने की चीज़ें", en: "Things to Carry" },
      dataResponse: {
        te: "ORS ప్యాకెట్లు, వాటర్‌ప్రూఫ్ ఫోన్ పౌచ్, నాన్-స్లిప్ చెప్పులు తీసుకెళ్ళండి. ఖరీదైన వస్తువులు లేదా ఎక్కువ నగదు తీసుకెళ్ళకండి. ఆభరణాలు ఇంట్లో ఉంచండి.",
        hi: "ORS पैकेट, वॉटरप्रूफ फ़ोन पाउच, नॉन-स्लिप जूते लेकर जाएं। महंगी चीज़ें या अधिक नकदी न ले जाएं। गहने घर पर रखें।",
        en: "Carry ORS packets, waterproof phone pouch, and non-slip footwear. Don't carry expensive items or large cash. Leave jewelry at home.",
      },
    },
  },
];

// Natural language filler words to ignore
const fillerWords = new Set([
  // English
  "where", "can", "i", "me", "the", "a", "an", "is", "are", "to", "do", "does",
  "show", "find", "get", "need", "want", "looking", "for", "please", "tell",
  "take", "nearest", "closest", "nearby", "around", "here", "there",
  "what", "which", "how", "could", "would", "should",
  // Hindi
  "कहां", "मुझे", "मैं", "क्या", "कौन", "कैसे", "दिखाओ", "बताओ", "चाहिए",
  // Telugu — common sentence words that aren't intent-specific
  "ఎక్కడ", "నాకు", "నేను", "చూపించు", "కావాలి", "దగ్గర", "సమీపంలో",
  "ఉన్నాయి", "ఉంది", "ఉన్నారు", "ఏది", "ఏమి", "చెప్పు", "చెప్పండి",
  "కనిపించు", "దొరుకుతుంది", "దొరుకుతాయి", "ఎలా", "వెళ్ళాలి",
  "పోవాలి", "రావాలి", "కనుక్కో", "ఎక్కడికి",
  "అక్కడ", "ఇక్కడ", "ఏంటి", "ఎంత", "ఉంటుంది", "ఉంటాయి",
  "చూపండి", "చెప్పగలరా", "దయచేసి", "ప్లీజ్", "లో", "కి", "లోకి",
  "అన్ని", "ఏవి", "ఎవరు", "ఏమిటి", "ఎందుకు", "అవసరం",
  // Hindi — additional common fillers
  "कृपया", "है", "हैं", "कहाँ", "यहां", "वहां", "पास", "में",
  "का", "की", "के", "को", "से", "पर", "और", "या",
]);

/**
 * Simple similarity check: how many characters match between two strings.
 * Returns a score from 0 to 1. Used for fuzzy matching when exact match fails.
 */
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1;
  // Check if shorter is contained in longer
  if (longer.includes(shorter)) return shorter.length / longer.length;
  // Check character overlap
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  return matches / longer.length;
}

/**
 * Match against Q&A intents using exact substring matching.
 * Q&A keywords are multi-word phrases, so exact substring is sufficient.
 */
function matchQAIntent(text: string): VoiceIntent | null {
  const allLangs: Lang[] = ["te", "hi", "en"];
  for (const entry of qaIntents) {
    for (const kl of allLangs) {
      for (const keyword of entry.keywords[kl]) {
        if (text.includes(keyword.toLowerCase())) {
          return entry.result;
        }
      }
    }
  }
  return null;
}

export function parseIntent(transcript: string, lang: Lang): VoiceIntent | null {
  const text = transcript.toLowerCase().trim();
  if (!text) return null;

  // === Q&A intents first (multi-word phrases, more specific) ===
  const qaMatch = matchQAIntent(text);
  if (qaMatch) return qaMatch;

  // Split into words
  const words = text.split(/\s+/);

  // Collect ALL keywords across all 3 languages for each intent.
  // This allows Telugu speech to work even in English mode, etc.
  const allLangs: Lang[] = ["te", "hi", "en"];

  // First pass: exact substring match — check if any keyword appears in the transcript
  for (const entry of intents) {
    for (const kl of allLangs) {
      for (const keyword of entry.keywords[kl]) {
        if (text.includes(keyword.toLowerCase())) {
          return entry.result;
        }
      }
    }
  }

  // Second pass: partial word match (handles plurals, conjugations, extra suffixes)
  const meaningfulWords = words.filter((w) => !fillerWords.has(w) && w.length > 1);
  if (meaningfulWords.length > 0) {
    for (const entry of intents) {
      const allKeywords = allLangs.flatMap((kl) => entry.keywords[kl]);

      for (const word of meaningfulWords) {
        for (const keyword of allKeywords) {
          const kw = keyword.toLowerCase();
          // Partial match: word starts with keyword or keyword starts with word
          if (word.startsWith(kw) || kw.startsWith(word)) {
            return entry.result;
          }
          // Contains match: keyword of 4+ chars found within a longer word
          if (kw.length >= 4 && word.includes(kw)) {
            return entry.result;
          }
          if (word.length >= 4 && kw.includes(word)) {
            return entry.result;
          }
        }
      }
    }
  }

  // Third pass: fuzzy match — speech recognition often garbles words slightly
  // Score each intent and pick the best match above threshold
  let bestScore = 0;
  let bestIntent: VoiceIntent | null = null;

  for (const entry of intents) {
    const allKeywords = allLangs.flatMap((kl) => entry.keywords[kl]);
    let intentScore = 0;

    for (const word of meaningfulWords) {
      for (const keyword of allKeywords) {
        const kw = keyword.toLowerCase();
        // Only fuzzy match words that are reasonably long
        if (word.length >= 3 && kw.length >= 3) {
          const sim = similarity(word, kw);
          if (sim > 0.7) {
            intentScore = Math.max(intentScore, sim);
          }
        }
      }
    }

    if (intentScore > bestScore) {
      bestScore = intentScore;
      bestIntent = entry.result;
    }
  }

  if (bestIntent && bestScore > 0.7) {
    return bestIntent;
  }

  return null;
}

// Detect iOS (Safari on iOS has webkitSpeechRecognition but it doesn't work)
function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

// Check if Web Speech API is actually supported and working
export function isSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari has webkitSpeechRecognition but it doesn't work reliably
  if (isIOS()) return false;
  return !!(
    (window as unknown as Record<string, unknown>).SpeechRecognition ||
    (window as unknown as Record<string, unknown>).webkitSpeechRecognition
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Get SpeechRecognition constructor (Web Speech API)
function getSpeechRecognition(): any {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

export interface VoiceSession {
  stop: () => void;
}

export function startListening(
  lang: Lang,
  onTranscript: (text: string, isFinal: boolean) => void,
  onEnd: () => void,
  onError: (error: string) => void
): VoiceSession | null {
  if (!isSpeechSupported()) {
    onError("not_supported");
    return null;
  }

  const SpeechRecognitionCtor = getSpeechRecognition();
  const recognition = new SpeechRecognitionCtor();

  recognition.lang = recognitionLangCodes[lang];
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    let transcript = "";
    let isFinal = false;

    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        isFinal = true;
      }
    }

    onTranscript(transcript, isFinal);
  };

  recognition.onend = () => {
    onEnd();
  };

  recognition.onerror = (event: any) => {
    if (event.error === "no-speech") {
      onError("no_speech");
    } else if (event.error === "not-allowed") {
      onError("not_allowed");
    } else {
      onError(event.error);
    }
  };

  recognition.start();

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {
        // Already stopped
      }
    },
  };
}

/* eslint-enable @typescript-eslint/no-explicit-any */

// Current audio element for cloud TTS playback
let currentAudio: HTMLAudioElement | null = null;

/**
 * Speak text aloud using Google Cloud TTS (high-quality neural voices).
 * Falls back to browser TTS if the API call fails.
 * Pass `fallbackText` for English fallback when the language voice isn't available.
 */
export function speak(
  text: string,
  lang: Lang,
  fallbackText?: string
): Promise<void> {
  return new Promise(async (resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Try cloud TTS first (much better quality)
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audio) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
          currentAudio = audio;
          audio.onended = () => { currentAudio = null; resolve(); };
          audio.onerror = () => { currentAudio = null; resolve(); };
          audio.play().catch(() => {
            // Autoplay blocked — fall back to browser TTS
            currentAudio = null;
            speakWithBrowser(text, lang, fallbackText).then(resolve);
          });
          return;
        }
      }
    } catch {
      // Cloud TTS failed, fall back to browser TTS
    }

    // Fallback: browser TTS
    speakWithBrowser(text, lang, fallbackText).then(resolve);
  });
}

/**
 * Browser-based TTS fallback (lower quality but works offline)
 */
function speakWithBrowser(
  text: string,
  lang: Lang,
  fallbackText?: string
): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }

    const langCode = ttsLangCodes[lang];
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(langCode.split("-")[0]));

    const useEnglish = !matchingVoice && lang !== "en" && fallbackText;
    const finalText = useEnglish ? fallbackText : text;
    const finalLang = useEnglish ? "en-IN" : langCode;

    const utterance = new SpeechSynthesisUtterance(finalText);
    utterance.lang = finalLang;
    if (matchingVoice && !useEnglish) utterance.voice = matchingVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.cancel();
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  });
}

/**
 * Format distance for speech — uses full words instead of abbreviations.
 * e.g. 1.2km → "1.2 కిలోమీటర్లు" (Telugu), "1.2 kilometers" (English)
 */
function spokenDistance(km: number, lang: Lang): string {
  const units: Record<Lang, { m: string; km: string }> = {
    te: { m: "మీటర్లు", km: "కిలోమీటర్లు" },
    hi: { m: "मीटर", km: "किलोमीटर" },
    en: { m: "meters", km: "kilometers" },
  };

  const u = units[lang];
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} ${u.m}`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} ${u.km}`;
  }
  return `${Math.round(km)} ${u.km}`;
}

/**
 * Generate a dynamic voice response using live ghat data and GPS location.
 * Falls back to the static dataResponse if no live data is available.
 */
export function buildDynamicResponse(
  intent: VoiceIntent,
  ghats: { name: { te: string; hi: string; en: string }; crowd: "low" | "medium" | "high"; realDist: number; realDistLabel: string }[],
  facilities: { id: string; category: string; name: { te: string; hi: string; en: string }; realDist: number; realDistLabel: string }[],
  lang: Lang
): { text: string; fallback: string } {
  const l = lang;

  const crowdWord: Record<Lang, Record<string, string>> = {
    te: { low: "తక్కువ రద్దీ", medium: "మధ్యస్థ రద్దీ", high: "ఎక్కువ రద్దీ" },
    hi: { low: "कम भीड़", medium: "मध्यम भीड़", high: "अधिक भीड़" },
    en: { low: "low crowd", medium: "moderate crowd", high: "high crowd" },
  };

  if (intent.intent === "ghats" || intent.intent === "crowd") {
    if (ghats.length > 0) {
      const sorted = [...ghats].sort((a, b) => a.realDist - b.realDist);
      const top = sorted.slice(0, 2);
      const text = top.map((g) => `${g.name[l]}, ${spokenDistance(g.realDist, l)}, ${crowdWord[l][g.crowd]}`).join(". ") + ".";
      const fallback = top.map((g) => `${g.name["en"]}, ${spokenDistance(g.realDist, "en")}, ${crowdWord["en"][g.crowd]}`).join(". ") + ".";
      return { text, fallback };
    }
  }

  if (["food", "toilet", "water", "medical", "volunteer"].includes(intent.intent)) {
    const catMap: Record<string, string> = { food: "food", toilet: "toilet", water: "water", medical: "medical", volunteer: "volunteer" };
    const cat = catMap[intent.intent];
    const matching = facilities.filter((f) => f.category === cat).sort((a, b) => a.realDist - b.realDist);
    if (matching.length > 0) {
      const text = matching.slice(0, 2).map((f) => `${f.name[l]}, ${spokenDistance(f.realDist, l)}`).join(". ") + ".";
      const fallback = matching.slice(0, 2).map((f) => `${f.name["en"]}, ${spokenDistance(f.realDist, "en")}`).join(". ") + ".";
      return { text, fallback };
    }
  }

  // Fallback to static response
  return { text: intent.dataResponse[l], fallback: intent.dataResponse["en"] };
}

export const voiceTranslations = {
  te: {
    listening: "వింటున్నాను...",
    tapToSpeak: "మాట్లాడటానికి నొక్కండి",
    processing: "అర్థం చేసుకుంటున్నాను...",
    navigating: "వెళ్తున్నాను...",
    notUnderstood: "అర్థం కాలేదు, మళ్ళీ ప్రయత్నించండి",
    notSupported: "వాయిస్ ఈ బ్రౌజర్‌లో అందుబాటులో లేదు",
    micBlocked: "దయచేసి మైక్రోఫోన్ అనుమతి ఇవ్వండి",
    cancel: "రద్దు",
    tryAgain: "మళ్ళీ ప్రయత్నించండి",
    noSpeech: "ఏమీ వినబడలేదు, మళ్ళీ చెప్పండి",
  },
  hi: {
    listening: "सुन रहे हैं...",
    tapToSpeak: "बोलने के लिए दबाएं",
    processing: "समझ रहे हैं...",
    navigating: "जा रहे हैं...",
    notUnderstood: "समझ नहीं आया, फिर से कोशिश करें",
    notSupported: "वॉइस इस ब्राउज़र में उपलब्ध नहीं है",
    micBlocked: "कृपया माइक्रोफ़ोन की अनुमति दें",
    cancel: "रद्द करें",
    tryAgain: "फिर से कोशिश करें",
    noSpeech: "कुछ सुनाई नहीं दिया, फिर से बोलें",
  },
  en: {
    listening: "Listening...",
    tapToSpeak: "Tap to speak",
    processing: "Processing...",
    navigating: "Navigating...",
    notUnderstood: "Didn't understand, please try again",
    notSupported: "Voice is not available in this browser",
    micBlocked: "Please allow microphone access",
    cancel: "Cancel",
    tryAgain: "Try again",
    noSpeech: "Didn't hear anything, please try again",
  },
};
