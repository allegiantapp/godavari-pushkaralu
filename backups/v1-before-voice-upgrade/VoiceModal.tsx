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
type VoiceState = "idle" | "listening" | "processing" | "result" | "error";

interface VoiceModalProps {
  lang: string;
  open: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export default function VoiceModal({ lang, open, onClose, onNavigate }: VoiceModalProps) {
  const l = (lang as Lang) || "te";
  const t = voiceTranslations[l];

  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [matchedIntent, setMatchedIntent] = useState<VoiceIntent | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const sessionRef = useRef<VoiceSession | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setMatchedIntent(null);
    setErrorMessage("");
    onClose();
  }, [cleanup, onClose]);

  const beginListening = useCallback(() => {
    if (!isSpeechSupported()) {
      setState("error");
      setErrorMessage(t.notSupported);
      return;
    }

    setTranscript("");
    setMatchedIntent(null);
    setErrorMessage("");
    setState("listening");

    // 10s timeout
    timeoutRef.current = setTimeout(() => {
      if (sessionRef.current) {
        sessionRef.current.stop();
      }
    }, 10000);

    const session = startListening(
      l,
      // onTranscript
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          setState("processing");
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          const intent = parseIntent(text, l);
          if (intent) {
            setMatchedIntent(intent);
            setState("result");
            speak(intent.confirmation[l], l).then(() => {
              setTimeout(() => {
                onNavigate(intent.route as string);
                handleClose();
              }, 800);
            });
          } else {
            setState("error");
            setErrorMessage(t.notUnderstood);
            speak(t.notUnderstood, l);
          }
        }
      },
      // onEnd
      () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      },
      // onError
      (error) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setState("error");
        if (error === "not_allowed") {
          setErrorMessage(t.micBlocked);
        } else if (error === "no_speech") {
          setErrorMessage(t.noSpeech);
        } else {
          setErrorMessage(t.notUnderstood);
        }
      }
    );

    sessionRef.current = session;
  }, [l, t, onNavigate, handleClose]);

  // Start listening when modal opens
  useEffect(() => {
    if (open) {
      // Small delay for animation
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      {/* Modal Content */}
      <div
        className="relative w-[85%] max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0f2847 0%, #142f54 100%)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          animation: "voiceModalIn 0.3s ease-out",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 z-10 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center py-10 px-6">
          {/* Pulsing Circles + Mic Icon */}
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            {/* Animated rings - only when listening */}
            {state === "listening" && (
              <>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "2px solid rgba(249,155,7,0.3)",
                    animation: "voiceRing 2s ease-out infinite",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "2px solid rgba(249,155,7,0.2)",
                    animation: "voiceRing 2s ease-out infinite 0.5s",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "2px solid rgba(249,155,7,0.1)",
                    animation: "voiceRing 2s ease-out infinite 1s",
                  }}
                />
              </>
            )}

            {/* Center circle */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
              style={{
                background:
                  state === "result"
                    ? "linear-gradient(135deg, #16a34a, #15803d)"
                    : state === "error"
                      ? "linear-gradient(135deg, #dc2626, #b91c1c)"
                      : "linear-gradient(135deg, #ffbe20, #e65100)",
                boxShadow:
                  state === "result"
                    ? "0 8px 30px rgba(22,163,74,0.4)"
                    : state === "error"
                      ? "0 8px 30px rgba(220,38,38,0.4)"
                      : "0 8px 30px rgba(230,81,0,0.4)",
                transition: "all 0.3s ease",
              }}
            >
              {state === "result" ? (
                <span className="text-3xl">{matchedIntent?.emoji}</span>
              ) : state === "error" ? (
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

          {/* Status Text */}
          <p className="text-white/50 text-xs font-medium tracking-wide uppercase mb-3">
            {state === "listening" && t.listening}
            {state === "processing" && t.processing}
            {state === "result" && t.navigating}
            {state === "error" && ""}
            {state === "idle" && t.listening}
          </p>

          {/* Transcript / Result / Error */}
          <div className="min-h-[60px] flex items-center justify-center text-center px-2">
            {state === "listening" && transcript && (
              <p className="text-white text-lg font-semibold leading-snug">
                &ldquo;{transcript}&rdquo;
              </p>
            )}
            {state === "listening" && !transcript && (
              <p className="text-white/40 text-sm">{t.tapToSpeak}</p>
            )}
            {state === "processing" && (
              <p className="text-white text-lg font-semibold leading-snug">
                &ldquo;{transcript}&rdquo;
              </p>
            )}
            {state === "result" && matchedIntent && (
              <div>
                <p className="text-white text-lg font-bold">{matchedIntent.label[l]}</p>
                <p className="text-saffron-400 text-xs mt-1">{matchedIntent.confirmation[l]}</p>
              </div>
            )}
            {state === "error" && (
              <p className="text-red-300 text-sm font-medium">{errorMessage}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            {state === "error" && (
              <button
                onClick={() => beginListening()}
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

      {/* Inline keyframes */}
      <style>{`
        @keyframes voiceModalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes voiceRing {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
