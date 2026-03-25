"use client";

import { useEffect, useRef } from "react";
import { type VoiceIntent } from "@/lib/voiceAssistant";
import {
  getTopLocationsByCategory,
  getDirectionsUrl,
  categoryConfig,
  type MapLocation,
} from "@/lib/locations";

type Lang = "te" | "hi" | "en";

interface VoiceResultSheetProps {
  intent: VoiceIntent | null;
  lang: string;
  onClose: () => void;
}

const sheetTranslations = {
  te: { directions: "దిశలు", dismiss: "మూసివేయి" },
  hi: { directions: "दिशाएं", dismiss: "बंद करें" },
  en: { directions: "Directions", dismiss: "Dismiss" },
};

export default function VoiceResultSheet({
  intent,
  lang,
  onClose,
}: VoiceResultSheetProps) {
  const l = (lang as Lang) || "en";
  const t = sheetTranslations[l];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss after 12 seconds
  useEffect(() => {
    if (intent) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, 12000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [intent, onClose]);

  if (!intent) return null;

  const locations: MapLocation[] = getTopLocationsByCategory(
    intent.category,
    2
  );

  // Don't show bottom sheet for intents with no location data
  if (locations.length === 0) return null;

  const config = categoryConfig[locations[0]?.category] || {
    emoji: intent.emoji,
    color: "#1b5bae",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Backdrop — subtle, tappable */}
      <div
        className="absolute inset-0 pointer-events-auto"
        style={{ background: "rgba(0,0,0,0.15)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-[430px] pointer-events-auto"
        style={{ animation: "voiceSheetUp 0.35s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <div
          className="bg-white rounded-t-3xl overflow-hidden"
          style={{
            boxShadow: "0 -8px 40px rgba(15,40,71,0.18)",
          }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
          </div>

          {/* Header — intent label */}
          <div className="px-5 pb-3 flex items-center gap-2.5">
            <span className="text-2xl">{intent.emoji}</span>
            <div>
              <p className="text-base font-bold text-slate-900">
                {intent.label[l]}
              </p>
              <p className="text-[11px] text-slate-500">
                {intent.confirmation[l]}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 mx-5" />

          {/* Results list */}
          <div className="px-5 py-3 space-y-2.5">
            {locations.map((loc) => {
              const locConfig =
                categoryConfig[loc.category] || config;

              return (
                <div
                  key={loc.id}
                  className="flex items-center gap-3 py-2"
                >
                  {/* Icon circle */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `${locConfig.color}12`,
                      border: `1px solid ${locConfig.color}25`,
                    }}
                  >
                    <span className="text-lg">{locConfig.emoji}</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {loc.name[l]}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {loc.distance && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {loc.distance}
                        </span>
                      )}
                      {loc.crowd && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            background:
                              loc.crowd === "low"
                                ? "#dcfce7"
                                : loc.crowd === "medium"
                                  ? "#fef3c7"
                                  : "#fee2e2",
                            color:
                              loc.crowd === "low"
                                ? "#15803d"
                                : loc.crowd === "medium"
                                  ? "#92400e"
                                  : "#b91c1c",
                          }}
                        >
                          {loc.crowd === "low"
                            ? l === "te"
                              ? "తక్కువ"
                              : l === "hi"
                                ? "कम"
                                : "Low"
                            : loc.crowd === "medium"
                              ? l === "te"
                                ? "మధ్యస్థ"
                                : l === "hi"
                                  ? "मध्यम"
                                  : "Moderate"
                              : l === "te"
                                ? "ఎక్కువ"
                                : l === "hi"
                                  ? "अधिक"
                                  : "High"}
                        </span>
                      )}
                      {loc.status && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            background:
                              loc.status === "open" ? "#dcfce7" : "#fee2e2",
                            color:
                              loc.status === "open" ? "#15803d" : "#b91c1c",
                          }}
                        >
                          {loc.status === "open"
                            ? l === "te"
                              ? "తెరిచి"
                              : l === "hi"
                                ? "खुला"
                                : "Open"
                            : l === "te"
                              ? "మూసి"
                              : l === "hi"
                                ? "बंद"
                                : "Closed"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Directions button */}
                  <a
                    href={getDirectionsUrl(loc.lat, loc.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white flex-shrink-0 active:scale-95 transition-transform"
                    style={{
                      background:
                        "linear-gradient(135deg, #1b5bae, #1c4d8f)",
                      boxShadow: "0 2px 8px rgba(27,91,174,0.25)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 11l19-9-9 19-2-8-8-2z" />
                    </svg>
                    {t.directions}
                  </a>
                </div>
              );
            })}
          </div>

          {/* Dismiss button area */}
          <div className="px-5 pb-5 pt-1 safe-bottom">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors active:scale-[0.98]"
            >
              {t.dismiss}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes voiceSheetUp {
          from {
            transform: translateY(100%);
            opacity: 0.5;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
