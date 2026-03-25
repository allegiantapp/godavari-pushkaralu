"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

// Replace with your deployed Google Apps Script URL
const APPS_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";

const translations = {
  te: {
    title: "అభిప్రాయం",
    subtitle: "మీ అనుభవాన్ని పంచుకోండి",
    placeholder: "మీ అభిప్రాయం ఇక్కడ టైప్ చేయండి...",
    addPhoto: "ఫోటో జోడించండి",
    changePhoto: "మార్చండి",
    removePhoto: "తొలగించు",
    submit: "పంపండి",
    sending: "పంపుతోంది...",
    success: "ధన్యవాదాలు!",
    successSub: "మీ అభిప్రాయం స్వీకరించబడింది",
    error: "క్షమించండి, ఏదో తప్పు జరిగింది. మళ్ళీ ప్రయత్నించండి.",
    required: "దయచేసి మీ అభిప్రాయం రాయండి",
    maxSize: "ఫోటో 2MB కంటే తక్కువగా ఉండాలి",
  },
  hi: {
    title: "फीडबैक",
    subtitle: "अपना अनुभव साझा करें",
    placeholder: "यहाँ अपनी प्रतिक्रिया लिखें...",
    addPhoto: "फोटो जोड़ें",
    changePhoto: "बदलें",
    removePhoto: "हटाएं",
    submit: "भेजें",
    sending: "भेजा जा रहा है...",
    success: "धन्यवाद!",
    successSub: "आपकी प्रतिक्रिया प्राप्त हुई",
    error: "क्षमा करें, कुछ गलत हुआ। फिर से कोशिश करें।",
    required: "कृपया अपनी प्रतिक्रिया लिखें",
    maxSize: "फोटो 2MB से कम होना चाहिए",
  },
  en: {
    title: "Feedback",
    subtitle: "Share your experience",
    placeholder: "Type your feedback here...",
    addPhoto: "Add Photo",
    changePhoto: "Change",
    removePhoto: "Remove",
    submit: "Submit",
    sending: "Sending...",
    success: "Thank you!",
    successSub: "Your feedback has been received",
    error: "Sorry, something went wrong. Please try again.",
    required: "Please write your feedback",
    maxSize: "Photo must be less than 2MB",
  },
};

type Lang = keyof typeof translations;

export default function FeedbackClient({ lang }: { lang: string }) {
  const l = (lang as Lang) || "en";
  const t = translations[l];
  const router = useRouter();

  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError(t.maxSize);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError(t.required);
      return;
    }
    setLoading(true);
    setError("");

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action: "submitFeedback",
          text: text.trim(),
          imageData: image || "",
          lang,
        }),
      });
      setSuccess(true);
      setTimeout(() => router.push(`/${lang}`), 2500);
    } catch {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-godavari-50 px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-godavari-900 mb-1">{t.success}</h2>
          <p className="text-sm text-godavari-500">{t.successSub}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden bg-godavari-50">
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

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        <div className="space-y-4">
          {/* Text Input */}
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setError(""); }}
            placeholder={t.placeholder}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border-2 border-godavari-200 bg-white text-sm text-godavari-900 resize-none focus:outline-none focus:border-godavari-500 transition-colors placeholder:text-godavari-300"
          />

          {/* Image Upload */}
          {!image ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-3.5 rounded-xl border-2 border-dashed border-godavari-300 text-godavari-600 text-sm font-semibold flex items-center justify-center gap-2 hover:border-godavari-400 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {t.addPhoto}
            </button>
          ) : (
            <div className="relative rounded-xl overflow-hidden border-2 border-godavari-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="Preview" className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2 flex gap-1.5">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="bg-godavari-800/80 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                >
                  {t.changePhoto}
                </button>
                <button
                  onClick={() => setImage(null)}
                  className="bg-red-600/80 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold"
                >
                  {t.removePhoto}
                </button>
              </div>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImage}
            className="hidden"
          />

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className={clsx(
              "w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98]",
              loading || !text.trim()
                ? "bg-godavari-200 text-godavari-400"
                : "text-white"
            )}
            style={
              loading || !text.trim()
                ? undefined
                : {
                    background: "linear-gradient(135deg, #f99b07, #dd7302)",
                    boxShadow: "0 4px 15px rgba(249,155,7,0.3)",
                  }
            }
          >
            {loading ? t.sending : t.submit}
          </button>
        </div>
      </main>
    </div>
  );
}
