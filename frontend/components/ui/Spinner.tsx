"use client";

import { cn } from "@heroui/react";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "default" | "brand" | "light" | "dark";

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  label?: string;
  labelPlacement?: "top" | "bottom" | "left" | "right";
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: "w-4 h-4",
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const borderWidthClasses: Record<SpinnerSize, string> = {
  xs: "border-2",
  sm: "border-2",
  md: "border-3",
  lg: "border-4",
  xl: "border-4",
};

const variantClasses: Record<SpinnerVariant, string> = {
  default: "border-slate-600 border-t-slate-300",
  brand: "border-amber-900/30 border-t-amber-400",
  light: "border-white/20 border-t-white",
  dark: "border-slate-800/30 border-t-slate-800",
};

const labelSizeClasses: Record<SpinnerSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

/**
 * Brand-colored spinner with amber/gold theme
 */
export function Spinner({
  size = "md",
  variant = "brand",
  className,
  label,
  labelPlacement = "bottom",
}: SpinnerProps) {
  const spinnerElement = (
    <div
      className={cn(
        "rounded-full animate-spin",
        sizeClasses[size],
        borderWidthClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label={label || "Loading"}
    />
  );

  if (!label) {
    return spinnerElement;
  }

  const labelElement = (
    <span
      className={cn(
        "text-slate-300",
        labelSizeClasses[size]
      )}
    >
      {label}
    </span>
  );

  const containerClasses = cn(
    "flex items-center gap-2",
    (labelPlacement === "top" || labelPlacement === "bottom") && "flex-col",
    labelPlacement === "top" && "flex-col-reverse",
    labelPlacement === "left" && "flex-row-reverse"
  );

  return (
    <div className={containerClasses}>
      {spinnerElement}
      {labelElement}
    </div>
  );
}

interface SpinnerOverlayProps {
  show?: boolean;
  size?: SpinnerSize;
  label?: string;
  className?: string;
  blur?: boolean;
}

/**
 * Full-screen or container overlay with spinner
 */
export function SpinnerOverlay({
  show = true,
  size = "lg",
  label,
  className,
  blur = true,
}: SpinnerOverlayProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center z-50",
        blur ? "backdrop-blur-sm bg-slate-900/60" : "bg-slate-900/80",
        className
      )}
    >
      <Spinner size={size} label={label} />
    </div>
  );
}

interface LoadingDotsProps {
  size?: SpinnerSize;
  className?: string;
}

const dotSizeClasses: Record<SpinnerSize, string> = {
  xs: "w-1 h-1",
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

const dotGapClasses: Record<SpinnerSize, string> = {
  xs: "gap-1",
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
  xl: "gap-2.5",
};

/**
 * Animated loading dots as alternative to spinner
 */
export function LoadingDots({ size = "md", className }: LoadingDotsProps) {
  return (
    <div
      className={cn("flex items-center", dotGapClasses[size], className)}
      role="status"
      aria-label="Loading"
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            "rounded-full bg-amber-400 animate-bounce",
            dotSizeClasses[size]
          )}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  );
}

interface PulseRingProps {
  size?: SpinnerSize;
  className?: string;
}

const ringOuterClasses: Record<SpinnerSize, string> = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-20 h-20",
};

const ringInnerClasses: Record<SpinnerSize, string> = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
};

/**
 * Pulsing ring animation loader
 */
export function PulseRing({ size = "md", className }: PulseRingProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        ringOuterClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      {/* Outer pulsing ring */}
      <div
        className={cn(
          "absolute rounded-full bg-amber-400/30 animate-ping",
          ringOuterClasses[size]
        )}
      />
      {/* Middle ring */}
      <div
        className={cn(
          "absolute rounded-full bg-amber-400/50 animate-pulse",
          ringInnerClasses[size]
        )}
        style={{ animationDelay: "0.2s" }}
      />
      {/* Center dot */}
      <div
        className={cn(
          "rounded-full bg-amber-400",
          size === "xs" && "w-1.5 h-1.5",
          size === "sm" && "w-2 h-2",
          size === "md" && "w-3 h-3",
          size === "lg" && "w-4 h-4",
          size === "xl" && "w-5 h-5"
        )}
      />
    </div>
  );
}
