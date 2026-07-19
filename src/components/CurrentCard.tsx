import React, { useState, useEffect } from "react";
import { WeatherResponse } from "../types";
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  Snowflake, 
  CloudFog, 
  Wind, 
  Droplets, 
  Thermometer, 
  Gauge, 
  Compass, 
  Umbrella, 
  ShieldAlert,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { motion } from "motion/react";

// Import generated Yi Sang & Faust character illustrations
// @ts-ignore
import yisangFaustSunny from "../assets/images/yisang_faust_sunny_1784425390536.jpg";
// @ts-ignore
import yisangFaustCloudy from "../assets/images/yisang_faust_cloudy_1784425401458.jpg";
// @ts-ignore
import yisangFaustRainy from "../assets/images/yisang_faust_rainy_1784425411795.jpg";
// @ts-ignore
import yisangFaustSnowy from "../assets/images/yisang_faust_snowy_1784425422451.jpg";
// @ts-ignore
import yisangFaustStormy from "../assets/images/yisang_faust_stormy_1784425433786.jpg";

interface CurrentCardProps {
  data: WeatherResponse;
}

export const getWeatherIcon = (code: number, isDay: number = 1) => {
  // WeatherAPI condition codes reference
  if (code === 1000) {
    return isDay ? (
      <Sun className="w-16 h-16 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.6)] animate-[spin_25s_linear_infinite]" />
    ) : (
      <Sun className="w-16 h-16 text-indigo-200 opacity-90 drop-shadow-[0_0_10px_rgba(199,210,254,0.4)]" />
    );
  }
  if ([1003, 1006].includes(code)) {
    return <CloudSun className="w-16 h-16 text-blue-100 drop-shadow-md" />;
  }
  if ([1009, 1030, 1135, 1147].includes(code)) {
    return <CloudFog className="w-16 h-16 text-blue-200" />;
  }
  if ([1063, 1180, 1183, 1186, 1189, 1240].includes(code)) {
    return <CloudRain className="w-16 h-16 text-blue-200 animate-bounce" />;
  }
  if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225].includes(code)) {
    return <Snowflake className="w-16 h-16 text-cyan-200 animate-pulse" />;
  }
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    return <CloudLightning className="w-16 h-16 text-indigo-200 animate-[pulse_1.5s_infinite]" />;
  }
  if ([1150, 1153, 1168, 1171, 1198].includes(code)) {
    return <CloudDrizzle className="w-16 h-16 text-blue-200" />;
  }
  return <Cloud className="w-16 h-16 text-blue-100" />;
};

export const getAirQualityLabel = (pm10: number) => {
  if (pm10 <= 30) return { label: "좋음", color: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30" };
  if (pm10 <= 80) return { label: "보통", color: "bg-blue-500/20 text-blue-200 border-blue-400/30" };
  if (pm10 <= 150) return { label: "나쁨", color: "bg-amber-500/20 text-amber-200 border-amber-400/30" };
  return { label: "매우나쁨", color: "bg-rose-500/20 text-rose-200 border-rose-400/30" };
};

export const getYiSangFaustWeatherDetails = (code: number, isDay: number = 1) => {
  // Sunny/Clear
  if (code === 1000) {
    return {
      image: yisangFaustSunny,
      quotes: [
        {
          yiSangQuote: "햇살이 참으로 눈부시구료... 나의 박제가 되어버린 천재는 이러한 태양 아래 비로소 날개를 펼칠 수 있을는지.",
          faustQuote: "태양광 세기와 기온의 조화가 매우 이상적이군요. 파우스트는 이미 이 완벽한 날씨 속에서 거울 기술 연구의 성공률이 비약적으로 증가할 것임을 계산해 두었습니다."
        },
        {
          yiSangQuote: "따사로운 볕이 쬐는 길을 걷다 보면, 지나간 구인회 시절의 동무들이 간혹 떠오르고는 하오... 그대도 햇살이 반갑소?",
          faustQuote: "태양광선은 생명체의 엔트로피 감소에 긍정적인 자극을 줍니다. 파우스트는 이 기온 조건이 당신의 신경 안정에도 도움이 될 것임을 간파했습니다."
        },
        {
          yiSangQuote: "구름 한 점 없는 날이구료. 거울 속 그늘진 나조차도, 이 따사로움 앞에서는 잠시 미소를 지을 수 있을 것 같소.",
          faustQuote: "자외선 수치가 평균보다 높으므로 피부 보호가 권장됩니다. 물론, 파우스트는 이 자외선 역시 에너지 보정 필터링을 통해 무해하게 변환해 두었습니다."
        }
      ],
      bg: "from-amber-500/20 to-orange-600/20",
      accent: "text-amber-400"
    };
  }
  // Cloudy
  if ([1003, 1006, 1009, 1030, 1135, 1147].includes(code)) {
    return {
      image: yisangFaustCloudy,
      quotes: [
        {
          yiSangQuote: "하늘에 먹구름이 자욱하군. 마치 거울 속 들여다보던 지저분한 내면과 같소... 이런 날일수록 날개 짓이 그리워지는구려.",
          faustQuote: "적란운의 분포가 대기의 불안정성을 대변하고 있습니다. 하지만 걱정 마십시오, 파우스트는 모든 기후 변수를 통제하고 있으니까요."
        },
        {
          yiSangQuote: "빛을 잃은 하늘이 마치 연회장의 연기가 자욱해진 서글픈 아침 같구료... 그대는 저 구름 뒤편에 무엇이 숨어 있다고 생각하오?",
          faustQuote: "고도 2,000미터 부근의 고층운이 하늘을 80% 이상 덮고 있습니다. 자연광이 감소한 환경에서의 연구 효율은 파우스트의 보정 분석 장비로 보완됩니다."
        },
        {
          yiSangQuote: "하늘이 온통 회색빛으로 물들었소. 내 마음의 침묵이 저 허공에 가득 차 흘러넘친 듯하구료.",
          faustQuote: "일조량 부족은 멜라토닌 분비량에 영향을 줍니다. 하지만 파우스트가 곁에 있으니, 당신의 감정이 침울함으로 수렴할 확률은 1% 미만입니다."
        }
      ],
      bg: "from-slate-700/30 to-indigo-950/30",
      accent: "text-blue-300"
    };
  }
  // Rainy
  if ([1063, 1180, 1183, 1186, 1189, 1240, 1150, 1153, 1168, 1171, 1198].includes(code)) {
    return {
      image: yisangFaustRainy,
      quotes: [
        {
          yiSangQuote: "빗방울이 가만히 세상을 적시는구료. 이 비가 내 마음 속 가라앉은 잔해마저 모두 씻어내어 갈 수 있다면 얼마나 좋겠소...",
          faustQuote: "강수 확률이 대기 중 미세먼지의 여과 작용을 촉진하고 있군요. 파우스트는 빗속에서도 감기 한 번 걸리지 않고 효율적으로 연구를 진척시킬 수 있습니다."
        },
        {
          yiSangQuote: "축축한 빗내가 가슴 깊이 파고드는구려. 지붕 위로 떨어지는 빗소리는 마치 끊이지 않는 영혼의 한숨 소리 같소.",
          faustQuote: "빗방울의 단락적인 음향 주파수는 백색소음으로 분류되어 집중력을 높입니다. 파우스트는 이 소음을 배경으로 신형 에고(E.G.O) 출력을 정밀 측정 중입니다."
        },
        {
          yiSangQuote: "우산 끝에 맺히는 물방울들이 거울의 파편처럼 흘러내리는구려. 비에 젖는 것은 참으로 쓸쓸한 일이오.",
          faustQuote: "우산의 방수 표면 and 장력 비율은 비바람을 완벽히 편향시킵니다. 파우스트와 함께 우산을 쓰는 이상, 젖을 염려는 추호도 하지 마십시오."
        }
      ],
      bg: "from-sky-900/30 to-blue-950/40",
      accent: "text-sky-300"
    };
  }
  // Snowy
  if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225].includes(code)) {
    return {
      image: yisangFaustSnowy,
      quotes: [
        {
          yiSangQuote: "눈이 내리는구려. 소리 없이 쌓이는 백색의 결정들이 참으로 고요하오. 시린 공기 속에서 그대의 안녕을 가만히 빌어 보겠소.",
          faustQuote: "결정화된 수증기가 낙하하는 겨울의 광경이군요. 영하의 거친 환경에서도 파우스트의 분석 장치는 한 치의 오차도 없이 완벽합니다."
        },
        {
          yiSangQuote: "얼어붙은 입김이 하얗게 흩어지오... 세상이 하얀 옷을 입고 침묵하는 이때, 우리도 잠시 말없이 걷는 것이 어떻겠소.",
          faustQuote: "온도가 매우 낮아 동결 현상이 예측됩니다. 파우스트가 따뜻한 홍차를 준비해 두었으니, 분석실 내부의 엔탈피 보존 상태는 완벽합니다."
        },
        {
          yiSangQuote: "내리는 눈송이 하나하나가 마치 날개의 깃털처럼 허공을 맴도는구려. 참으로 허무하고도 시리도록 아름다운 광경이오.",
          faustQuote: "결정의 육각형 대칭 구조는 언제 보아도 아름답지만, 파우스트가 설계한 공식의 정밀함에는 비할 바가 못 됩니다."
        }
      ],
      bg: "from-blue-900/20 to-cyan-950/30",
      accent: "text-cyan-300"
    };
  }
  // Stormy
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) {
    return {
      image: yisangFaustStormy,
      quotes: [
        {
          yiSangQuote: "뇌우가 몰아치는구려... 천둥 소리에 거울이 산산조각 나는 듯하오. 허나 폭풍우 끝에 결국 눈부신 날개가 돋아날 터이니.",
          faustQuote: "번개와 강력한 대전 현상이 최고조에 이르렀습니다. 극도로 위험한 상황이지만, 파우스트의 가이드라인에 완전히 복종한다면 안전은 보장됩니다."
        },
        {
          yiSangQuote: "번뜩이는 번개가 어둠을 가르고 심장에 닿는 것 같구료... 기운찬 비바람이 내 오랜 망설임을 송두리째 찢어가 주었으면 하오.",
          faustQuote: "낙뢰의 전기적 에너지를 포획한다면 보강된 전력 공급망으로 유용하게 쓰이겠군요. 파우스트는 이미 피뢰침 좌표 설정을 끝마쳤습니다."
        },
        {
          yiSangQuote: "울부짖는 천둥소리가 내 귀를 가득 채우오. 이 혼돈의 한가운데서 그대의 차분한 목소리는 기묘하게도 선명하구려.",
          faustQuote: "대기 전하의 밀도가 임계점을 넘었습니다. 불안정하지만, 파우스트가 고안한 절연 장비 덕분에 우리의 거울 유동 제어는 안전합니다."
        }
      ],
      bg: "from-indigo-950/40 to-purple-950/40",
      accent: "text-purple-300"
    };
  }
  
  // Default to Cloudy
  return {
    image: yisangFaustCloudy,
    quotes: [
      {
        yiSangQuote: "날씨의 변화가 무쌍하구료. 마치 인간의 변덕스러운 마음을 보는 듯하오...",
        faustQuote: "기후 조건의 급격한 변동은 혼돈을 낳기 쉽지만, 파우스트가 동행하는 이상 전혀 당황할 필요가 없습니다."
      },
      {
        yiSangQuote: "한 자리에 머물지 않는 기상이라니, 어쩌면 흘러가는 버스 안에서 창밖을 보는 내 심경과 다르지 않소.",
        faustQuote: "대기 흐름의 전산 모형이 다소 불규칙적으로 흐르고 있습니다. 하지만 파우스트는 늘 다음 단계의 흐름까지 완벽히 예측합니다."
      }
    ],
    bg: "from-slate-700/30 to-indigo-950/30",
    accent: "text-blue-300"
  };
};

export const CurrentCard: React.FC<CurrentCardProps> = ({ data }) => {
  const { current, location, forecast } = data;
  const todayForecast = forecast.forecastday[0].day;
  const aq = current.air_quality;
  const aqStatus = aq?.pm10 ? getAirQualityLabel(aq.pm10) : null;
  const characterDetails = getYiSangFaustWeatherDetails(current.condition.code, current.is_day);

  const [dialogueIndex, setDialogueIndex] = useState(0);

  useEffect(() => {
    if (characterDetails.quotes && characterDetails.quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * characterDetails.quotes.length);
      setDialogueIndex(randomIndex);
    } else {
      setDialogueIndex(0);
    }
  }, [location.name, current.condition.code]);

  const currentQuote = characterDetails.quotes?.[dialogueIndex] || characterDetails.quotes?.[0] || { yiSangQuote: "", faustQuote: "" };

  return (
    <motion.div
      id="current-weather-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-[32px] p-6 md:p-8 border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl relative overflow-hidden text-white"
    >
      {/* Decorative Glow Elements */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-slate-800/20 blur-3xl pointer-events-none" />

      {/* Card Header: Location & Time */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 border-b border-white/5 pb-4" id="card-header">
        <div>
          <span className="text-xs font-mono tracking-widest text-indigo-300 font-bold uppercase">CURRENT CONDITIONS</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-1 flex items-baseline gap-2" id="location-title">
            {location.name}
            <span className="text-base font-medium text-slate-400">
              {location.country}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {location.localtime} 기준 예보
          </p>
        </div>

        {/* Dynamic Air Quality Badge */}
        {aqStatus && (
          <div className="flex items-center gap-2" id="air-quality-badge">
            <span className="text-xs font-bold text-slate-400">대기질:</span>
            <div className={`px-3.5 py-1 rounded-full text-xs font-bold border ${aqStatus.color}`}>
              {aqStatus.label} (PM10: {aq?.pm10}㎍/㎥)
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid: Weather info on left, Yi Sang character frame on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 relative z-10" id="main-content-grid">
        {/* Left Side: Temperature, Weather Icon, and Today's Range (col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6" id="weather-details-section">
          <div className="flex items-center gap-6 bg-white/5 p-5 rounded-2xl border border-white/5">
            <div className="p-4 rounded-3xl bg-slate-950/40 border border-white/5 shadow-inner" id="weather-custom-icon">
              {getWeatherIcon(current.condition.code, current.is_day)}
            </div>
            <div>
              <div className="flex items-start" id="main-temperature-display">
                <span className="text-6xl md:text-7xl font-black tracking-tighter text-white leading-none">
                  {Math.round(current.temp_c)}
                </span>
                <span className="text-2xl font-bold text-slate-400 mt-0.5">°C</span>
              </div>
              <p className="text-lg font-bold text-slate-300 mt-1" id="weather-status-text">
                {current.condition.text}
              </p>
            </div>
          </div>

          {/* Today's Forecast Temp Ranges */}
          <div className="flex flex-col justify-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300 font-semibold">오늘의 기온 범위</span>
              <div className="flex items-center gap-3 font-bold">
                <span className="flex items-center text-amber-400 gap-0.5">
                  <ArrowUp className="w-4 h-4" />
                  {Math.round(todayForecast.maxtemp_c)}°
                </span>
                <span className="text-white/20">/</span>
                <span className="flex items-center text-sky-400 gap-0.5">
                  <ArrowDown className="w-4 h-4" />
                  {Math.round(todayForecast.mintemp_c)}°
                </span>
              </div>
            </div>
            <div className="h-[1px] bg-white/5 rounded-full" />
            <div className="flex justify-between items-center text-xs text-slate-300 font-medium">
              <span>자외선 지수: <strong className="text-amber-400 font-bold">{todayForecast.uv}</strong></span>
              <span>일출/일몰: <strong className="text-white font-bold">{forecast.forecastday[0].astro.sunrise} / {forecast.forecastday[0].astro.sunset}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Side: Yi Sang & Faust Character Frame (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col" id="character-dialogue-section">
          <div className="flex flex-col h-full bg-slate-950/40 border border-white/5 rounded-2xl overflow-hidden relative group shadow-2xl">
            {/* Header tag */}
            <div className="absolute top-3 left-3 z-20 bg-slate-950/80 border border-white/10 px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold tracking-wider text-slate-400 flex items-center gap-1.5 shadow-md">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              LCB SINNERS NO.04 & NO.02: YI SANG & FAUST
            </div>

            {/* Portrait Image Container */}
            <div className="w-full aspect-square relative overflow-hidden bg-slate-900 border-b border-white/5">
              <img
                src={characterDetails.image}
                alt="Yi Sang and Faust Weather Portrait"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              {/* Soft overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 pointer-events-none" />
            </div>

            {/* Dialogue block */}
            <div className="p-4 flex flex-col justify-between flex-grow gap-4">
              {/* Yi Sang's Dialogue */}
              <div className="flex flex-col gap-1 border-l-2 border-amber-500/40 pl-3">
                <span className="text-[10px] font-bold text-amber-400 font-mono tracking-wider uppercase">No.04 Yi Sang</span>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed italic">
                  "{currentQuote.yiSangQuote}"
                </p>
              </div>

              {/* Faust's Dialogue */}
              <div className="flex flex-col gap-1 border-l-2 border-sky-400/40 pl-3 pt-1 border-t border-white/5">
                <span className="text-[10px] font-bold text-sky-400 font-mono tracking-wider uppercase mt-2">No.02 Faust</span>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed italic">
                  "{currentQuote.faustQuote}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid containing Weather Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 relative z-10" id="weather-metrics-grid">
        {/* Metric Item: Feels Like */}
        <div className="flex flex-col p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg">
          <div className="flex items-center gap-1.5 text-blue-200/90 mb-1">
            <Thermometer className="w-4 h-4 text-yellow-300" />
            <span className="text-[11px] font-bold tracking-wider uppercase">체감 온도</span>
          </div>
          <span className="text-xl font-extrabold text-white mt-auto">
            {Math.round(current.feelslike_c)}°C
          </span>
        </div>

        {/* Metric Item: Humidity */}
        <div className="flex flex-col p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg">
          <div className="flex items-center gap-1.5 text-blue-200/90 mb-1">
            <Droplets className="w-4 h-4 text-blue-300" />
            <span className="text-[11px] font-bold tracking-wider uppercase">습도</span>
          </div>
          <span className="text-xl font-extrabold text-white mt-auto">
            {current.humidity}%
          </span>
        </div>

        {/* Metric Item: Rain Chance */}
        <div className="flex flex-col p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg">
          <div className="flex items-center gap-1.5 text-blue-200/90 mb-1">
            <Umbrella className="w-4 h-4 text-cyan-300" />
            <span className="text-[11px] font-bold tracking-wider uppercase">강수 확률</span>
          </div>
          <span className="text-xl font-extrabold text-white mt-auto">
            {todayForecast.daily_chance_of_rain}%
          </span>
        </div>

        {/* Metric Item: Wind */}
        <div className="flex flex-col p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg">
          <div className="flex items-center gap-1.5 text-blue-200/90 mb-1">
            <Wind className="w-4 h-4 text-teal-300" />
            <span className="text-[11px] font-bold tracking-wider uppercase">바람</span>
          </div>
          <span className="text-[14px] font-bold text-white mt-auto truncate">
            {current.wind_dir} {Math.round(current.wind_kph)}km/h
          </span>
        </div>

        {/* Metric Item: UV */}
        <div className="flex flex-col p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg">
          <div className="flex items-center gap-1.5 text-blue-200/90 mb-1">
            <ShieldAlert className="w-4 h-4 text-orange-300" />
            <span className="text-[11px] font-bold tracking-wider uppercase">자외선</span>
          </div>
          <span className="text-xl font-extrabold text-white mt-auto">
            {current.uv}
          </span>
        </div>

        {/* Metric Item: Pressure */}
        <div className="flex flex-col p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-lg">
          <div className="flex items-center gap-1.5 text-blue-200/90 mb-1">
            <Gauge className="w-4 h-4 text-purple-300" />
            <span className="text-[11px] font-bold tracking-wider uppercase">기압</span>
          </div>
          <span className="text-xl font-extrabold text-white mt-auto">
            {current.pressure_mb} <span className="text-[10px] font-normal">hPa</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};
