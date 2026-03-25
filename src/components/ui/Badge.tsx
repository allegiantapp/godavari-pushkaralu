"use client";

import { clsx } from "clsx";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "saffron";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  info: "bg-godavari-50 text-godavari-700 border-godavari-200",
  neutral: "bg-slate-50 text-slate-600 border-slate-200",
  saffron: "bg-saffron-50 text-saffron-700 border-saffron-200",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-godavari-500",
  neutral: "bg-slate-400",
  saffron: "bg-saffron-500",
};

export default function Badge({
  variant = "neutral",
  size = "sm",
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium border rounded-full",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx("w-1.5 h-1.5 rounded-full", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
