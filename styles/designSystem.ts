/**
 * MIB Thathaastu – Global design system tokens
 * Use these for consistent UI across the platform.
 */

export const colors = {
  primary: {
    from: "from-purple-600",
    to: "to-blue-600",
    gradient: "bg-gradient-to-r from-purple-600 to-blue-600",
    text: "text-purple-600",
    bg: "bg-purple-600",
  },
  secondary: {
    blue: "text-blue-600",
    bg: "bg-blue-50",
  },
  accent: {
    teal: "text-teal-600",
    bg: "bg-teal-50",
  },
  background: {
    light: "bg-gray-50",
    white: "bg-white",
  },
  text: {
    primary: "text-gray-900",
    secondary: "text-gray-500",
  },
} as const;

export const spacing = {
  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "1rem",      // 16px
  lg: "1.5rem",    // 24px
  xl: "2rem",      // 32px
} as const;

export const radius = {
  lg: "rounded-2xl",
  xl: "rounded-3xl",
} as const;

/** Card style: soft glass wellness – use for all cards (landing, dashboard, mobile, psychologist, mission) */
export const cardClass =
  "rounded-2xl shadow-xl border border-white/60 bg-white/80 backdrop-blur-md transition-all duration-300 hover:shadow-xl";

/** Section spacing for dashboards and pages */
export const sectionSpacing = "space-y-6 sm:space-y-8";

/** Section header typography */
export const sectionHeaderClass = "text-2xl font-semibold text-gray-900";

/** Divider */
export const dividerClass = "border-t border-gray-100";

/** Typography scale */
export const typography = {
  h1: "text-3xl font-bold text-gray-900",
  h2: "text-2xl font-semibold text-gray-900",
  h3: "text-xl font-semibold text-gray-900",
  body: "text-base text-gray-700",
  caption: "text-sm text-gray-500",
} as const;
