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

type Lang = "te" | "hi" | "en";
type VoiceState = "idle" | "listening" | "processing" | "error";

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

const MAX_RETRIES = 2;

export default function VoiceModal({ lang, open, onClose, onNavigate }: VoiceModalProps) {
  const l = (lang as Lang) || "te";
  const t = voiceTranslations[l];

  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const sessionRef = useRef<VoiceSession | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gotResultRef = useRef(false);
  const retryCountRef = useRef(0);
  const listenStartRef = useRef(0);
  const onNavigateRef = useRef(onNavigate);
  const onCloseRef = useRef(onClose);
  onNavigateRef.current = onNavigate;
  onCloseRef.current = onClose;

  const cleanup = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
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
    gotResultRef.current = false;
    retryCountRef.current = 0;
    onCloseRef.current();
  }, [cleanup]);

  const beginListening = useCallback(() => {
    if (!isSpeechSupported()) {
      setState("error");
      setErrorMessage(t.notSupported);
      return;
    }

    setTranscript("");
    setErrorMessage("");
    gotResultRef.current = false;
    setState("listening");

    // Only set the master timeout on the first attempt (not retries)
    if (retryCountRef.current === 0) {
      listenStartRef.current = Date.now();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (sessionRef.current) {
          sessionRef.current.stop();
          sessionRef.current = null;
        }
        // Force error if still no result after 10s
        if (!gotResultRef.current) {
          setState("error");
          setErrorMessage(t.noSpeech);
        }
      }, 10000);
    }

    const session = startListening(
      l,
      // onTranscript
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          gotResultRef.current = true;
          setState("processing");
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          const intent = parseIntent(text, l);
          if (intent) {
            if (sessionRef.current) {
              sessionRef.current.stop();
              sessionRef.current = null;
            }
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
        }
      },
      // onEnd — recognition session ended naturally
      () => {
        sessionRef.current = null;

        // If we got a result, do nothing (already handled in onTranscript)
        if (gotResultRef.current) return;

        // Check if we're still within the 10s timeout window
        const elapsed = Date.now() - listenStartRef.current;
        if (elapsed < 9500 && retryCountRef.current < MAX_RETRIES) {
          // Retry: create a fresh SpeechRecognition instance after a short delay
          retryCountRef.current++;
          setTimeout(() => {
            // Re-check state — user might have closed the modal
            if (!gotResultRef.current && timeoutRef.current) {
              const retrySession = startListening(
                l,
                (text, isFinal) => {
                  setTranscript(text);
                  if (isFinal) {
                    gotResultRef.current = true;
                    setState("processing");
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                      timeoutRef.current = null;
                    }

                    const intent = parseIntent(text, l);
                    if (intent) {
                      if (sessionRef.current) {
                        sessionRef.current.stop();
                        sessionRef.current = null;
                      }
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
                  }
                },
                () => {
                  sessionRef.current = null;
                  // If still no result after retry ends, let the master
                  // timeout handle it (will show error at 10s)
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
                  // Other errors: let master timeout handle
                }
              );
              sessionRef.current = retrySession;
            }
          }, 200);
        }
        // If retries exhausted, let the master 10s timeout show the error
      },
      // onError
      (error) => {
        // Fatal errors: show immediately
        if (error === "not_allowed") {
          gotResultRef.current = true; // prevent retry
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setState("error");
          setErrorMessage(t.micBlocked);
        }
        // "no_speech" and other errors: let onEnd handle retry
      }
    );

    sessionRef.current = session;
  }, [l, t, cleanup]);

  // Start listening when modal opens
  useEffect(() => {
    if (open) {
      retryCountRef.current = 0;
      // Warm up TTS on user gesture context — mobile browsers require
      // speechSynthesis.speak() to be called from a user interaction first.
      // Speaking an empty utterance "unlocks" TTS for subsequent calls.
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const warmup = new SpeechSynthesisUtterance("");
        warmup.volume = 0;
        window.speechSynthesis.speak(warmup);
      }
      const timer = setTimeout(() => {
        beginListening();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      cleanup();
    }
  }, [open, beginListening, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  if (!open) return null;

  const isListening = state === "listening";
  const hasTranscript = transcript.length > 0;

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
          {/* ── Mic Icon + Rings ── */}
          <div className="relative w-32 h-32 flex items-center justify-center mb-4">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(249,155,7,0.3)", animation: "voiceRing 2s ease-out infinite" }} />
                <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(249,155,7,0.2)", animation: "voiceRing 2s ease-out infinite 0.5s" }} />
                <div className="absolute inset-0 rounded-full" style={{ border: "2px solid rgba(249,155,7,0.1)", animation: "voiceRing 2s ease-out infinite 1s" }} />
              </>
            )}

            <div
              className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
              style={{
                background:
                  state === "error"
                    ? "linear-gradient(135deg, #dc2626, #b91c1c)"
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

          {/* ── Sound Wave Visualizer ── */}
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

          {/* Transcript / Error */}
          <div className="min-h-[60px] flex items-center justify-center text-center px-2">
            {isListening && hasTranscript && (
              <p className="text-white text-lg font-semibold leading-snug">
                &ldquo;{transcript}&rdquo;
              </p>
            )}
            {isListening && !hasTranscript && (
              <p className="text-white/40 text-sm">{t.tapToSpeak}</p>
            )}
            {state === "processing" && (
              <p className="text-white text-lg font-semibold leading-snug">
                &ldquo;{transcript}&rdquo;
              </p>
            )}
            {state === "error" && (
              <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            {state === "error" && (
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
            )}
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-full bg-white/10 text-white/70 text-sm font-medium hover:bg-white/15 transition-colors"
            >
              {t.cancel}
            </button>
          </div>
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
