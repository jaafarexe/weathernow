import React from 'react';
import {
  Sun,
  Moon,
  SunMedium,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudHail,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Snowflake,
  Wind,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  const props = { className, size };

  switch (name) {
    case 'Sun':
      return <Sun {...props} className={`text-amber-400 ${className}`} />;
    case 'SunMedium':
      return <SunMedium {...props} className={`text-amber-300 ${className}`} />;
    case 'Moon':
      return <Moon {...props} className={`text-indigo-200 ${className}`} />;
    case 'CloudSun':
      return <CloudSun {...props} className={`text-sky-300 ${className}`} />;
    case 'CloudMoon':
      return <CloudMoon {...props} className={`text-indigo-300 ${className}`} />;
    case 'Cloud':
      return <Cloud {...props} className={`text-slate-300 ${className}`} />;
    case 'CloudRain':
    case 'CloudSunRain':
      return <CloudRain {...props} className={`text-sky-400 ${className}`} />;
    case 'CloudRainWind':
      return <CloudRain {...props} className={`text-cyan-400 ${className}`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} className={`text-sky-300 ${className}`} />;
    case 'CloudHail':
      return <CloudHail {...props} className={`text-cyan-200 ${className}`} />;
    case 'CloudSnow':
      return <CloudSnow {...props} className={`text-blue-100 ${className}`} />;
    case 'Snowflake':
      return <Snowflake {...props} className={`text-blue-200 ${className}`} />;
    case 'CloudLightning':
      return <CloudLightning {...props} className={`text-amber-300 ${className}`} />;
    case 'CloudFog':
      return <CloudFog {...props} className={`text-slate-400 ${className}`} />;
    case 'Wind':
      return <Wind {...props} className={`text-slate-300 ${className}`} />;
    default:
      return <Sun {...props} className={`text-amber-400 ${className}`} />;
  }
};
