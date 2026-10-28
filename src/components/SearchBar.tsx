import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Navigation, History } from 'lucide-react';
import { CityLocation } from '../types/weather';
import { searchCities, POPULAR_CITIES } from '../services/weatherApi';

interface SearchBarProps {
  onSelectCity: (city: CityLocation) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  currentCityName?: string;
}

const RECENT_SEARCHES_KEY = 'weathernow_recent_cities';

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseCurrentLocation,
  isLocating,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<CityLocation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch (e) {
      console.warn('Could not read recent searches:', e);
    }
  }, []);

  const saveRecentSearch = (city: CityLocation) => {
    try {
      const filtered = recentSearches.filter(
        (c) => !(c.name === city.name && c.country === city.country)
      );
      const updated = [city, ...filtered].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save recent search:', e);
    }
  };

  // Debounced geocoding search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const hits = await searchCities(trimmed);
        setResults(hits);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to dismiss suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityLocation) => {
    saveRecentSearch(city);
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
      return;
    }

    if (results.length > 0) {
      handleSelect(results[0]);
    } else if (query.trim().length >= 2) {
      // Force immediate search
      setIsLoading(true);
      searchCities(query.trim())
        .then((hits) => {
          if (hits.length > 0) {
            handleSelect(hits[0]);
          } else {
            setResults([]);
            setIsOpen(true);
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-400 transition-colors">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search city, region, or country (e.g., Tokyo, Madrid, Vancouver)..."
            className="w-full pl-10 pr-10 py-3 text-sm bg-slate-900/90 text-slate-100 placeholder-slate-400 border border-slate-700/80 rounded-xl focus:outline-none focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/20 backdrop-blur-md transition-all shadow-lg shadow-black/20"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          className="px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-sky-600/25 transition-all shrink-0 active:scale-95 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="hidden sm:inline">Search</span>
        </button>

        {/* Current Location GPS Button */}
        <button
          type="button"
          onClick={onUseCurrentLocation}
          disabled={isLocating}
          title="Use my current GPS location"
          className="p-3 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border border-slate-700/80 rounded-xl shadow-md transition-all shrink-0 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none cursor-pointer"
          aria-label="Use my current location"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
          ) : (
            <Navigation className="w-4 h-4 text-sky-400" />
          )}
        </button>
      </form>

      {/* Autocomplete & Quick Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center gap-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Searching locations across Open-Meteo...</span>
            </div>
          ) : query.trim().length >= 2 && results.length > 0 ? (
            <div className="max-h-72 overflow-y-auto custom-scrollbar p-1">
              <div className="px-3 py-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">
                Matching Cities
              </div>
              {results.map((city, idx) => (
                <button
                  key={`${city.id}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between text-sm transition-colors cursor-pointer ${
                    selectedIndex === idx ? 'bg-sky-500/20 text-sky-100' : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="font-medium text-white truncate">{city.name}</span>
                    <span className="text-xs text-slate-400 truncate">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  {city.countryCode && (
                    <span className="text-xs text-slate-400 font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded">
                      {city.countryCode}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 && results.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-400">
              No matching city found for &ldquo;<span className="text-white">{query}</span>&rdquo;. Check spelling or try another city name.
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 pb-1.5">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" /> Recent
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem(RECENT_SEARCHES_KEY);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((city) => (
                      <button
                        key={`recent-${city.id}`}
                        type="button"
                        onClick={() => handleSelect(city)}
                        className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{city.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="px-2 pb-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Popular Cities
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={`pop-${city.id}`}
                      type="button"
                      onClick={() => handleSelect(city)}
                      className="text-left px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors truncate cursor-pointer"
                    >
                      {city.name}, {city.countryCode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
