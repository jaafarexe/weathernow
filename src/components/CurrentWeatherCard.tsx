import React from 'react';
import {
  MapPin,
  ArrowUp,
  ArrowDown,
  Droplets,
  Wind,
  Calendar,
  Clock,
} from 'lucide-react';
import { CityLocation, OpenMeteoWeatherResponse, TemperatureUnit } from '../types/weather';
import {
  formatTemperature,
  formatWindSpeed,
  getWeatherDetails,
  getWeatherAtmosphereClasses,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  city: CityLocation;
  weather: OpenMeteoWeatherResponse;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  city,
  weather,
  unit,
}) => {
  const current = weather.current;
  const isDay = Boolean(current.is_day);
  const condition = getWeatherDetails(current.weather_code, isDay);
  const atmosphere = getWeatherAtmosphereClasses(current.weather_code, isDay);

  const todayMax = weather.daily.temperature_2m_max[0] ?? current.temperature_2m;
  const todayMin = weather.daily.temperature_2m_min[0] ?? current.temperature_2m;

  // Local time formatting using timezone
  const currentTimeString = (() => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: weather.timezone || 'UTC',
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date());
    } catch {
      return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }
  })();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${atmosphere.borderAccent} bg-gradient-to-br ${atmosphere.containerBg} p-6 sm:p-8 shadow-xl shadow-black/30 backdrop-blur-md transition-all duration-300`}
    >
      {/* Ambient background glow */}
      <div
        className={`pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full ${atmosphere.glowColor} blur-3xl`}
      />

      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        {/* Left Column: Location & Main Temp */}
        <div className="space-y-4">
          {/* Location & Time */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="h-4 w-4 text-sky-400 shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {city.name}
              </h1>
              {city.country && (
                <span className="text-sm font-medium text-slate-300">
                  {city.countryCode ? `· ${city.countryCode}` : `· ${city.country}`}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{currentTimeString}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{isDay ? 'Daytime' : 'Nighttime'}</span>
            </div>
          </div>

          {/* Temperature & Condition Highlight */}
          <div className="flex items-baseline gap-4 pt-2">
            <div className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white tabular-nums drop-shadow-sm">
              {formatTemperature(current.temperature_2m, unit)}
            </div>
            <div className="space-y-1">
              <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md ${atmosphere.badgeBg}`}>
                {condition.label}
              </span>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xs">
                {condition.description}
              </p>
            </div>
          </div>

          {/* High / Low & Feels Like */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 font-medium">
              <span>Feels like</span>
              <span className="font-semibold text-white tabular-nums">
                {formatTemperature(current.apparent_temperature, unit)}
              </span>
            </div>
            <span className="text-slate-500" aria-hidden="true">|</span>
            <div className="flex items-center gap-1 text-rose-300 font-medium">
              <ArrowUp className="h-3.5 w-3.5" />
              <span className="tabular-nums">{formatTemperature(todayMax, unit)}</span>
              <span className="text-slate-400 text-xs">High</span>
            </div>
            <div className="flex items-center gap-1 text-sky-300 font-medium">
              <ArrowDown className="h-3.5 w-3.5" />
              <span className="tabular-nums">{formatTemperature(todayMin, unit)}</span>
              <span className="text-slate-400 text-xs">Low</span>
            </div>
          </div>
        </div>

        {/* Right Column: Prominent Visual Icon & Quick Micro Stats */}
        <div className="flex flex-col items-center md:items-end justify-between gap-4 self-center md:self-auto">
          {/* Condition Icon with glow ring */}
          <div className="relative p-3 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
            <WeatherIcon name={condition.icon} className="h-20 w-20 sm:h-24 sm:w-24 drop-shadow-md" />
          </div>

          {/* Micro strip */}
          <div className="flex items-center gap-4 text-xs text-slate-300 bg-slate-900/60 px-3.5 py-1.5 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-sky-400" />
              <span className="tabular-nums font-mono">{Math.round(current.relative_humidity_2m)}%</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 text-cyan-400" />
              <span className="tabular-nums font-mono">{formatWindSpeed(current.wind_speed_10m, unit)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
