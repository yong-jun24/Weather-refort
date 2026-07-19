import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client if API key is provided
let aiClient: GoogleGenAI | null = null;
const rawGeminiKey = process.env.GEMINI_API_KEY;
const cleanGeminiKey = rawGeminiKey ? rawGeminiKey.replace(/['"]/g, "").trim() : "";

if (cleanGeminiKey && cleanGeminiKey !== "MY_GEMINI_API_KEY") {
  try {
    aiClient = new GoogleGenAI({
      apiKey: cleanGeminiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini Client successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
}

// Simple string hash to generate consistent pseudo-random values for any search query
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Generate realistic mock weather data if API key is not provided
function generateMockWeather(query: string): any {
  const seed = hashCode(query.toLowerCase().trim());
  const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);
  
  // Base values depending on query
  let baseTemp = 24 + (seed % 9); // 24 to 32 degrees C (Typical July Summer)
  let conditionCode = 1000; // Clear
  let conditionText = "맑음";
  let conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
  let isRainy = (seed % 3) === 0;
  let isCloudy = (seed % 3) === 1;

  if (isRainy) {
    conditionCode = 1189; // Moderate rain
    conditionText = "흐리고 비";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/302.png";
    baseTemp = 22 + (seed % 5); // Cooler when raining
  } else if (isCloudy) {
    conditionCode = 1003; // Partly cloudy
    conditionText = "구름 많음";
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/116.png";
  }

  const humidity = 60 + (seed % 31); // 60% to 90% (Humid in July)
  const windKph = 5 + (seed % 16); // 5 to 20 kph
  const pressureMb = 1005 + (seed % 11);
  const feelsLike = baseTemp + (humidity > 75 ? 2 : 0);
  const uv = isRainy ? 1 + (seed % 2) : 5 + (seed % 6);

  // Core Location
  const location = {
    name: formattedQuery,
    region: query.toLowerCase().includes("seoul") ? "Seoul" : "Province",
    country: "South Korea",
    lat: 35.0 + (seed % 300) / 100,
    lon: 126.0 + (seed % 300) / 100,
    localtime: new Date().toISOString().slice(0, 16).replace("T", " "),
  };

  // Adjust coordinates for international cities in mock data
  if (formattedQuery.includes("Jeju") || formattedQuery.includes("제주")) {
    location.name = "제주";
    location.region = "제주특별자치도";
    location.country = "대한민국";
  } else if (formattedQuery.includes("Seoul") || formattedQuery.includes("서울")) {
    location.name = "서울";
    location.region = "서울특별시";
    location.country = "대한민국";
  } else if (formattedQuery.includes("Busan") || formattedQuery.includes("부산")) {
    location.name = "부산";
    location.region = "부산광역시";
    location.country = "대한민국";
  } else if (formattedQuery.includes("Tokyo") || formattedQuery.includes("도쿄")) {
    location.name = "도쿄";
    location.region = "Tokyo";
    location.country = "일본";
    baseTemp = 26 + (seed % 6);
  } else if (formattedQuery.includes("New York") || formattedQuery.includes("뉴욕")) {
    location.name = "뉴욕";
    location.region = "New York";
    location.country = "미국";
  } else if (formattedQuery.includes("London") || formattedQuery.includes("런던")) {
    location.name = "런던";
    location.region = "Greater London";
    location.country = "영국";
    baseTemp = 18 + (seed % 7); // Cooler in London
  } else if (formattedQuery.includes("Paris") || formattedQuery.includes("파리")) {
    location.name = "파리";
    location.region = "Ile-de-France";
    location.country = "프랑스";
    baseTemp = 22 + (seed % 6);
  }

  // Air Quality
  const air_quality = {
    co: 200 + (seed % 100),
    no2: 10 + (seed % 20),
    o3: 30 + (seed % 40),
    pm2_5: 8 + (seed % 35),
    pm10: 15 + (seed % 50),
    "us-epa-index": (seed % 3) + 1,
  };

  // 3-Day Forecast
  const forecastday = Array.from({ length: 3 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const dateStr = date.toISOString().split("T")[0];

    const daySeed = seed + index;
    const maxTemp = baseTemp + (daySeed % 3) + 1;
    const minTemp = baseTemp - (daySeed % 3) - 3;
    const isForecastRainy = (daySeed % 3) === 0;
    
    let dayConditionText = "맑음";
    let dayConditionIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
    let dayConditionCode = 1000;

    if (isForecastRainy) {
      dayConditionText = "비";
      dayConditionIcon = "//cdn.weatherapi.com/weather/64x64/day/302.png";
      dayConditionCode = 1189;
    } else if ((daySeed % 3) === 1) {
      dayConditionText = "구름 많음";
      dayConditionIcon = "//cdn.weatherapi.com/weather/64x64/day/116.png";
      dayConditionCode = 1003;
    }

    // Hourly Forecast for the day
    const hour = Array.from({ length: 24 }).map((_, h) => {
      const tempDiff = -4 * Math.cos(((h - 5) * Math.PI) / 12); // Cooler at night, warmer in afternoon
      const hourTemp = Math.round(((maxTemp + minTemp) / 2) + tempDiff);
      
      let hrConditionText = dayConditionText;
      let hrConditionIcon = dayConditionIcon;
      let hrConditionCode = dayConditionCode;

      if (h < 6 || h > 19) {
        // Night icons
        if (dayConditionCode === 1000) {
          hrConditionText = "맑음 (밤)";
          hrConditionIcon = "//cdn.weatherapi.com/weather/64x64/night/113.png";
        } else if (dayConditionCode === 1003) {
          hrConditionText = "구름 많음 (밤)";
          hrConditionIcon = "//cdn.weatherapi.com/weather/64x64/night/116.png";
        }
      }

      return {
        time: `${dateStr} ${String(h).padStart(2, "0")}:00`,
        temp_c: hourTemp,
        condition: {
          text: hrConditionText,
          icon: hrConditionIcon,
          code: hrConditionCode,
        },
        humidity: Math.max(40, Math.min(100, humidity + Math.round(tempDiff * -2))),
        chance_of_rain: isForecastRainy ? (h > 12 ? 80 : 40) : 10,
      };
    });

    return {
      date: dateStr,
      day: {
        maxtemp_c: maxTemp,
        mintemp_c: minTemp,
        avgtemp_c: Math.round((maxTemp + minTemp) / 2),
        maxwind_kph: windKph + (daySeed % 5),
        totalprecip_mm: isForecastRainy ? 5.5 + (daySeed % 10) : 0,
        daily_chance_of_rain: isForecastRainy ? 85 : 15,
        condition: {
          text: dayConditionText,
          icon: dayConditionIcon,
          code: dayConditionCode,
        },
        uv: Math.max(1, uv + (daySeed % 3) - 1),
      },
      astro: {
        sunrise: "오전 05:24",
        sunset: "오후 07:42",
        moonrise: "오후 08:15",
        moonset: "오전 06:12",
      },
      hour,
    };
  });

  return {
    location,
    current: {
      last_updated: location.localtime,
      temp_c: baseTemp,
      is_day: new Date().getHours() >= 6 && new Date().getHours() < 20 ? 1 : 0,
      condition: {
        text: conditionText,
        icon: conditionIcon,
        code: conditionCode,
      },
      wind_kph: windKph,
      wind_dir: "남남서",
      pressure_mb: pressureMb,
      precip_mm: isRainy ? 2.5 : 0,
      humidity: humidity,
      cloud: isRainy ? 90 : isCloudy ? 60 : 10,
      feelslike_c: feelsLike,
      uv: uv,
      air_quality,
    },
    forecast: {
      forecastday,
    },
    isPreview: true,
  };
}

// Generate personalized, friendly AI summary using Gemini 3.5 Flash
async function getAISummary(weatherData: any): Promise<string> {
  if (!aiClient) {
    return "Gemini API 키가 설정되지 않아 AI 요약을 제공할 수 없습니다. 설정에서 API 키를 추가해 주세요.";
  }

  const { location, current, forecast } = weatherData;
  const prompt = `
당신은 친절하고 전문적인 기상 캐스터이자 날씨 상담사입니다.
제공된 날씨 정보를 바탕으로 사용자에게 오늘 날씨 정보와 내일 예보를 한눈에 이해하기 쉽게 요약해주고, 날씨에 따른 맞춤형 라이프스타일 조언(추천 의상, 활동 추천, 미세먼지 대비, 건강 관리법 등)을 3줄~4줄 정도의 명확하고 기분 좋은 존댓말(한국어)로 답변해 주세요.

[현재 날씨 정보]
- 지역: ${location.country} ${location.region} ${location.name}
- 현재 기온: ${current.temp_c}°C (체감온도 ${current.feelslike_c}°C)
- 날씨 상태: ${current.condition.text}
- 습도: ${current.humidity}%
- 풍속: ${current.wind_kph} km/h
- 미세먼지(PM10): ${current.air_quality?.pm10 || '정보없음'} ㎍/㎥, 초미세먼지(PM2.5): ${current.air_quality?.pm2_5 || '정보없음'} ㎍/㎥

[오늘/내일 예보]
- 오늘 최고/최저 기온: ${forecast.forecastday[0].day.maxtemp_c}°C / ${forecast.forecastday[0].day.mintemp_c}°C
- 오늘 강수 확률: ${forecast.forecastday[0].day.daily_chance_of_rain}%
- 내일 예보: ${forecast.forecastday[1].day.condition.text} (${forecast.forecastday[1].day.maxtemp_c}°C / ${forecast.forecastday[1].day.mintemp_c}°C)
`;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    return response.text || "오늘의 멋진 하루를 시작하세요!";
  } catch (err) {
    console.error("Error generating AI weather summary:", err);
    return "날씨 정보를 요약하는 중 오류가 발생했습니다. 상쾌한 하루 보내세요!";
  }
}

// REST API for Weather data
app.get("/api/weather", async (req, res) => {
  const query = (req.query.q as string) || "Seoul";
  const rawApiKey = process.env.WEATHER_API_KEY;
  const apiKey = rawApiKey ? rawApiKey.replace(/['"]/g, "").trim() : "";

  let weatherData: any;
  let isPreviewMode = false;
  let apiKeyError: string | null = null;

  if (apiKey && apiKey !== "") {
    try {
      // Fetch data from real WeatherAPI.com
      // Supported parameters: days=3, aqi=yes, alerts=no, lang=ko (Korean translations!)
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(query)}&days=3&aqi=yes&alerts=no&lang=ko`;
      const response = await fetch(url);
      
      if (!response.ok) {
        let errorMsg = `HTTP Error ${response.status}`;
        try {
          const errorJson = await response.json();
          if (errorJson?.error?.message) {
            errorMsg = errorJson.error.message;
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }
      
      const data = await response.json();
      weatherData = {
        location: {
          name: data.location.name,
          region: data.location.region,
          country: data.location.country,
          lat: data.location.lat,
          lon: data.location.lon,
          localtime: data.location.localtime,
        },
        current: {
          last_updated: data.current.last_updated,
          temp_c: data.current.temp_c,
          is_day: data.current.is_day,
          condition: {
            text: data.current.condition.text,
            icon: data.current.condition.icon,
            code: data.current.condition.code,
          },
          wind_kph: data.current.wind_kph,
          wind_dir: data.current.wind_dir,
          pressure_mb: data.current.pressure_mb,
          precip_mm: data.current.precip_mm,
          humidity: data.current.humidity,
          cloud: data.current.cloud,
          feelslike_c: data.current.feelslike_c,
          uv: data.current.uv,
          air_quality: data.current.air_quality ? {
            co: data.current.air_quality.co,
            no2: data.current.air_quality.no2,
            o3: data.current.air_quality.o3,
            pm2_5: data.current.air_quality.pm2_5,
            pm10: data.current.air_quality.pm10,
            "us-epa-index": data.current.air_quality["us-epa-index"],
          } : undefined,
        },
        forecast: {
          forecastday: data.forecast.forecastday.map((day: any) => ({
            date: day.date,
            day: {
              maxtemp_c: day.day.maxtemp_c,
              mintemp_c: day.day.mintemp_c,
              avgtemp_c: day.day.avgtemp_c,
              maxwind_kph: day.day.maxwind_kph,
              totalprecip_mm: day.day.totalprecip_mm,
              daily_chance_of_rain: day.day.daily_chance_of_rain || day.day.daily_chance_of_showers || 0,
              condition: {
                text: day.day.condition.text,
                icon: day.day.condition.icon,
                code: day.day.condition.code,
              },
              uv: day.day.uv,
            },
            astro: {
              sunrise: day.astro.sunrise,
              sunset: day.astro.sunset,
              moonrise: day.astro.moonrise,
              moonset: day.astro.moonset,
            },
            hour: day.hour.map((hr: any) => ({
              time: hr.time,
              temp_c: hr.temp_c,
              condition: {
                text: hr.condition.text,
                icon: hr.condition.icon,
                code: hr.condition.code,
              },
              humidity: hr.humidity,
              chance_of_rain: hr.chance_of_rain || hr.chance_of_showers || 0,
            })),
          })),
        },
        isPreview: false,
      };
    } catch (err: any) {
      console.error("Failed to fetch from real WeatherAPI.com, falling back to mock generator:", err);
      weatherData = generateMockWeather(query);
      isPreviewMode = true;
      apiKeyError = err.message || "알 수 없는 기상 API 오류";
    }
  } else {
    weatherData = generateMockWeather(query);
    isPreviewMode = true;
  }

  // Generate Gemini Weather Summary
  try {
    const aiSummary = await getAISummary(weatherData);
    weatherData.aiSummary = aiSummary;
  } catch (error) {
    console.error("Gemini summary error:", error);
    weatherData.aiSummary = "날씨 분석 서비스를 로드할 수 없습니다.";
  }

  // Force isPreview flag if we triggered mock mode
  if (isPreviewMode) {
    weatherData.isPreview = true;
  }

  // Attach key presence & errors
  weatherData.hasApiKey = !!(apiKey && apiKey !== "");
  if (apiKeyError) {
    weatherData.apiKeyError = apiKeyError;
  }

  res.json(weatherData);
});

// Vite/Build Setup
if (process.env.NODE_ENV !== "production") {
  createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  }).then((vite) => {
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Development full-stack server running on http://localhost:${PORT}`);
    });
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Production full-stack server running on port ${PORT}`);
  });
}
