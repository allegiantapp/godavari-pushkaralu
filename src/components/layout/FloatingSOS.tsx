"use client";

import Link from "next/link";

export default function FloatingSOS({ lang }: { lang: string }) {
  return (
    <Link
      href={`/${lang}/emergency`}
      className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center active:scale-90 transition-transform"
      style={{
        background: "linear-gradient(135deg, #dc2626, #b91c1c)",
        boxShadow:
          "0 4px 16px rgba(220,38,38,0.4), 0 0 0 3px rgba(220,38,38,0.15)",
      }}
      aria-label="Emergency SOS"
    >
      <span className="text-white font-black text-sm tracking-wider">SOS</span>
    </Link>
  );
}
