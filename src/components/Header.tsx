import React from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import { TemperatureUnit } from '../types/weather';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <CloudSun className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Weather<span className="text-sky-400">Now</span>
          </span>
        </div>

        {/* Zone 2: Informational tag or nav items */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#current-weather" className="hover:text-slate-200 transition-colors whitespace-nowrap">
            Current
          </a>
          <a href="#hourly-forecast" className="hover:text-slate-200 transition-colors whitespace-nowrap">
            Hourly
          </a>
          <a href="#daily-forecast" className="hover:text-slate-200 transition-colors whitespace-nowrap">
            7-Day Outlook
          </a>
        </div>

        {/* Zone 3: Unit Toggle & Refresh Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Refresh button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh weather data"
            aria-label="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>

          {/* Unit Toggle Segmented Control */}
          <div
            className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5"
            role="group"
            aria-label="Temperature unit selection"
          >
            <button
              type="button"
              onClick={() => onToggleUnit('celsius')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                unit === 'celsius'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => onToggleUnit('fahrenheit')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                unit === 'fahrenheit'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
