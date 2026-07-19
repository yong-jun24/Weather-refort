export interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  localtime: string;
}

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface AirQuality {
  co?: number;
  no2?: number;
  o3?: number;
  pm2_5?: number;
  pm10?: number;
  "us-epa-index"?: number;
}

export interface CurrentWeather {
  last_updated: string;
  temp_c: number;
  is_day: number;
  condition: WeatherCondition;
  wind_kph: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  uv: number;
  air_quality?: AirQuality;
}

export interface ForecastHour {
  time: string;
  temp_c: number;
  condition: WeatherCondition;
  humidity: number;
  chance_of_rain: number;
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    daily_chance_of_rain: number;
    condition: WeatherCondition;
    uv: number;
  };
  astro: {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
  };
  hour: ForecastHour[];
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  forecast: {
    forecastday: ForecastDay[];
  };
  aiSummary?: string;
  isPreview: boolean;
}

export interface PopularCity {
  id: string;
  nameKr: string;
  nameEn: string;
  description: string;
}
