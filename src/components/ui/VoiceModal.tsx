"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  startListening,
  parseIntent,
  speak,
  isSpeechSupported,
  voiceTranslations,
  type VoiceIntent,
  type VoiceSession,
} from "@/lib/voiceAssistant";
import {
  isMediaRecorderSupported,
  startRecording,
  type RecordingSession,
} from "@/lib/audioRecorder";

type Lang = "te" | "hi" | "en";
type VoiceState = "idle" | "listening" | "processing" | "error";
type VoiceMode = "native" | "cloud" | "text";

interface VoiceModalProps {
  lang: string;
  open: boolean;
  onClose: () => void;
  onNavigate: (route: string, intent: VoiceIntent) => void;
}

/* ── Sound Wave Bars ── */
function SoundWave({ active }: { active: boolean }) {
  const bars = [
    { delay: "0s", height: "40%" },
    { delay: "0.15s", height: "70%" },
    { delay: "0.05s", height: "100%" },
    { delay: "0.2s", height: "60%" },
    { delay: "0.1s", height: "45%" },
  ];

  return (
    <div className="flex items-center justify-center gap-[5px] h-8">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: "4px",
            height: active ? bar.height : "4px",
            background: active
              ? "linear-gradient(180deg, #ffbe20, #e65100)"
              : "rgba(255,255,255,0.2)",
            animation: active
              ? `soundWave 1.2s ease-in-out infinite ${bar.delay}`
              : "none",
            transition: "height 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

/* ── Text input translations ── */
const textInputTranslations = {
  te: {
    placeholder: "ఇక్కడ టైప్ చేయండి... (ఘాట్, భోజనం, టాయిలెట్...)",
    submit: "వెతుకు",
    voiceNotAvailable: "ఈ పరికరంలో వాయిస్ అందుబాటులో లేదు. టైప్ చేయండి:",
    examples: "ఉదా: ఘాట్లు, భోజనం, టాయిలెట్, నీరు, బస్",
    typeInstead: "టైప్ చేయండి",
  },
  hi: {
    placeholder: "यहाँ टाइप करें... (घाट, खाना, टॉयलेट...)",
    submit: "खोजें",
    voiceNotAvailable: "इस डिवाइस पर वॉइस उपलब्ध नहीं। टाइप करें:",
    examples: "जैसे: घाट, खाना, टॉयलेट, पानी, बस",
    typeInstead: "टाइप करें",
  },
  en: {
    placeholder: "Type here... (ghats, food, toilet...)",
    submit: "Search",
    voiceNotAvailable: "Voice not available on this device. Type instead:",
    examples: "e.g. ghats, food, toilet, water, bus",
    typeInstead: "Type instead",
  },
};

const MAX_RETRIES = 2;

/**
 * Determine the best voice mode for this device:
 * - "native": Web Speech API works (Chrome Android/Desktop)
 * - "cloud": No native speech, but MediaRecorder works (iOS Safari, Firefox)
 * - "text": Nothing works, fall back to typing
 */
function detectVoiceMode(): VoiceMode {
  if (isSpeechSupported()) return "native";
  if (isMediaRecorderSupported()) return "cloud";
  return "text";
}

export default function VoiceModal({ lang, open, onClose, onNavigate }: VoiceModalProps) {
  const l = (lang as Lang) || "te";
  const t = voiceTranslations[l];
  const tt = textInputTranslations[l];

  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [textInput, setTextInput] = useState("");
  const [mode, setMode] = useState<VoiceMode>("native");
  const sessionRef = useRef<VoiceSession | null>(null);
  const recordingRef = useRef<RecordingSession | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gotResultRef = useRef(false);
  const retryCountRef = useRef(0);
  const listenStartRef = useRef(0);
  const onNavigateRef = useRef(onNavigate);
  const onCloseRef = useRef(onClose);
  const textInputRef = useRef<HTMLInputElement>(null);
  onNavigateRef.current = onNavigate;
  onCloseRef.current = onClose;

  // Detect best voice mode on mount
  useEffect(() => {
    setMode(detectVoiceMode());
  }, []);

  const cleanup = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
    }
    if (recordingRef.current) {
      recordingRef.current.stop();
      recordingRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    cleanup();
    setState("idle");
    setTranscript("");
    setErrorMessage("");
    setTextInput("");
    gotResultRef.current = false;
    retryCountRef.current = 0;
    onCloseRef.current();
  }, [cleanup]);

  // Process a transcript (from either native or cloud speech)
  const processTranscript = useCallback((text: string) => {
    setTranscript(text);
    setState("processing");

    const intent = parseIntent(text, l);
    if (intent) {
      cleanup();
      setState("idle");
      setTranscript("");
      setErrorMessage("");
      gotResultRef.current = false;
      retryCountRef.current = 0;
      onCloseRef.current();
      onNavigateRef.current(intent.route, intent);
    } else {
      setState("error");
      setErrorMessage(`${t.notUnderstood}\n\n"${text}"`);
      speak(t.notUnderstood, l);
    }
  }, [l, t, cleanup]);

  // Handle text input submission
  const handleTextSubmit = useCallback(() => {
    const text = textInput.trim();
    if (!text) return;

    const intent = parseIntent(text, l);
    if (intent) {
      setTextInput("");
      onCloseRef.current();
      onNavigateRef.current(intent.route, intent);
    } else {
      setErrorMessage(`${t.notUnderstood}\n\n"${text}"`);
    }
  }, [textInput, l, t]);

  // Start cloud recording (iOS, Firefox)
  const beginCloudListening = useCallback(() => {
    setTranscript("");
    setErrorMessage("");
    setState("listening");

    const session = startRecording(
      l,
      // onTranscript
      (text) => {
        recordingRef.current = null;
        processTranscript(text);
      },
      // onError
      (error) => {
        recordingRef.current = null;
        if (error === "not_allowed") {
          setState("error");
          setErrorMessage(t.micBlocked);
        } else if (error === "no_speech") {
          setState("error");
          setErrorMessage(t.noSpeech);
        } else {
          setState("error");
          setErrorMessage(t.noSpeech);
        }
      },
      7000 // 7 second max recording
    );

    recordingRef.current = session;
  }, [l, t, processTranscript]);

  // Start native listening (Chrome Android/Desktop)
  const beginNativeListening = useCallback(() => {
    setTranscript("");
    setErrorMessage("");
    gotResultRef.current = false;
    setState("listening");

    if (retryCountRef.current === 0) {
      listenStartRef.current = Date.now();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (sessionRef.current) {
          sessionRef.current.stop();
          sessionRef.current = null;
        }
        if (!gotResultRef.current) {
          setState("error");
          setErrorMessage(t.noSpeech);
        }
      }, 10000);
    }

    const session = startListening(
      l,
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          gotResultRef.current = true;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          if (sessionRef.current) {
            sessionRef.current.stop();
            sessionRef.current = null;
          }
          processTranscript(text);
        }
      },
      () => {
        sessionRef.current = null;
        if (gotResultRef.current) return;

        const elapsed = Date.now() - listenStartRef.current;
        if (elapsed < 9500 && retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          setTimeout(() => {
            if (!gotResultRef.current && timeoutRef.current) {
              const retrySession = startListening(
                l,
                (text, isFinal) => {
                  setTranscript(text);
                  if (isFinal) {
                    gotResultRef.current = true;
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                      timeoutRef.current = null;
                    }
                    if (sessionRef.current) {
                      sessionRef.current.stop();
                      sessionRef.current = null;
                    }
                    processTranscript(text);
                  }
                },
                () => { sessionRef.current = null; },
                (error) => {
                  if (error === "not_allowed") {
                    gotResultRef.current = true;
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                      timeoutRef.current = null;
                    }
                    setState("error");
                    setErrorMessage(t.micBlocked);
                  }
                }
              );
              sessionRef.current = retrySession;
            }
          }, 200);
        }
      },
      (error) => {
        if (error === "not_allowed") {
          gotResultRef.current = true;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setState("error");
          setErrorMessage(t.micBlocked);
        }
      }
    );

    sessionRef.current = session;
  }, [l, t, processTranscript]);

  // Unified begin listening
  const beginListening = useCallback(() => {
    if (mode === "native") {
      beginNativeListening();
    } else if (mode === "cloud") {
      beginCloudListening();
    } else {
      setTimeout(() => textInputRef.current?.focus(), 100);
    }
  }, [mode, beginNativeListening, beginCloudListening]);

  // Start listening when modal opens
  useEffect(() => {
    if (open) {
      retryCountRef.current = 0;
      const detectedMode = detectVoiceMode();
      setMode(detectedMode);

      // Warm up TTS
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const warmup = new SpeechSynthesisUtterance("");
        warmup.volume = 0;
        window.speechSynthesis.speak(warmup);
      }

      if (detectedMode === "text") {
        setTimeout(() => textInputRef.current?.focus(), 300);
      } else {
        const timer = setTimeout(() => {
          if (detectedMode === "native") beginNativeListening();
          else beginCloudListening();
        }, 300);
        return () => clearTimeout(timer);
      }
    } else {
      cleanup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  if (!open) return null;

  const isListening = state === "listening";
  const hasTranscript = transcript.length > 0;
  const showMicUI = mode === "native" || mode === "cloud";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      {/* Modal */}
      <div
        className="relative w-[85%] max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0f2847 0%, #142f54 100%)",
          boxShadow:
            "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          animation: "voiceModalIn 0.3s ease-out",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 z-10 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center py-10 px-6">
          {/* ── Mic UI (native or cloud) ── */}
          {showMicUI ? (
            <>
              {/* Mic Icon + Rings */}
              <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(249,155,7,0.3)", animation: "voiceRing 2s ease-out infinite" }} />
                    <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(249,155,7,0.2)", animation: "voiceRing 2s ease-out infinite 0.5s" }} />
                    <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(249,155,7,0.1)", animation: "voiceRing 2s ease-out infinite 1s" }} />
                  </>
                )}

                {/* Tap to stop (cloud mode) — stop recording early */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center relative z-10 cursor-pointer"
                  onClick={() => {
                    if (isListening && mode === "cloud" && recordingRef.current) {
                      recordingRef.current.stop();
                    }
                  }}
                  style={{
                    background:
                      state === "error"
                        ? "linear-gradient(135deg, #dc2626, #b91c1c)"
                        : state === "processing"
                          ? "linear-gradient(135deg, #1b5bae, #1c4d8f)"
                          : "linear-gradient(135deg, #ffbe20, #e65100)",
                    boxShadow:
                      state === "error"
                        ? "0 8px 30px rgba(220,38,38,0.4)"
                        : "0 8px 30px rgba(230,81,0,0.4)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {state === "error" ? (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                  ) : state === "processing" ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="1" width="6" height="12" rx="3" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Sound Wave Visualizer */}
              <div className="h-10 flex items-center justify-center mb-2">
                {isListening && <SoundWave active={true} />}
                {state === "processing" && <SoundWave active={false} />}
              </div>

              {/* Status */}
              <p className="text-white/50 text-xs font-medium tracking-wide uppercase mb-3">
                {isListening && t.listening}
                {state === "processing" && t.processing}
                {state === "error" && ""}
                {state === "idle" && t.listening}
              </p>

              {/* Cloud mode hint */}
              {isListening && mode === "cloud" && !hasTranscript && (
                <p className="text-white/30 text-[11px] text-center mb-1">
                  {l === "te" ? "మాట్లాడి, ఆపడానికి నొక్కండి" : l === "hi" ? "बोलें, रुकने के लिए दबाएं" : "Speak, tap mic to stop"}
                </p>
              )}

              {/* Transcript / Error */}
              <div className="min-h-[60px] flex items-center justify-center text-center px-2">
                {isListening && hasTranscript && (
                  <p className="text-white text-lg font-semibold leading-snug">
                    &ldquo;{transcript}&rdquo;
                  </p>
                )}
                {isListening && !hasTranscript && mode === "native" && (
                  <p className="text-white/40 text-sm">{t.tapToSpeak}</p>
                )}
                {state === "processing" && hasTranscript && (
                  <p className="text-white text-lg font-semibold leading-snug">
                    &ldquo;{transcript}&rdquo;
                  </p>
                )}
                {state === "processing" && !hasTranscript && (
                  <p className="text-white/40 text-sm">{t.processing}</p>
                )}
                {state === "error" && (
                  <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {state === "error" && (
                  <>
                    <button
                      onClick={() => {
                        retryCountRef.current = 0;
                        beginListening();
                      }}
                      className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                      style={{
                        background: "linear-gradient(135deg, #ffbe20, #e65100)",
                        color: "white",
                        boxShadow: "0 4px 15px rgba(230,81,0,0.3)",
                      }}
                    >
                      {t.tryAgain}
                    </button>
                    <button
                      onClick={() => {
                        cleanup();
                        setState("idle");
                        setErrorMessage("");
                        setMode("text");
                        setTimeout(() => textInputRef.current?.focus(), 100);
                      }}
                      className="px-5 py-2.5 rounded-full bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition-colors flex items-center gap-1.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 16h8" />
                      </svg>
                      {tt.typeInstead}
                    </button>
                  </>
                )}
                {state !== "error" && (
                  <button
                    onClick={() => {
                      cleanup();
                      setState("idle");
                      setMode("text");
                      setTimeout(() => textInputRef.current?.focus(), 100);
                    }}
                    className="px-4 py-2 rounded-full bg-white/10 text-white/50 text-xs font-medium hover:bg-white/15 transition-colors flex items-center gap-1.5"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 16h8" />
                    </svg>
                    {tt.typeInstead}
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-full bg-white/10 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            </>
          ) : (
            /* ── Text Input Fallback ── */
            <>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{
                  background: "linear-gradient(135deg, #ffbe20, #e65100)",
                  boxShadow: "0 8px 30px rgba(230,81,0,0.4)",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M8 16h8" />
                </svg>
              </div>

              <p className="text-white/60 text-xs text-center mb-4">{tt.voiceNotAvailable}</p>

              <div className="w-full flex gap-2 mb-3">
                <input
                  ref={textInputRef}
                  type="text"
                  value={textInput}
                  onChange={(e) => { setTextInput(e.target.value); setErrorMessage(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                  placeholder={tt.placeholder}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-saffron-500 transition-colors"
                  autoComplete="off"
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim()}
                  className="px-4 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
                  style={{
                    background: textInput.trim()
                      ? "linear-gradient(135deg, #ffbe20, #e65100)"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  {tt.submit}
                </button>
              </div>

              <p className="text-white/30 text-[11px] text-center mb-2">{tt.examples}</p>

              {errorMessage && (
                <p className="text-red-300 text-sm font-medium text-center mt-2">{errorMessage}</p>
              )}

              <div className="mt-4 flex gap-3 justify-center">
                {detectVoiceMode() !== "text" && (
                  <button
                    onClick={() => {
                      const detectedMode = detectVoiceMode();
                      setMode(detectedMode);
                      setErrorMessage("");
                      setTextInput("");
                      retryCountRef.current = 0;
                      if (detectedMode !== "text") {
                        setTimeout(() => beginListening(), 100);
                      }
                    }}
                    className="px-4 py-2.5 rounded-full bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition-colors flex items-center gap-1.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="1" width="6" height="12" rx="3" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    </svg>
                    {t.tryAgain}
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-full bg-white/10 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes voiceModalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes voiceRing {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes soundWave {
          0%, 100% {
            transform: scaleY(0.4);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
