import { CityLocation, OpenMeteoWeatherResponse, RawGeocodingResult } from '../types/weather';

export const POPULAR_CITIES: CityLocation[] = [
  {
    id: 2643743,
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    admin1: 'England',
    latitude: 51.5085,
    longitude: -0.1257,
    timezone: 'Europe/London',
  },
  {
    id: 5128581,
    name: 'New York',
    country: 'United States',
    countryCode: 'US',
    admin1: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  },
  {
    id: 1850147,
    name: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    admin1: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 2988507,
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    admin1: 'Île-de-France',
    latitude: 48.8534,
    longitude: 2.3488,
    timezone: 'Europe/Paris',
  },
  {
    id: 5391959,
    name: 'San Francisco',
    country: 'United States',
    countryCode: 'US',
    admin1: 'California',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 2147714,
    name: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    admin1: 'New South Wales',
    latitude: -33.8678,
    longitude: 151.2073,
    timezone: 'Australia/Sydney',
  },
];

export async function searchCities(query: string): Promise<CityLocation[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=8&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding failed with status ${res.status}`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return (data.results as RawGeocodingResult[]).map((item) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      countryCode: item.country_code,
      admin1: item.admin1,
      timezone: item.timezone || 'auto',
    }));
  } catch (err) {
    console.error('Error querying Open-Meteo Geocoding API:', err);
    throw err;
  }
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  timezone: string = 'auto'
): Promise<OpenMeteoWeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: timezone || 'auto',
    forecast_days: '7',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather forecast request failed with status: ${res.status}`);
  }

  const data: OpenMeteoWeatherResponse = await res.json();
  return data;
}

export async function reverseGeocodeCoords(lat: number, lon: number): Promise<CityLocation> {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (res.ok) {
      const data = await res.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
      return {
        id: Date.now(),
        name: cityName,
        country: data.countryName,
        countryCode: data.countryCode,
        admin1: data.principalSubdivision,
        latitude: lat,
        longitude: lon,
        timezone: 'auto',
      };
    }
  } catch (e) {
    console.warn('Reverse geocode fallback failed:', e);
  }

  return {
    id: Date.now(),
    name: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
    latitude: lat,
    longitude: lon,
    timezone: 'auto',
  };
}
