"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function GhatsIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20" />
      <path d="M4 20v-4h4v4" />
      <path d="M10 20v-8h4v8" />
      <path d="M16 20v-6h4v6" />
      <path d="M12 4l-2 4h4l-2-4z" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
    </svg>
  );
}

function MapIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function AlertIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

export default function BottomNav({ lang }: { lang: string }) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: `/${lang}`,
      label: lang === "te" ? "హోమ్" : lang === "hi" ? "होम" : "Home",
      icon: <HomeIcon active={false} />,
      activeIcon: <HomeIcon active={true} />,
    },
    {
      href: `/${lang}/ghats`,
      label: lang === "te" ? "ఘాట్లు" : lang === "hi" ? "घाट" : "Ghats",
      icon: <GhatsIcon active={false} />,
      activeIcon: <GhatsIcon active={true} />,
    },
    {
      href: `/${lang}/map`,
      label: lang === "te" ? "మ్యాప్" : lang === "hi" ? "नक्शा" : "Map",
      icon: <MapIcon active={false} />,
      activeIcon: <MapIcon active={true} />,
    },
    {
      href: `/${lang}/alerts`,
      label: lang === "te" ? "హెచ్చరికలు" : lang === "hi" ? "अलर्ट" : "Alerts",
      icon: <AlertIcon active={false} />,
      activeIcon: <AlertIcon active={true} />,
    },
  ];

  return (
    <nav
      className="sticky bottom-0 z-40 safe-bottom"
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--godavari-100)",
        boxShadow: "0 -2px 16px rgba(15,40,71,0.06)",
      }}
    >
      <div className="flex items-stretch justify-around px-2 pt-1.5 pb-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl transition-all duration-200",
                "min-w-[60px]",
                isActive && "text-godavari-700 bg-godavari-50",
                !isActive && "text-slate-400 hover:text-godavari-600"
              )}
            >
              {isActive ? item.activeIcon : item.icon}
              <span
                className={clsx(
                  "text-[10px] font-semibold leading-none mt-0.5",
                  isActive && "text-godavari-700",
                  !isActive && "text-slate-400"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
