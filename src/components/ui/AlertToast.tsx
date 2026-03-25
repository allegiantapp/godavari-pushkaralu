"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import { fetchAlerts, type AlertData } from "@/lib/sheetsData";

type Lang = "te" | "hi" | "en";

const SEEN_KEY = "godavari_seen_alerts";

const typeStyle: Record<string, { icon: string; bg: string }> = {
  safety: { icon: "🛡️", bg: "bg-blue-600" },
  crowd: { icon: "👥", bg: "bg-amber-600" },
  weather: { icon: "🌧️", bg: "bg-sky-600" },
  info: { icon: "📢", bg: "bg-godavari-700" },
};

export default function AlertToast({ lang }: { lang: string }) {
  const l = (lang as Lang) || "te";
  const [alert, setAlert] = useState<AlertData | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = async () => {
      const alerts = await fetchAlerts();
      const active = alerts.filter((a) => a.active);
      const seen = new Set<string>(
        JSON.parse(localStorage.getItem(SEEN_KEY) || "[]")
      );
      const unseen = active.find((a) => !seen.has(a.id));
      if (unseen) {
        setAlert(unseen);
        setTimeout(() => setShow(true), 300);
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const dismiss = () => {
    setShow(false);
    setTimeout(() => {
      if (alert) {
        const seen: string[] = JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
        seen.push(alert.id);
        localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
      }
      setAlert(null);
    }, 300);
  };

  // Auto-dismiss after 8s
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(dismiss, 8000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!alert) return null;

  const style = typeStyle[alert.type] || typeStyle.info;

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 right-0 z-[100] px-4 pt-[env(safe-area-inset-top,12px)] transition-all duration-300",
        show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
      style={{ paddingTop: "max(env(safe-area-inset-top, 12px), 12px)" }}
    >
      <Link
        href={`/${lang}/alerts`}
        onClick={dismiss}
        className={clsx(
          "block rounded-2xl p-3.5 shadow-2xl active:scale-[0.98] transition-transform",
          style.bg
        )}
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0 mt-0.5">{style.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <p className="text-white font-bold text-sm leading-tight">
                {alert.title[l]}
              </p>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); dismiss(); }}
                className="text-white/60 hover:text-white flex-shrink-0 p-0.5"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-white/85 text-xs leading-relaxed line-clamp-2">
              {alert.message[l]}
            </p>
            <p className="text-white/50 text-[10px] mt-1 font-medium">
              {l === "te" ? "వివరాలకు నొక్కండి" : l === "hi" ? "विवरण के लिए टैप करें" : "Tap for details"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
