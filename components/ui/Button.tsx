"use client";

import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-6 py-3 font-semibold shadow-md hover:scale-105 transition-all duration-300",
  secondary:
    "bg-white/70 backdrop-blur-md border border-white/60 text-gray-800 rounded-xl px-6 py-3 font-semibold hover:bg-white/80 transition-all duration-300",
  outline:
    "bg-transparent text-gray-700 rounded-xl px-6 py-3 font-semibold border-2 border-white/60 hover:border-purple-300 hover:text-primary transition-all duration-300",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", children, className = "", disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`inline-flex items-center justify-center ${variantClasses[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
