"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

// サイズに応じた星のサイズ
const sizeConfig: Record<StarRatingProps["size"] & string, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

export function StarRating({
  value,
  onChange,
  max = 5,
  size = "md",
  readonly = false,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSize = sizeConfig[size];
  const displayValue = hoverValue !== null ? hoverValue : value;

  const handleClick = (index: number) => {
    if (readonly) return;
    onChange(index + 1);
  };

  const handleMouseEnter = (index: number) => {
    if (readonly) return;
    setHoverValue(index + 1);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(null);
  };

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label={`評価: ${value}/${max}`}
    >
      {Array.from({ length: max }, (_, index) => {
        const isFilled = index < displayValue;
        const isInteractive = !readonly;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`
              transition-colors duration-150
              ${isInteractive ? "cursor-pointer hover:scale-110" : "cursor-default"}
              ${isInteractive ? "focus:outline-none focus:ring-2 focus:ring-amber-300 rounded" : ""}
            `}
            aria-label={`${index + 1}星`}
          >
            <Star
              size={starSize}
              className={`
                transition-colors duration-150
                ${isFilled ? "text-amber-400 fill-amber-400" : "text-gray-300"}
              `}
            />
          </button>
        );
      })}
    </div>
  );
}
