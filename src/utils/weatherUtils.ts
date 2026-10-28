import { TemperatureUnit } from '../types/weather';

export interface WeatherCodeDetails {
  label: string;
  description: string;
  icon: string; // key matching weather icon component
  category: 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'thunder';
}

/**
 * WMO Weather interpretation codes (WW)
 * 0: Clear sky
 * 1, 2, 3: Mainly clear, partly cloudy, and overcast
 * 45, 48: Fog and depositing rime fog
 * 51, 53, 55: Drizzle: Light, moderate, and dense intensity
 * 56, 57: Freezing Drizzle: Light and dense intensity
 * 61, 63, 65: Rain: Slight, moderate and heavy intensity
 * 66, 67: Freezing Rain: Light and heavy intensity
 * 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
 * 77: Snow grains
 * 80, 81, 82: Rain showers: Slight, moderate, and violent
 * 85, 86: Snow showers slight and heavy
 * 95: Thunderstorm: Slight or moderate
 * 96, 99: Thunderstorm with slight and heavy hail
 */
export function getWeatherDetails(code: number, isDay: boolean = true): WeatherCodeDetails {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Bright and sunny conditions' : 'Starlit and calm skies',
        icon: isDay ? 'Sun' : 'Moon',
        category: 'clear',
      };
    case 1:
      return {
        label: isDay ? 'Mainly Clear' : 'Mostly Clear',
        description: 'Occasional light cloud cover',
        icon: isDay ? 'SunMedium' : 'Moon',
        category: 'clear',
      };
    case 2:
      return {
        label: isDay ? 'Partly Cloudy' : 'Scattered Clouds',
        description: 'Sun and clouds mixed',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'cloudy',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Consistent dense cloud blanket',
        icon: 'Cloud',
        category: 'cloudy',
      };
    case 45:
      return {
        label: 'Foggy',
        description: 'Reduced visibility due to mist and fog',
        icon: 'CloudFog',
        category: 'fog',
      };
    case 48:
      return {
        label: 'Freezing Fog',
        description: 'Rime fog with icy atmospheric moisture',
        icon: 'CloudFog',
        category: 'fog',
      };
    case 51:
      return {
        label: 'Light Drizzle',
        description: 'Gentle misty precipitation',
        icon: 'CloudDrizzle',
        category: 'rain',
      };
    case 53:
      return {
        label: 'Moderate Drizzle',
        description: 'Steady fine rain droplets',
        icon: 'CloudDrizzle',
        category: 'rain',
      };
    case 55:
      return {
        label: 'Dense Drizzle',
        description: 'Heavy damp mist and drizzle',
        icon: 'CloudDrizzle',
        category: 'rain',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Sub-zero freezing mist droplets',
        icon: 'CloudHail',
        category: 'rain',
      };
    case 61:
      return {
        label: 'Slight Rain',
        description: 'Scattered light rain showers',
        icon: 'CloudRain',
        category: 'rain',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Continuous moderate rainfall',
        icon: 'CloudRain',
        category: 'rain',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Substantial downpour and wet conditions',
        icon: 'CloudRainWind',
        category: 'rain',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Icy rain creating slick surfaces',
        icon: 'CloudHail',
        category: 'rain',
      };
    case 71:
      return {
        label: 'Light Snow',
        description: 'Gentle fluttering snow flurries',
        icon: 'Snowflake',
        category: 'snow',
      };
    case 73:
      return {
        label: 'Moderate Snow',
        description: 'Steady snowfall accumulating on surfaces',
        icon: 'Snowflake',
        category: 'snow',
      };
    case 75:
      return {
        label: 'Heavy Snow',
        description: 'Dense snowfall and winter weather',
        icon: 'Snowflake',
        category: 'snow',
      };
    case 77:
      return {
        label: 'Snow Grains',
        description: 'Crisp frozen snow pellets',
        icon: 'Snowflake',
        category: 'snow',
      };
    case 80:
      return {
        label: 'Light Showers',
        description: 'Passing brief rain showers',
        icon: 'CloudSunRain',
        category: 'rain',
      };
    case 81:
      return {
        label: 'Passing Showers',
        description: 'Periodic brisk downpours',
        icon: 'CloudRain',
        category: 'rain',
      };
    case 82:
      return {
        label: 'Torrential Showers',
        description: 'Sudden intense rain squalls',
        icon: 'CloudRainWind',
        category: 'rain',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Gusty winter precipitation showers',
        icon: 'Snowflake',
        category: 'snow',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Electrical storm with gusty squalls',
        icon: 'CloudLightning',
        category: 'thunder',
      };
    case 96:
    case 99:
      return {
        label: 'Severe Thunderstorm',
        description: 'Thunderstorm with dangerous hail and squalls',
        icon: 'CloudLightning',
        category: 'thunder',
      };
    default:
      return {
        label: 'Partly Cloudy',
        description: 'Scattered clouds and pleasant air',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'cloudy',
      };
  }
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function getTemperatureValue(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPressure(hpa: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    const inHg = (hpa * 0.02953).toFixed(2);
    return `${inHg} inHg`;
  }
  return `${Math.round(hpa)} hPa`;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function getUvCategory(uvIndex: number): { label: string; colorClass: string; desc: string } {
  if (uvIndex < 3) {
    return { label: 'Low', colorClass: 'text-emerald-400', desc: 'No special protection needed' };
  } else if (uvIndex < 6) {
    return { label: 'Moderate', colorClass: 'text-amber-400', desc: 'Wear sunscreen and sunglasses' };
  } else if (uvIndex < 8) {
    return { label: 'High', colorClass: 'text-orange-400', desc: 'Protection essential during peak hours' };
  } else if (uvIndex < 11) {
    return { label: 'Very High', colorClass: 'text-rose-400', desc: 'Avoid midday direct exposure' };
  }
  return { label: 'Extreme', colorClass: 'text-purple-400', desc: 'Stay indoors if possible' };
}

export function getHumidityAssessment(humidity: number): string {
  if (humidity < 30) return 'Dry air';
  if (humidity <= 55) return 'Comfortable';
  if (humidity <= 65) return 'Pleasant';
  if (humidity <= 80) return 'Humid';
  return 'Very humid';
}

export function formatHourTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  } catch {
    return isoString.slice(11, 16);
  }
}

export function formatDayLabel(isoDateString: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  try {
    const date = new Date(`${isoDateString}T12:00:00`);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return isoDateString;
  }
}

export function formatFullDate(isoDateString: string): string {
  try {
    const date = new Date(`${isoDateString}T12:00:00`);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return isoDateString;
  }
}

export function formatSunTime(isoString?: string): string {
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return isoString.slice(11, 16);
  }
}

/**
 * Returns atmospheric background classes matching the current weather condition
 */
export function getWeatherAtmosphereClasses(weatherCode: number, isDay: boolean): {
  containerBg: string;
  glowColor: string;
  borderAccent: string;
  badgeBg: string;
} {
  const details = getWeatherDetails(weatherCode, isDay);
  if (!isDay) {
    return {
      containerBg: 'from-slate-900/80 via-indigo-950/40 to-slate-900/90',
      glowColor: 'bg-indigo-500/10',
      borderAccent: 'border-indigo-500/20',
      badgeBg: 'bg-indigo-500/15 text-indigo-300',
    };
  }

  switch (details.category) {
    case 'clear':
      return {
        containerBg: 'from-sky-950/70 via-blue-900/30 to-slate-900/90',
        glowColor: 'bg-amber-400/10',
        borderAccent: 'border-amber-400/20',
        badgeBg: 'bg-amber-400/15 text-amber-300',
      };
    case 'rain':
      return {
        containerBg: 'from-cyan-950/80 via-slate-900/60 to-slate-950/90',
        glowColor: 'bg-cyan-500/10',
        borderAccent: 'border-cyan-500/20',
        badgeBg: 'bg-cyan-500/15 text-cyan-300',
      };
    case 'snow':
      return {
        containerBg: 'from-sky-950/60 via-slate-900/60 to-slate-950/90',
        glowColor: 'bg-sky-300/10',
        borderAccent: 'border-sky-300/20',
        badgeBg: 'bg-sky-300/15 text-sky-200',
      };
    case 'thunder':
      return {
        containerBg: 'from-purple-950/80 via-slate-900/70 to-slate-950/90',
        glowColor: 'bg-purple-500/15',
        borderAccent: 'border-purple-400/25',
        badgeBg: 'bg-purple-500/20 text-purple-300',
      };
    case 'fog':
      return {
        containerBg: 'from-slate-900/90 via-zinc-900/50 to-slate-950/90',
        glowColor: 'bg-slate-400/10',
        borderAccent: 'border-slate-500/20',
        badgeBg: 'bg-slate-500/20 text-slate-300',
      };
    case 'cloudy':
    default:
      return {
        containerBg: 'from-slate-900/80 via-sky-950/30 to-slate-950/90',
        glowColor: 'bg-sky-500/10',
        borderAccent: 'border-sky-500/20',
        badgeBg: 'bg-sky-500/15 text-sky-300',
      };
  }
}
