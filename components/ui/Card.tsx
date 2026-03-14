"use client";

import { cardClass } from "@/styles/designSystem";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  /** Slight scale on hover for micro-interaction */
  hoverScale?: boolean;
}

export function Card({
  children,
  className = "",
  as: Component = "div",
  hoverScale = true,
}: CardProps) {
  return (
    <Component
      className={`${cardClass} ${hoverScale ? "hover:scale-[1.01]" : ""} ${className}`}
    >
      {children}
    </Component>
  );
}
