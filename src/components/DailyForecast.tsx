import React from "react";
import { ForecastDay } from "../types";
import { getWeatherIcon } from "./CurrentCard";
import { Calendar, ArrowUp, ArrowDown, Umbrella } from "lucide-react";
import { motion } from "motion/react";

interface DailyForecastProps {
  days: ForecastDay[];
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ days }) => {
  const getDayLabel = (dateStr: string, index: number) => {
    if (index === 0) return "오늘";
    if (index === 1) return "내일";
    
    // Day of the week
    const dateObj = new Date(dateStr.replace(/-/g, "/"));
    const daysOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    return daysOfWeek[dateObj.getDay()];
  };

  const formatDateLabel = (dateStr: string) => {
    const [, month, day] = dateStr.split("-");
    return `${parseInt(month)}월 ${parseInt(day)}일`;
  };

  return (
    <motion.div
      id="daily-forecast-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full flex flex-col gap-3"
    >
      <div className="flex items-center gap-2 text-sm font-bold text-slate-300 px-1">
        <Calendar className="w-4 h-4 text-amber-400" />
        <span>3일간 일기예보</span>
      </div>

      <div className="flex flex-col gap-3" id="daily-forecast-list">
        {days.map((day, index) => {
          return (
            <div
              key={index}
              id={`day-row-${index}`}
              className="w-full flex items-center justify-between p-4 bg-slate-900/40 backdrop-blur-md border border-white/5 hover:bg-slate-800/50 rounded-2xl transition-all duration-300 text-white shadow-lg"
            >
              {/* Day & Date Title */}
              <div className="w-1/4 flex flex-col" id={`day-title-col-${index}`}>
                <span className="text-sm font-bold text-white">
                  {getDayLabel(day.date, index)}
                </span>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {formatDateLabel(day.date)}
                </span>
              </div>

              {/* Weather Status */}
              <div className="w-1/3 flex items-center gap-3" id={`day-status-col-${index}`}>
                <div className="scale-75" id={`day-row-icon-${index}`}>
                  {getWeatherIcon(day.day.condition.code)}
                </div>
                <div className="flex flex-col" id={`day-row-text-${index}`}>
                  <span className="text-sm font-semibold text-slate-200">
                    {day.day.condition.text}
                  </span>
                  {day.day.daily_chance_of_rain > 20 && (
                    <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                      <Umbrella className="w-3 h-3 text-amber-400" />
                      비 {day.day.daily_chance_of_rain}%
                    </span>
                  )}
                </div>
              </div>

              {/* Temperature Range Bar */}
              <div className="w-1/3 flex items-center justify-end gap-4" id={`day-temp-col-${index}`}>
                <div className="flex items-center text-sky-400 gap-0.5 text-sm font-bold">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>{Math.round(day.day.mintemp_c)}°</span>
                </div>

                {/* Progress bar line connecting min and max */}
                <div className="hidden sm:block w-16 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                  <div className="absolute left-1/4 right-1/4 h-full bg-gradient-to-r from-sky-400 to-amber-400 rounded-full animate-pulse" />
                </div>

                <div className="flex items-center text-amber-400 gap-0.5 text-sm font-extrabold">
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>{Math.round(day.day.maxtemp_c)}°</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
