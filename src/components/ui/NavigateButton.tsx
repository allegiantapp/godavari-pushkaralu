"use client";

import { getDirectionsUrl } from "@/lib/locations";

type Lang = "te" | "hi" | "en";

const labels: Record<Lang, string> = {
  te: "దిశలు",
  hi: "दिशाएं",
  en: "Directions",
};

interface NavigateButtonProps {
  lat: number;
  lng: number;
  lang: string;
  compact?: boolean;
}

export default function NavigateButton({ lat, lng, lang, compact }: NavigateButtonProps) {
  const l = (lang as Lang) || "te";
  const url = getDirectionsUrl(lat, lng);

  if (compact) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-godavari-700 text-white text-[10px] font-bold hover:bg-godavari-800 transition-colors flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
        {labels[l]}
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold transition-colors"
      style={{
        background: "linear-gradient(135deg, #1b5bae, #0f2847)",
        boxShadow: "0 2px 8px rgba(15,40,71,0.25)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
      {labels[l]}
    </a>
  );
}
