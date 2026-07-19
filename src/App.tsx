import React, { useState, useEffect, useRef } from "react";
import { WeatherResponse } from "./types";
import { PopularCities } from "./components/PopularCities";
import { CurrentCard } from "./components/CurrentCard";
import { AISummaryCard } from "./components/AISummaryCard";
import { HourlyForecast } from "./components/HourlyForecast";
import { DailyForecast } from "./components/DailyForecast";
import { 
  CloudSun, 
  Search, 
  Loader2, 
  AlertCircle, 
  Info, 
  Github, 
  HelpCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [query, setQuery] = useState("Seoul");
  const [searchInput, setSearchInput] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load weather on initial mount
  useEffect(() => {
    fetchWeather(query);
  }, []);

  const fetchWeather = async (targetQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?q=${encodeURIComponent(targetQuery)}`);
      if (!response.ok) {
        throw new Error("날씨 정보를 불러오는 데 실패했습니다.");
      }
      const data: WeatherResponse = await response.json();
      setWeatherData(data);
      // Synchronize the main state query
      setQuery(data.location.name);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "서버 통신 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchLoading(true);
    fetchWeather(searchInput);
  };

  const handleSelectCity = (cityEn: string) => {
    setSearchInput("");
    fetchWeather(cityEn);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0C10] via-[#12131C] to-[#1F2833] text-white font-sans selection:bg-amber-400/20 pb-16 antialiased" id="app-wrapper">
      {/* Demo / Preview Mode top warning bar */}
      {weatherData?.isPreview && (
        <motion.div
          id="preview-warning-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-400 text-slate-950 text-xs font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 relative z-50 shadow-md animate-fade-in"
        >
          <Info className="w-4 h-4 flex-shrink-0 animate-bounce" />
          <span>
            {weatherData?.apiKeyError ? (
              <>
                WEATHER_API_KEY가 등록되어 있으나, 기상국 API 오류가 발생했습니다: <strong className="underline decoration-red-650">{weatherData.apiKeyError}</strong>. API 키 값이 올바른지 확인해 주세요.
              </>
            ) : weatherData?.hasApiKey ? (
              <>
                등록된 WEATHER_API_KEY에 접근 오류가 발생했습니다. 데모 모드로 임시 데이터를 제공하고 있습니다.
              </>
            ) : (
              <>
                현재 <strong>데모(예제) 모드</strong>로 작동 중입니다. 실시간 기상 API 연동을 위해선 설정에서 <strong>WEATHER_API_KEY</strong>를 등록해 주세요.
              </>
            )}
          </span>
        </motion.div>
      )}

      {/* Main Header / Navigation bar */}
      <header className="w-full border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-40 px-4 py-4" id="main-header">
        <div className="max-w-4xl mx-auto flex items-center justify-between" id="header-content-inner">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelectCity("Seoul")} id="header-logo-container">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 text-amber-400 shadow-md" id="header-logo-icon">
              <CloudSun className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white" id="header-app-title">LCB Corporation Weather</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Poetic Mirror Forecast</p>
            </div>
          </div>

          {/* Simple attribution */}
          <span className="text-[11px] font-bold font-mono text-slate-350 bg-white/5 border border-white/5 px-3 py-1 rounded-full">
            v1.2.0 Fullstack
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 mt-8" id="main-content-layout">
        <div className="flex flex-col gap-6">
          {/* Glassmorphic Search Input Bar */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full relative"
            id="search-form"
          >
            <div className="relative flex items-center" id="search-input-group">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="도시명 또는 국가명을 검색하세요 (예: 서울, Jeju, Tokyo, London...)"
                className="w-full pl-12 pr-28 py-4 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 placeholder-slate-500 focus:bg-slate-900/60 focus:outline-none focus:ring-4 focus:ring-amber-400/10 transition-all text-sm font-semibold text-white"
                id="weather-search-input"
              />
              <div className="absolute right-2 flex items-center gap-1.5" id="search-action-container">
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput("")}
                    className="p-1 rounded-full text-slate-400 hover:bg-white/5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center gap-1.5 shadow-md cursor-pointer"
                  id="search-submit-btn"
                >
                  {searchLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>검색</span>
                  )}
                </button>
              </div>
            </div>
          </motion.form>

          {/* Popular Cities Tab list */}
          <PopularCities selectedCity={query} onSelectCity={handleSelectCity} />

          {/* Loading / Error States and Main Dashboard Layout */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-4"
                id="loading-spinner-view"
              >
                <div className="relative flex items-center justify-center" id="loading-spinner-circle">
                  <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                  <CloudSun className="w-5 h-5 text-yellow-300 absolute animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">기상 데이터 분석 중</p>
                  <p className="text-xs text-blue-200 mt-0.5 font-medium">실시간 기상 위성 정보와 예측 통계를 구성하고 있습니다...</p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-center flex flex-col items-center gap-3 py-12"
                id="error-view"
              >
                <div className="p-3 bg-red-500/20 text-red-200 rounded-full border border-red-400/30" id="error-badge">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">날씨 검색 오류</h4>
                  <p className="text-sm text-blue-100 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => handleSelectCity("Seoul")}
                  className="mt-2 bg-white text-indigo-950 hover:bg-blue-50 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  서울 날씨로 새로고침
                </button>
              </motion.div>
            ) : weatherData ? (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-6"
                id="weather-dashboard"
              >
                {/* 1. Main Current Weather Card */}
                <CurrentCard data={weatherData} />

                {/* 2. Personalized AI Briefing Summary */}
                <AISummaryCard
                  summary={weatherData.aiSummary}
                  loading={loading}
                  isPreview={weatherData.isPreview}
                />

                {/* 3. Horizontal Scroll Hourly Forecast (Today) */}
                <HourlyForecast hours={weatherData.forecast.forecastday[0].hour} />

                {/* 4. Vertical Row 3-Day Forecast */}
                <DailyForecast days={weatherData.forecast.forecastday} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="text-center mt-16 text-xs text-slate-500 border-t border-white/5 pt-8" id="app-footer">
        <p>© 2026 LCB Corporation Weather Platform. Powered by WeatherAPI & Gemini AI.</p>
        <p className="mt-1 font-mono text-[10px] text-slate-600">All meteorological forecasts are processed server-side securely.</p>
      </footer>
    </div>
  );
}
