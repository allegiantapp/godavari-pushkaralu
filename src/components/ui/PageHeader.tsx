"use client";

import { clsx } from "clsx";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  variant?: "default" | "sacred" | "transparent";
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  showBack = true,
  rightAction,
  variant = "default",
  className,
}: PageHeaderProps) {
  const router = useRouter();

  const variants = {
    default: "bg-white border-b border-slate-100",
    sacred: "gradient-sacred text-white",
    transparent: "bg-transparent",
  };

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 safe-top",
        variants[variant],
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => router.back()}
              className={clsx(
                "w-10 h-10 flex items-center justify-center rounded-xl transition-colors",
                variant === "sacred"
                  ? "hover:bg-white/10 text-white"
                  : "hover:bg-slate-100 text-slate-700"
              )}
              aria-label="Go back"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div>
            <h1
              className={clsx(
                "font-semibold",
                subtitle ? "text-lg leading-tight" : "text-xl"
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className={clsx(
                  "text-sm",
                  variant === "sacred" ? "text-white/70" : "text-slate-500"
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
}
