type Lang = "te" | "hi" | "en";

export interface VoiceIntent {
  intent: string;
  route: string;
  emoji: string;
  label: { te: string; hi: string; en: string };
  confirmation: { te: string; hi: string; en: string };
}

const langCodes: Record<Lang, string> = {
  te: "te-IN",
  hi: "hi-IN",
  en: "en-IN",
};

const intents: {
  keywords: { te: string[]; hi: string[]; en: string[] };
  result: VoiceIntent;
}[] = [
  {
    keywords: {
      te: ["ఘాట్", "ఘాట్లు", "స్నానం", "స్నాన", "నది"],
      hi: ["घाट", "स्नान", "नदी"],
      en: ["ghat", "ghats", "bath", "bathing", "river"],
    },
    result: {
      intent: "ghats",
      route: "/ghats",
      emoji: "🛕",
      label: { te: "ఘాట్లు", hi: "घाट", en: "Ghats" },
      confirmation: {
        te: "ఘాట్లు చూపిస్తున్నాను",
        hi: "घाट दिखा रहे हैं",
        en: "Showing ghats",
      },
    },
  },
  {
    keywords: {
      te: ["రద్దీ", "జనం", "ఎంతమంది", "తక్కువ రద్దీ"],
      hi: ["भीड़", "कितनी", "कितने लोग", "कम भीड़"],
      en: ["crowd", "crowded", "busy", "safe", "rush", "how many people"],
    },
    result: {
      intent: "crowd",
      route: "/ghats/status",
      emoji: "👥",
      label: { te: "రద్దీ స్థితి", hi: "भीड़ स्थिति", en: "Crowd Status" },
      confirmation: {
        te: "రద్దీ స్థితి చూపిస్తున్నాను",
        hi: "भीड़ स्थिति दिखा रहे हैं",
        en: "Showing crowd status",
      },
    },
  },
  {
    keywords: {
      te: ["ఆహారం", "భోజనం", "తిండి", "అన్నం", "తినడం", "ఫుడ్"],
      hi: ["खाना", "भोजन", "खाने", "फूड"],
      en: ["food", "eat", "meal", "restaurant", "lunch", "dinner", "hungry"],
    },
    result: {
      intent: "food",
      route: "/facilities?type=food",
      emoji: "🍲",
      label: { te: "ఆహారం", hi: "भोजन", en: "Food" },
      confirmation: {
        te: "సమీపంలోని ఆహార కేంద్రాలు చూపిస్తున్నాను",
        hi: "पास के भोजन केंद्र दिखा रहे हैं",
        en: "Showing nearby food centers",
      },
    },
  },
  {
    keywords: {
      te: ["టాయిలెట్", "మరుగుదొడ్డి", "బాత్రూమ్", "శౌచాలయం"],
      hi: ["शौचालय", "टॉयलेट", "बाथरूम", "लैट्रिन"],
      en: ["toilet", "bathroom", "restroom", "washroom", "loo"],
    },
    result: {
      intent: "toilet",
      route: "/facilities?type=toilet",
      emoji: "🚻",
      label: { te: "మరుగుదొడ్లు", hi: "शौचालय", en: "Toilets" },
      confirmation: {
        te: "సమీపంలోని మరుగుదొడ్లు చూపిస్తున్నాను",
        hi: "पास के शौचालय दिखा रहे हैं",
        en: "Showing nearby toilets",
      },
    },
  },
  {
    keywords: {
      te: ["నీరు", "నీళ్ళు", "మంచినీళ్ళు", "వాటర్", "దాహం"],
      hi: ["पानी", "जल", "पीने का पानी", "प्यास"],
      en: ["water", "drinking water", "thirsty"],
    },
    result: {
      intent: "water",
      route: "/facilities?type=water",
      emoji: "💧",
      label: { te: "నీరు", hi: "पानी", en: "Water" },
      confirmation: {
        te: "సమీపంలోని నీటి కేంద్రాలు చూపిస్తున్నాను",
        hi: "पास के पानी केंद्र दिखा रहे हैं",
        en: "Showing nearby water stations",
      },
    },
  },
  {
    keywords: {
      te: ["వైద్యం", "ఆసుపత్రి", "డాక్టర్", "మెడికల్", "ప్రథమ చికిత్స"],
      hi: ["डॉक्टर", "अस्पताल", "दवाई", "मेडिकल", "प्राथमिक चिकित्सा"],
      en: ["doctor", "hospital", "medical", "first aid", "medicine", "sick", "injury"],
    },
    result: {
      intent: "medical",
      route: "/facilities?type=medical",
      emoji: "🏥",
      label: { te: "వైద్యం", hi: "चिकित्सा", en: "Medical" },
      confirmation: {
        te: "సమీపంలోని వైద్య సేవలు చూపిస్తున్నాను",
        hi: "पास की चिकित्सा सेवाएं दिखा रहे हैं",
        en: "Showing nearby medical services",
      },
    },
  },
  {
    keywords: {
      te: ["బస్", "ఆటో", "రవాణా", "ట్రాన్స్పోర్ట్", "ఎలా వెళ్ళాలి", "పార్కింగ్"],
      hi: ["बस", "ऑटो", "परिवहन", "ट्रांसपोर्ट", "कैसे जाएं", "पार्किंग"],
      en: ["bus", "auto", "transport", "how to reach", "parking", "taxi", "travel"],
    },
    result: {
      intent: "transport",
      route: "/transport",
      emoji: "🚌",
      label: { te: "రవాణా", hi: "परिवहन", en: "Transport" },
      confirmation: {
        te: "రవాణా సమాచారం చూపిస్తున్నాను",
        hi: "परिवहन जानकारी दिखा रहे हैं",
        en: "Showing transport information",
      },
    },
  },
  {
    keywords: {
      te: ["ఎమర్జెన్సీ", "పోలీస్", "అంబులెన్స్", "ఫైర్", "అగ్నిమాపక"],
      hi: ["इमरजेंसी", "पुलिस", "एम्बुलेंस", "आग", "फायर"],
      en: ["emergency", "police", "ambulance", "fire", "sos", "danger"],
    },
    result: {
      intent: "emergency",
      route: "/emergency",
      emoji: "🆘",
      label: { te: "అత్యవసరం", hi: "आपातकाल", en: "Emergency" },
      confirmation: {
        te: "అత్యవసర సమాచారం చూపిస్తున్నాను",
        hi: "आपातकालीन जानकारी दिखा रहे हैं",
        en: "Showing emergency information",
      },
    },
  },
  {
    keywords: {
      te: ["హెచ్చరిక", "అలర్ట్", "హెచ్చరికలు"],
      hi: ["अलर्ट", "चेतावनी", "सूचना"],
      en: ["alert", "alerts", "warning", "update", "notification"],
    },
    result: {
      intent: "alerts",
      route: "/alerts",
      emoji: "📢",
      label: { te: "హెచ్చరికలు", hi: "अलर्ट", en: "Alerts" },
      confirmation: {
        te: "హెచ్చరికలు చూపిస్తున్నాను",
        hi: "अलर्ट दिखा रहे हैं",
        en: "Showing alerts",
      },
    },
  },
  {
    keywords: {
      te: ["హోమ్", "మొదటి పేజీ", "ముందు పేజీ", "వెనక్కి"],
      hi: ["होम", "मुख्य", "पहला पेज", "वापस"],
      en: ["home", "main", "go back", "start"],
    },
    result: {
      intent: "home",
      route: "/",
      emoji: "🏠",
      label: { te: "హోమ్", hi: "होम", en: "Home" },
      confirmation: {
        te: "హోమ్ పేజీకి వెళ్తున్నాను",
        hi: "होम पेज पर जा रहे हैं",
        en: "Going to home page",
      },
    },
  },
  {
    keywords: {
      te: ["మ్యాప్", "మ్యాపు", "స్థానం", "ఎక్కడ"],
      hi: ["नक्शा", "मैप", "कहां", "स्थान"],
      en: ["map", "location", "where", "find", "nearby", "around"],
    },
    result: {
      intent: "map",
      route: "/map",
      emoji: "📍",
      label: { te: "మ్యాప్", hi: "नक्शा", en: "Map" },
      confirmation: {
        te: "మ్యాప్ చూపిస్తున్నాను",
        hi: "नक्शा दिखा रहे हैं",
        en: "Showing map",
      },
    },
  },
  {
    keywords: {
      te: ["సహాయం", "వాలంటీర్", "హెల్ప్"],
      hi: ["मदद", "सहायता", "स्वयंसेवक", "हेल्प"],
      en: ["help", "volunteer", "assist", "guide"],
    },
    result: {
      intent: "volunteer",
      route: "/facilities?type=volunteer",
      emoji: "🤝",
      label: { te: "సహాయం", hi: "सहायता", en: "Help" },
      confirmation: {
        te: "వాలంటీర్ సమాచారం చూపిస్తున్నాను",
        hi: "स्वयंसेवक जानकारी दिखा रहे हैं",
        en: "Showing volunteer information",
      },
    },
  },
];

export function parseIntent(transcript: string, lang: Lang): VoiceIntent | null {
  const text = transcript.toLowerCase().trim();
  if (!text) return null;

  for (const entry of intents) {
    const keywords = entry.keywords[lang];
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return entry.result;
      }
    }
    // Also check English keywords as fallback (many users mix languages)
    if (lang !== "en") {
      for (const keyword of entry.keywords.en) {
        if (text.includes(keyword.toLowerCase())) {
          return entry.result;
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

  recognition.lang = langCodes[lang];
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

export function speak(text: string, lang: Lang): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCodes[lang];
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
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
