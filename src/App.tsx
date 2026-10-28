import React, { useState, useEffect, useCallback } from 'react';
import {
  CityLocation,
  OpenMeteoWeatherResponse,
  TemperatureUnit,
} from './types/weather';
import {
  fetchWeatherData,
  reverseGeocodeCoords,
  POPULAR_CITIES,
} from './services/weatherApi';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { HourlyForecastTimeline } from './components/HourlyForecastTimeline';
import { SevenDayForecast } from './components/SevenDayForecast';
import { WeatherSkeleton } from './components/WeatherSkeleton';
import { WeatherError } from './components/WeatherError';
import { getWeatherDetails } from './utils/weatherUtils';
import { Info, MapPin } from 'lucide-react';

const UNIT_STORAGE_KEY = 'weathernow_temp_unit';
const DEFAULT_CITY = POPULAR_CITIES[0]; // London

export default function App() {
  const [city, setCity] = useState<CityLocation>(DEFAULT_CITY);
  const [weather, setWeather] = useState<OpenMeteoWeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load preferred temperature unit from localStorage or default to celsius
  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    try {
      const saved = localStorage.getItem(UNIT_STORAGE_KEY);
      if (saved === 'celsius' || saved === 'fahrenheit') return saved;
    } catch {
      // Fallback
    }
    return 'celsius';
  });

  const handleToggleUnit = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    try {
      localStorage.setItem(UNIT_STORAGE_KEY, newUnit);
    } catch (e) {
      console.warn('Could not save unit preference:', e);
    }
  };

  const loadWeather = useCallback(async (targetCity: CityLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(
        targetCity.latitude,
        targetCity.longitude,
        targetCity.timezone || 'auto'
      );
      setWeather(data);
      setCity(targetCity);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      console.error('Failed to load weather:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Could not fetch weather data from Open-Meteo.';
      setError(`Unable to load live weather for "${targetCity.name}". ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load with default city
  useEffect(() => {
    loadWeather(DEFAULT_CITY);
  }, [loadWeather]);

  // Handle browser GPS geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const resolvedLocation = await reverseGeocodeCoords(lat, lon);
          await loadWeather(resolvedLocation);
        } catch (e) {
          console.error('Location lookup error:', e);
          setError('Failed to resolve current location weather.');
        } finally {
          setIsLocating(false);
        }
      },
      (geoErr) => {
        setIsLocating(false);
        let msg = 'Could not access device location.';
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please search your city manually.';
        }
        setError(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Weather condition insights
  const weatherCondition = weather ? getWeatherDetails(weather.current.weather_code, Boolean(weather.current.is_day)) : null;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Header */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onRefresh={() => loadWeather(city)}
        isRefreshing={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Search Bar Section */}
        <div className="space-y-3">
          <SearchBar
            onSelectCity={loadWeather}
            onUseCurrentLocation={handleUseCurrentLocation}
            isLocating={isLocating}
            currentCityName={city.name}
          />

          {/* Quick city pill chips for fast one-click browsing */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 text-xs text-slate-400">
            <span className="hidden sm:inline font-medium text-slate-400">Suggested:</span>
            {POPULAR_CITIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => loadWeather(c)}
                className={`px-2.5 py-1 rounded-md border transition-all cursor-pointer whitespace-nowrap ${
                  city.name === c.name
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-300 font-medium'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content States */}
        {error ? (
          <WeatherError
            message={error}
            onRetry={() => loadWeather(city)}
            onSelectCity={loadWeather}
          />
        ) : isLoading && !weather ? (
          <WeatherSkeleton />
        ) : weather ? (
          <div className="space-y-6 sm:space-y-8 transition-opacity duration-300">
            {/* 1. Current Weather Hero */}
            <section id="current-weather">
              <CurrentWeatherCard
                city={city}
                weather={weather}
                unit={unit}
              />
            </section>

            {/* 2. Detailed Metrics Grid */}
            <section aria-label="Atmospheric Metrics">
              <WeatherMetricsGrid
                weather={weather}
                unit={unit}
              />
            </section>

            {/* 3. Hourly Highlights */}
            <section id="hourly-forecast" aria-label="Hourly Highlights">
              <HourlyForecastTimeline
                weather={weather}
                unit={unit}
              />
            </section>

            {/* 4. 7-Day Forecast */}
            <section id="daily-forecast" aria-label="7-Day Outlook">
              <SevenDayForecast
                weather={weather}
                unit={unit}
              />
            </section>

            {/* 5. Meteorological Summary & Air Quality Context */}
            <section className="p-5 sm:p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0 mt-0.5">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Atmospheric Summary for {city.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                    Currently experiencing {weatherCondition?.description.toLowerCase() || 'typical conditions'}.
                    Precipitation totals today are expected around{' '}
                    <span className="text-slate-200 font-mono">
                      {(weather.daily.precipitation_sum?.[0] ?? 0).toFixed(1)} mm
                    </span>{' '}
                    with wind gusts peaking at{' '}
                    <span className="text-slate-200 font-mono">
                      {Math.round(weather.daily.wind_speed_10m_max?.[0] ?? weather.current.wind_speed_10m)}{' '}
                      km/h
                    </span>
                    .
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto text-xs text-slate-400 font-mono shrink-0">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  {weather.latitude.toFixed(2)}°N, {weather.longitude.toFixed(2)}°E
                </span>
              </div>
            </section>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/90 bg-slate-950/80 py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Weather data provided by</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 font-medium transition-colors underline underline-offset-2"
            >
              Open-Meteo API
            </a>
            <span>· No key required</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            {lastUpdated && (
              <span>
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <span aria-hidden="true">·</span>
            <span>WeatherNow &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
