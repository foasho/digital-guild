"use client";

import { cn } from "@heroui/react";

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton component with pulse animation
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-700/50",
        className
      )}
    />
  );
}

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  imageHeight?: string;
  lines?: number;
}

/**
 * Card-style skeleton for job cards and similar content
 */
export function SkeletonCard({
  className,
  showImage = true,
  imageHeight = "h-32",
  lines = 3,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden bg-slate-800/80 backdrop-blur-sm border border-slate-700/50",
        className
      )}
    >
      {/* Image placeholder */}
      {showImage && (
        <Skeleton className={cn("w-full rounded-none", imageHeight)} />
      )}

      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Content lines */}
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "h-4",
              index === lines - 1 ? "w-1/2" : "w-full"
            )}
          />
        ))}

        {/* Action area */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

interface SkeletonJobCardProps {
  className?: string;
}

/**
 * Job card specific skeleton matching the JobCard component layout
 */
export function SkeletonJobCard({ className }: SkeletonJobCardProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl min-h-[200px] bg-slate-800/90 backdrop-blur-sm border border-slate-700/50",
        className
      )}
    >
      {/* Background shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-700/30 to-transparent skeleton-shimmer" />

      <div className="relative z-10 flex flex-col min-h-[200px] p-4">
        {/* Top: Reward placeholder */}
        <div className="flex justify-between items-start">
          <Skeleton className="h-8 w-32 bg-amber-900/30" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom: Job info */}
        <div className="flex justify-between items-end gap-2">
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full bg-amber-900/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SkeletonListProps {
  className?: string;
  items?: number;
  showAvatar?: boolean;
}

/**
 * List-style skeleton for table rows and list items
 */
export function SkeletonList({
  className,
  items = 5,
  showAvatar = false,
}: SkeletonListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/30"
        >
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full shrink-0" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16 rounded-md shrink-0" />
        </div>
      ))}
    </div>
  );
}

interface SkeletonListItemProps {
  className?: string;
  showAvatar?: boolean;
}

/**
 * Single list item skeleton
 */
export function SkeletonListItem({
  className,
  showAvatar = false,
}: SkeletonListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/30",
        className
      )}
    >
      {showAvatar && <Skeleton className="h-10 w-10 rounded-full shrink-0" />}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-8 w-16 rounded-md shrink-0" />
    </div>
  );
}

interface SkeletonGuildCardProps {
  className?: string;
}

/**
 * Guild card specific skeleton matching the GuildCard component
 */
export function SkeletonGuildCard({ className }: SkeletonGuildCardProps) {
  return (
    <div className={cn("mx-4 relative", className)}>
      <div
        className="rounded-xl overflow-hidden border-2 border-slate-600/50 backdrop-blur-sm p-3"
        style={{
          background:
            "linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))",
        }}
      >
        <div className="flex flex-row items-center gap-3">
          {/* Avatar placeholder */}
          <Skeleton className="w-14 h-14 rounded-full shrink-0" />

          {/* Name area */}
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Balance area */}
          <div className="flex flex-col items-end shrink-0 gap-1">
            <Skeleton className="h-6 w-20 bg-amber-900/30" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface SkeletonStatProps {
  className?: string;
}

/**
 * Statistics card skeleton
 */
export function SkeletonStat({ className }: SkeletonStatProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-slate-800/60 border border-slate-700/30",
        className
      )}
    >
      <Skeleton className="h-4 w-16 mb-2" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}

interface SkeletonStatsGridProps {
  className?: string;
  columns?: number;
}

/**
 * Grid of stat skeletons
 */
export function SkeletonStatsGrid({
  className,
  columns = 3,
}: SkeletonStatsGridProps) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-4",
        className
      )}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonStat key={index} />
      ))}
    </div>
  );
}
