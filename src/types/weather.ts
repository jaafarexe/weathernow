export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface CityLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  countryCode?: string;
  admin1?: string;
  timezone?: string;
}

export interface RawGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface OpenMeteoWeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation?: string;
  elevation: number;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
  };
}

export interface HourlyForecastPoint {
  time: string;
  formattedTime: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitationProbability: number;
  weatherCode: number;
  windSpeed: number;
  isDay: boolean;
}

export interface DailyForecastPoint {
  date: string;
  dayLabel: string;
  fullDateLabel: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  uvIndexMax: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherConditionInfo {
  label: string;
  description: string;
  iconName: string;
  themeStyle: {
    bgGradient: string;
    cardBg: string;
    accentGlow: string;
    badgeColor: string;
  };
}
