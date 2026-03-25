"use client";

import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "saffron" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  label: string;
  icon: React.ReactNode;
  sublabel?: string;
}

const variantStyles = {
  primary: "bg-godavari-700 text-white shadow-md hover:bg-godavari-800",
  secondary: "bg-godavari-50 text-godavari-700 hover:bg-godavari-100",
  ghost: "text-godavari-600 hover:bg-godavari-50",
  saffron: "bg-saffron-50 text-saffron-700 hover:bg-saffron-100",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

const sizeStyles = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
  lg: "w-24 h-24",
  xl: "w-28 h-28",
};

const iconSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
};

const labelSizes = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-sm",
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      label,
      icon,
      sublabel,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "flex flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-godavari-400",
          "active:scale-95",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        <span className={iconSizes[size]}>{icon}</span>
        <span className={clsx("font-medium leading-tight text-center", labelSizes[size])}>
          {label}
        </span>
        {sublabel && (
          <span className="text-[9px] opacity-60">{sublabel}</span>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
