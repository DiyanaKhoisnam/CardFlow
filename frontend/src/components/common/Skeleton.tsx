import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200/70 rounded-lg ${className}`}></div>
  );
};

export const SummaryCardsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-sm">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
};

export const PageLoadingFallback: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <SummaryCardsSkeleton />
    </div>
  );
};
