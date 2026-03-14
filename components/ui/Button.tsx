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
    "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:opacity-95",
  secondary:
    "bg-gray-100 text-gray-900 rounded-xl px-6 py-3 font-semibold border border-gray-200 hover:bg-gray-200 transition-all duration-300",
  outline:
    "bg-transparent text-gray-700 rounded-xl px-6 py-3 font-semibold border-2 border-gray-200 hover:border-purple-500 hover:text-purple-600 transition-all duration-300",
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
