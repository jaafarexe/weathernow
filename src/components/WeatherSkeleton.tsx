import React from 'react';

export const WeatherSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading weather data">
      {/* Hero Card Skeleton */}
      <div className="h-64 sm:h-72 rounded-2xl bg-slate-900/70 border border-slate-800/80 p-6 sm:p-8 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-6 w-48 bg-slate-800 rounded-md" />
          <div className="h-4 w-36 bg-slate-800/60 rounded-md" />
          <div className="h-20 w-44 bg-slate-800/90 rounded-lg mt-4" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-28 bg-slate-800/60 rounded-md" />
          <div className="h-4 w-24 bg-slate-800/60 rounded-md" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={`skel-metric-${i}`}
            className="h-28 rounded-xl bg-slate-900/70 border border-slate-800/80 p-4 space-y-2"
          >
            <div className="h-3 w-16 bg-slate-800 rounded" />
            <div className="h-6 w-20 bg-slate-800/90 rounded" />
            <div className="h-3 w-24 bg-slate-800/50 rounded" />
          </div>
        ))}
      </div>

      {/* Hourly Highlights Skeleton */}
      <div className="h-44 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
        <div className="h-5 w-40 bg-slate-800 rounded" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={`skel-hour-${i}`}
              className="min-w-[5.25rem] h-24 rounded-xl bg-slate-800/50"
            />
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-3">
        <div className="h-5 w-36 bg-slate-800 rounded mb-4" />
        {[...Array(5)].map((_, i) => (
          <div
            key={`skel-day-${i}`}
            className="h-12 rounded-xl bg-slate-800/40"
          />
        ))}
      </div>
    </div>
  );
};
