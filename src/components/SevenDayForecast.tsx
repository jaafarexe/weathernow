import React, { useState } from 'react';
import {
  Calendar,
  Droplets,
  ArrowUp,
  ArrowDown,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  ChevronDown,
} from 'lucide-react';
import { OpenMeteoWeatherResponse, TemperatureUnit } from '../types/weather';
import {
  formatDayLabel,
  formatFullDate,
  formatTemperature,
  formatWindSpeed,
  formatSunTime,
  getWeatherDetails,
  getUvCategory,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface SevenDayForecastProps {
  weather: OpenMeteoWeatherResponse;
  unit: TemperatureUnit;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({
  weather,
  unit,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const daily = weather.daily;

  // Find min and max of entire week to size the relative temperature range bar
  const allMins = daily.temperature_2m_min;
  const allMaxs = daily.temperature_2m_max;
  const weekMin = Math.min(...allMins);
  const weekMax = Math.max(...allMaxs);
  const rangeSpan = Math.max(1, weekMax - weekMin);

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-sky-400" />
          <h2 className="text-sm sm:text-base font-semibold text-white">
            7-Day Forecast
          </h2>
          <span className="text-xs text-slate-400">· Daily Outlook</span>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Click any day for details
        </span>
      </div>

      {/* Cards list */}
      <div className="space-y-2.5">
        {daily.time.slice(0, 7).map((dateStr, idx) => {
          const code = daily.weather_code[idx];
          const tempMax = daily.temperature_2m_max[idx];
          const tempMin = daily.temperature_2m_min[idx];
          const rainChance = daily.precipitation_probability_max?.[idx] ?? 0;
          const rainSum = daily.precipitation_sum?.[idx] ?? 0;
          const uvMax = daily.uv_index_max?.[idx] ?? 0;
          const windMax = daily.wind_speed_10m_max?.[idx] ?? 0;
          const sunrise = formatSunTime(daily.sunrise?.[idx]);
          const sunset = formatSunTime(daily.sunset?.[idx]);
          const condition = getWeatherDetails(code, true);
          const isExpanded = expandedIndex === idx;

          // Bar calculations
          const leftPercent = ((tempMin - weekMin) / rangeSpan) * 100;
          const widthPercent = Math.max(10, ((tempMax - tempMin) / rangeSpan) * 100);

          return (
            <div
              key={`day-${dateStr}`}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-slate-800/60 border-slate-700 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/30 hover:border-slate-700/60'
              }`}
            >
              {/* Main Row clickable */}
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400 rounded-xl"
                aria-expanded={isExpanded}
              >
                {/* Day name & date */}
                <div className="w-24 sm:w-28 shrink-0">
                  <span
                    className={`block text-sm font-semibold ${
                      idx === 0 ? 'text-sky-400 font-bold' : 'text-slate-100'
                    }`}
                  >
                    {formatDayLabel(dateStr, idx)}
                  </span>
                  <span className="text-xs text-slate-400">{formatFullDate(dateStr)}</span>
                </div>

                {/* Weather icon & condition name */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <WeatherIcon name={condition.icon} className="h-5 w-5 shrink-0" />
                  <span className="text-xs sm:text-sm text-slate-300 truncate hidden md:inline">
                    {condition.label}
                  </span>
                </div>

                {/* Rain probability */}
                <div className="flex items-center gap-1 w-16 sm:w-20 justify-end text-xs text-sky-400 font-mono tabular-nums shrink-0">
                  {rainChance > 5 ? (
                    <>
                      <Droplets className="h-3.5 w-3.5 shrink-0" />
                      <span>{Math.round(rainChance)}%</span>
                    </>
                  ) : (
                    <span className="text-slate-600">--</span>
                  )}
                </div>

                {/* Min / Max visual bar */}
                <div className="hidden sm:flex items-center gap-2.5 w-44 md:w-56 shrink-0">
                  <span className="text-xs text-slate-400 font-mono tabular-nums w-8 text-right">
                    {formatTemperature(tempMin, unit)}
                  </span>
                  <div className="relative flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-sky-500 to-amber-500 rounded-full"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-white font-mono tabular-nums w-8 text-left">
                    {formatTemperature(tempMax, unit)}
                  </span>
                </div>

                {/* Mobile temp text fallback */}
                <div className="sm:hidden flex items-center gap-2 text-xs shrink-0">
                  <span className="text-slate-400 tabular-nums">
                    {formatTemperature(tempMin, unit)}
                  </span>
                  <span className="text-slate-600">/</span>
                  <span className="font-semibold text-white tabular-nums">
                    {formatTemperature(tempMax, unit)}
                  </span>
                </div>

                {/* Expand chevron */}
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform shrink-0 ${
                    isExpanded ? 'rotate-180 text-sky-400' : ''
                  }`}
                />
              </button>

              {/* Expanded details section */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-3">
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                        <Sun className="h-3.5 w-3.5 text-amber-400" />
                        <span>UV Index Max</span>
                      </div>
                      <span className="font-semibold text-white">
                        {Math.round(uvMax)} · {getUvCategory(uvMax).label}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                        <Wind className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Wind Gusts</span>
                      </div>
                      <span className="font-semibold text-white font-mono">
                        {formatWindSpeed(windMax, unit)}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                        <Droplets className="h-3.5 w-3.5 text-sky-400" />
                        <span>Precipitation</span>
                      </div>
                      <span className="font-semibold text-white font-mono">
                        {rainSum.toFixed(1)} mm
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                        <Sunrise className="h-3.5 w-3.5 text-amber-300" />
                        <span>Sun Times</span>
                      </div>
                      <span className="font-semibold text-white font-mono">
                        {sunrise} / {sunset}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
