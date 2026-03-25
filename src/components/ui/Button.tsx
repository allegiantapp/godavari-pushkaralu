"use client";

import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "saffron";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-godavari-700 text-white hover:bg-godavari-800 active:bg-godavari-900 shadow-md",
  secondary:
    "bg-godavari-50 text-godavari-700 hover:bg-godavari-100 active:bg-godavari-200",
  outline:
    "border-2 border-godavari-300 text-godavari-700 hover:bg-godavari-50 active:bg-godavari-100",
  ghost:
    "text-godavari-600 hover:bg-godavari-50 active:bg-godavari-100",
  danger:
    "bg-maroon-600 text-white hover:bg-maroon-700 active:bg-maroon-800 shadow-md",
  saffron:
    "bg-saffron-500 text-white hover:bg-saffron-600 active:bg-saffron-700 shadow-md",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
  xl: "px-8 py-4 text-lg rounded-2xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-godavari-400 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
