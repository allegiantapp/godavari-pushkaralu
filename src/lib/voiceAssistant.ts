type Lang = "te" | "hi" | "en";

export interface VoiceIntent {
  intent: string;
  route: string;
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
  // === TRANSPORT ===
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

export function parseIntent(transcript: string, lang: Lang): VoiceIntent | null {
  const text = transcript.toLowerCase().trim();
  if (!text) return null;

  // Split into words
  const words = text.split(/\s+/);

  // Collect ALL keywords across all 3 languages for each intent.
  // This allows Telugu speech to work even in English mode, etc.
  const allLangs: Lang[] = ["te", "hi", "en"];

  // First pass: check if any keyword appears in the transcript
  for (const entry of intents) {
    for (const kl of allLangs) {
      for (const keyword of entry.keywords[kl]) {
        if (text.includes(keyword.toLowerCase())) {
          return entry.result;
        }
      }
    }
  }

  // Second pass: extract meaningful words (remove fillers) and try matching
  const meaningfulWords = words.filter((w) => !fillerWords.has(w) && w.length > 1);
  if (meaningfulWords.length > 0) {
    for (const entry of intents) {
      const allKeywords = allLangs.flatMap((kl) => entry.keywords[kl]);

      for (const word of meaningfulWords) {
        for (const keyword of allKeywords) {
          // Partial match: word starts with keyword or keyword starts with word (for plural/conjugation)
          if (
            word.startsWith(keyword.toLowerCase()) ||
            keyword.toLowerCase().startsWith(word)
          ) {
            return entry.result;
          }
        }
      }
    }
  }

  return null;
}

// Check if Web Speech API is supported
export function isSpeechSupported(): boolean {
  if (typeof window === "undefined") return false;
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

/**
 * Ensure voices are loaded. On mobile browsers, getVoices() returns empty
 * until the voiceschanged event fires. This waits for voices to be available.
 */
let voicesReady = false;
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

function ensureVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve([]);
  }

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    voicesReady = true;
    return Promise.resolve(voices);
  }

  if (voicesReady) return Promise.resolve(voices);

  if (!voicesPromise) {
    voicesPromise = new Promise((resolve) => {
      const onVoicesChanged = () => {
        voicesReady = true;
        voicesPromise = null;
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
        resolve(window.speechSynthesis.getVoices());
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
      // Timeout fallback — some browsers never fire voiceschanged
      setTimeout(() => {
        voicesReady = true;
        voicesPromise = null;
        resolve(window.speechSynthesis.getVoices());
      }, 1000);
    });
  }

  return voicesPromise;
}

// Pre-load voices as early as possible
if (typeof window !== "undefined" && window.speechSynthesis) {
  ensureVoices();
}

/**
 * Speak text aloud. If the requested language voice isn't available
 * (e.g. no Telugu voice on Windows), falls back to English.
 * Pass `fallbackText` for the English fallback version.
 */
export function speak(
  text: string,
  lang: Lang,
  fallbackText?: string
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const langCode = ttsLangCodes[lang];

    const doSpeak = (voices: SpeechSynthesisVoice[]) => {
      // Find a voice that matches the requested language
      const matchingVoice = voices.find((v) => v.lang.startsWith(langCode.split("-")[0]));

      // If no matching voice found and we have a fallback, use English
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

      // Mobile Chrome workaround: speechSynthesis can get stuck.
      // Resume it before speaking.
      window.speechSynthesis.cancel();
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
        // Android Chrome bug: speech can pause after ~15s. Keep it alive.
        const keepAlive = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(keepAlive);
          } else {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 5000);
        utterance.onend = () => { clearInterval(keepAlive); resolve(); };
        utterance.onerror = () => { clearInterval(keepAlive); resolve(); };
      }, 50);
    };

    ensureVoices().then(doSpeak);
  });
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

  // Helper: build a response listing top items
  const listItems = (
    items: { name: { te: string; hi: string; en: string }; realDistLabel: string; extra?: string }[],
    limit = 2
  ) => {
    return items.slice(0, limit).map((it) => `${it.name[l]} ${it.realDistLabel}${it.extra ? ` ${it.extra}` : ""}`).join(". ");
  };

  if (intent.intent === "ghats" || intent.intent === "crowd") {
    if (ghats.length > 0) {
      const sorted = [...ghats].sort((a, b) => a.realDist - b.realDist);
      const top = sorted.slice(0, 2);
      const text = top.map((g) => `${g.name[l]} ${g.realDistLabel} ${crowdWord[l][g.crowd]}`).join(". ") + ".";
      const fallback = top.map((g) => `${g.name["en"]} ${g.realDistLabel} ${crowdWord["en"][g.crowd]}`).join(". ") + ".";
      return { text, fallback };
    }
  }

  if (["food", "toilet", "water", "medical", "volunteer"].includes(intent.intent)) {
    const catMap: Record<string, string> = { food: "food", toilet: "toilet", water: "water", medical: "medical", volunteer: "volunteer" };
    const cat = catMap[intent.intent];
    const matching = facilities.filter((f) => f.category === cat).sort((a, b) => a.realDist - b.realDist);
    if (matching.length > 0) {
      const text = listItems(matching) + ".";
      const fallback = matching.slice(0, 2).map((f) => `${f.name["en"]} ${f.realDistLabel}`).join(". ") + ".";
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
