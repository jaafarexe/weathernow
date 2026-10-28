import React from 'react';
import { AlertCircle, RotateCcw, MapPin } from 'lucide-react';
import { CityLocation } from '../types/weather';
import { POPULAR_CITIES } from '../services/weatherApi';

interface WeatherErrorProps {
  message: string;
  onRetry: () => void;
  onSelectCity: (city: CityLocation) => void;
}

export const WeatherError: React.FC<WeatherErrorProps> = ({
  message,
  onRetry,
  onSelectCity,
}) => {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-8 sm:p-10 backdrop-blur-md text-center max-w-xl mx-auto shadow-xl">
      <div className="inline-flex items-center justify-center p-3 rounded-full bg-rose-500/10 text-rose-400 mb-4 border border-rose-500/20">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Weather Data Unavailable</h3>
      <p className="text-sm text-slate-300 mb-6 leading-relaxed">
        {message || 'Unable to retrieve live forecast from Open-Meteo. Please check your city name or connection.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-medium">
          Or explore weather in these cities:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => onSelectCity(city)}
              className="px-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>{city.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
