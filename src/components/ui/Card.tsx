"use client";

import { clsx } from "clsx";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "sacred";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

const variantStyles = {
  default: "bg-white border border-slate-100",
  elevated: "bg-white shadow-lg shadow-slate-200/50",
  outlined: "bg-white border-2 border-godavari-100",
  sacred: "bg-gradient-to-br from-godavari-50 to-saffron-50 border border-godavari-100",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      hoverable = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-2xl transition-all duration-200",
          variantStyles[variant],
          paddingStyles[padding],
          hoverable && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer active:translate-y-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
