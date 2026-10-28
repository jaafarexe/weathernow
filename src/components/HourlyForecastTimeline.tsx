import React, { useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Clock,
  Wind,
} from 'lucide-react';
import { OpenMeteoWeatherResponse, TemperatureUnit } from '../types/weather';
import {
  formatHourTime,
  formatTemperature,
  formatWindSpeed,
  getWeatherDetails,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastTimelineProps {
  weather: OpenMeteoWeatherResponse;
  unit: TemperatureUnit;
}

export const HourlyForecastTimeline: React.FC<HourlyForecastTimelineProps> = ({
  weather,
  unit,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hourly = weather.hourly;

  // Find index of current or closest next hour
  const now = new Date();
  const currentIsoHourPrefix = now.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"

  let startIndex = hourly.time.findIndex((t) => t.startsWith(currentIsoHourPrefix));
  if (startIndex === -1) {
    // Fallback: find first time after now or 0
    startIndex = hourly.time.findIndex((t) => new Date(t) >= now);
    if (startIndex === -1) startIndex = 0;
  }

  // Get next 24 hourly data points
  const points = hourly.time.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
    const originalIndex = startIndex + idx;
    const temp = hourly.temperature_2m[originalIndex];
    const code = hourly.weather_code[originalIndex];
    const precipProb = hourly.precipitation_probability?.[originalIndex] ?? 0;
    const wind = hourly.wind_speed_10m[originalIndex];
    const isDay = Boolean(hourly.is_day?.[originalIndex] ?? 1);
    const details = getWeatherDetails(code, isDay);

    return {
      timeStr,
      label: idx === 0 ? 'Now' : formatHourTime(timeStr),
      temp,
      code,
      precipProb,
      wind,
      isDay,
      details,
      isNow: idx === 0,
    };
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md">
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-sky-400" />
          <h2 className="text-sm sm:text-base font-semibold text-white">
            Hourly Highlights
          </h2>
          <span className="text-xs text-slate-400">· Next 24 hours</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll hourly left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll hourly right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar snap-x scroll-smooth focus:outline-none"
        tabIndex={0}
        aria-label="Hourly weather forecast"
      >
        {points.map((pt, idx) => (
          <div
            key={`hour-${idx}-${pt.timeStr}`}
            className={`flex flex-col items-center justify-between min-w-[5.25rem] py-3.5 px-2.5 rounded-xl border transition-all shrink-0 snap-start ${
              pt.isNow
                ? 'bg-sky-500/10 border-sky-500/40 shadow-sm shadow-sky-500/10'
                : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-800/30'
            }`}
          >
            {/* Time */}
            <span
              className={`text-xs font-semibold ${
                pt.isNow ? 'text-sky-300 font-bold' : 'text-slate-300'
              }`}
            >
              {pt.label}
            </span>

            {/* Weather Icon */}
            <div className="my-2.5" title={pt.details.label}>
              <WeatherIcon name={pt.details.icon} className="h-6 w-6" />
            </div>

            {/* Temperature */}
            <span className="text-base font-bold text-white tabular-nums">
              {formatTemperature(pt.temp, unit)}
            </span>

            {/* Rain Chance */}
            <div className="mt-2 flex items-center gap-1 text-[11px] text-sky-400">
              <Droplets className="h-3 w-3 shrink-0" />
              <span className="tabular-nums font-mono">{Math.round(pt.precipProb)}%</span>
            </div>

            {/* Wind Speed micro */}
            <div className="mt-1 flex items-center gap-0.5 text-[10px] text-slate-400">
              <span className="tabular-nums font-mono">{formatWindSpeed(pt.wind, unit)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
