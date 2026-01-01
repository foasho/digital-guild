"use client";

import { cn } from "@heroui/react";
import { useEffect, useState, type ReactNode } from "react";

type FadeDirection = "up" | "down" | "left" | "right" | "none";
type FadeDuration = "fast" | "normal" | "slow";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  direction?: FadeDirection;
  duration?: FadeDuration;
  delay?: number;
  show?: boolean;
}

const durationClasses: Record<FadeDuration, string> = {
  fast: "duration-200",
  normal: "duration-300",
  slow: "duration-500",
};

const directionInitialClasses: Record<FadeDirection, string> = {
  up: "translate-y-4",
  down: "-translate-y-4",
  left: "translate-x-4",
  right: "-translate-x-4",
  none: "",
};

/**
 * Fade-in animation wrapper component
 */
export function FadeIn({
  children,
  className,
  direction = "up",
  duration = "normal",
  delay = 0,
  show = true,
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, delay]);

  return (
    <div
      className={cn(
        "transition-all ease-out",
        durationClasses[duration],
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : cn("opacity-0", directionInitialClasses[direction]),
        className
      )}
    >
      {children}
    </div>
  );
}

interface FadeInGroupProps {
  children: ReactNode[];
  className?: string;
  childClassName?: string;
  direction?: FadeDirection;
  duration?: FadeDuration;
  staggerDelay?: number;
  show?: boolean;
}

/**
 * Staggered fade-in animation for multiple children
 */
export function FadeInGroup({
  children,
  className,
  childClassName,
  direction = "up",
  duration = "normal",
  staggerDelay = 100,
  show = true,
}: FadeInGroupProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn
          key={index}
          direction={direction}
          duration={duration}
          delay={index * staggerDelay}
          show={show}
          className={childClassName}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  skeleton?: ReactNode;
  direction?: FadeDirection;
  duration?: FadeDuration;
}

/**
 * Container that shows skeleton while loading, then fades in content
 */
export function AnimatedContainer({
  children,
  className,
  isLoading = false,
  skeleton,
  direction = "up",
  duration = "normal",
}: AnimatedContainerProps) {
  if (isLoading && skeleton) {
    return <div className={className}>{skeleton}</div>;
  }

  return (
    <FadeIn
      className={className}
      direction={direction}
      duration={duration}
      show={!isLoading}
    >
      {children}
    </FadeIn>
  );
}

interface SlideInProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  duration?: FadeDuration;
  delay?: number;
  show?: boolean;
}

const slideDistances: Record<string, string> = {
  left: "-translate-x-full",
  right: "translate-x-full",
  up: "-translate-y-full",
  down: "translate-y-full",
};

/**
 * Slide-in animation wrapper
 */
export function SlideIn({
  children,
  className,
  direction = "left",
  duration = "normal",
  delay = 0,
  show = true,
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, delay]);

  return (
    <div
      className={cn(
        "transition-transform ease-out",
        durationClasses[duration],
        isVisible ? "translate-x-0 translate-y-0" : slideDistances[direction],
        className
      )}
    >
      {children}
    </div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  duration?: FadeDuration;
  delay?: number;
  show?: boolean;
}

/**
 * Scale-in animation wrapper
 */
export function ScaleIn({
  children,
  className,
  duration = "normal",
  delay = 0,
  show = true,
}: ScaleInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, delay]);

  return (
    <div
      className={cn(
        "transition-all ease-out",
        durationClasses[duration],
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        className
      )}
    >
      {children}
    </div>
  );
}
