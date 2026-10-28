import React from 'react';
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Sun,
  Sunrise,
  Sunset,
  Navigation,
} from 'lucide-react';
import { OpenMeteoWeatherResponse, TemperatureUnit } from '../types/weather';
import {
  formatTemperature,
  formatWindSpeed,
  formatPressure,
  getWindDirection,
  getUvCategory,
  getHumidityAssessment,
  formatSunTime,
} from '../utils/weatherUtils';

interface WeatherMetricsGridProps {
  weather: OpenMeteoWeatherResponse;
  unit: TemperatureUnit;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({
  weather,
  unit,
}) => {
  const current = weather.current;
  const daily = weather.daily;

  const uvToday = daily.uv_index_max?.[0] ?? 0;
  const uvInfo = getUvCategory(uvToday);
  const humidityDesc = getHumidityAssessment(current.relative_humidity_2m);
  const windDir = getWindDirection(current.wind_direction_10m);
  const sunriseTime = formatSunTime(daily.sunrise?.[0]);
  const sunsetTime = formatSunTime(daily.sunset?.[0]);

  // Metric cards with single-elevation border and dark surface contrast
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Feels Like */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Feels Like</span>
          <Thermometer className="h-4 w-4 text-sky-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
          {formatTemperature(current.apparent_temperature, unit)}
        </div>
        <p className="text-xs text-slate-400 mt-1 truncate">
          Actual: {formatTemperature(current.temperature_2m, unit)}
        </p>
      </div>

      {/* 2. Humidity */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Humidity</span>
          <Droplets className="h-4 w-4 text-sky-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
          {Math.round(current.relative_humidity_2m)}%
        </div>
        <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-sky-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, current.relative_humidity_2m))}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1.5 truncate">{humidityDesc}</p>
      </div>

      {/* 3. Wind */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Wind</span>
          <Wind className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">
          {formatWindSpeed(current.wind_speed_10m, unit)}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
          <Navigation
            className="h-3 w-3 text-cyan-400 transition-transform"
            style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
          />
          <span className="font-mono text-slate-400">{windDir} ({Math.round(current.wind_direction_10m)}°)</span>
        </div>
      </div>

      {/* 4. Atmospheric Pressure */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Pressure</span>
          <Gauge className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-lg sm:text-xl font-bold text-white tabular-nums">
          {formatPressure(current.surface_pressure, unit)}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {current.surface_pressure > 1013 ? 'Normal / High' : 'Low barometric'}
        </p>
      </div>

      {/* 5. UV Index */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">UV Index</span>
          <Sun className="h-4 w-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">
            {Math.round(uvToday)}
          </span>
          <span className={`text-xs font-semibold ${uvInfo.colorClass}`}>
            {uvInfo.label}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 truncate" title={uvInfo.desc}>
          {uvInfo.desc}
        </p>
      </div>

      {/* 6. Sun Times */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-colors">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Sun Cycle</span>
          <Sunrise className="h-4 w-4 text-amber-300" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Sunrise className="h-3 w-3 text-amber-400" /> Rise
            </span>
            <span className="font-semibold text-white font-mono">{sunriseTime}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Sunset className="h-3 w-3 text-orange-400" /> Set
            </span>
            <span className="font-semibold text-white font-mono">{sunsetTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
