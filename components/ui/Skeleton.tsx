"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gray-200 ${className}`}
      aria-hidden
    />
  );
}

/** Skeleton for dashboard summary cards */
export function DashboardSummarySkeleton() {
  return (
    <div className="rounded-2xl shadow-xl border border-white/60 bg-white/80 backdrop-blur-md p-6 space-y-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

/** Skeleton for test results / list rows */
export function ResultsListSkeleton() {
  return (
    <div className="rounded-2xl shadow-xl border border-white/60 bg-white/80 backdrop-blur-md overflow-hidden">
      <div className="p-4 border-b border-gray-100 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="divide-y divide-gray-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 flex gap-4">
            <Skeleton className="h-4 w-24 flex-shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton for career report / AI section */
export function ReportSkeleton() {
  return (
    <div className="rounded-2xl shadow-xl border border-white/60 bg-white/80 backdrop-blur-md p-6 space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

/** Skeleton for AI mentor typing indicator */
export function MentorMessageSkeleton() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex gap-2">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-2 w-2 rounded-full" />
      </div>
    </div>
  );
}
