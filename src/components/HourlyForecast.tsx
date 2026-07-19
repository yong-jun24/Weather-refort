import React from "react";
import { ForecastHour } from "../types";
import { getWeatherIcon } from "./CurrentCard";
import { Clock, Umbrella, Droplets } from "lucide-react";
import { motion } from "motion/react";

interface HourlyForecastProps {
  hours: ForecastHour[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hours }) => {
  // We only show next 24 hours or group of hours (e.g. from current hour onwards, or every 2 hours to fit neatly)
  // Let's filter to show the full list but beautifully scrollable.
  const formatHourLabel = (timeStr: string) => {
    const dateObj = new Date(timeStr.replace(/-/g, "/")); // Cross-browser compatibility
    const hour = dateObj.getHours();
    const ampm = hour >= 12 ? "오후" : "오전";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${ampm} ${displayHour}시`;
  };

  const isCurrentHour = (timeStr: string) => {
    const itemDate = new Date(timeStr.replace(/-/g, "/"));
    const nowDate = new Date();
    return (
      itemDate.getDate() === nowDate.getDate() &&
      itemDate.getHours() === nowDate.getHours()
    );
  };

  return (
    <motion.div
      id="hourly-forecast-section"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full flex flex-col gap-3"
    >
      <div className="flex items-center gap-2 text-sm font-bold text-slate-300 px-1">
        <Clock className="w-4 h-4 text-amber-400" />
        <span>시간대별 세부 날씨 (오늘)</span>
      </div>

      <div
        id="hourly-scroll-container"
        className="w-full flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/10"
      >
        {hours.map((hour, index) => {
          const isCurrent = isCurrentHour(hour.time);
          
          return (
            <div
              key={index}
              id={`hour-item-${index}`}
              className={`flex-shrink-0 w-24 py-4 px-3 rounded-2xl flex flex-col items-center justify-between text-center border transition-all duration-300 ${
                isCurrent
                  ? "bg-amber-400 border-amber-300 text-slate-950 shadow-2xl scale-105 ring-2 ring-amber-300/40"
                  : "bg-slate-900/40 backdrop-blur-md border-white/5 text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              <span className={`text-[11px] font-bold ${isCurrent ? "text-slate-950/80" : "text-slate-400"}`}>
                {formatHourLabel(hour.time)}
              </span>

              <div className="my-3 scale-75" id={`hour-icon-${index}`}>
                {getWeatherIcon(hour.condition.code)}
              </div>

              <span className={`text-lg font-black tracking-tight ${isCurrent ? "text-slate-950" : "text-white"}`}>
                {Math.round(hour.temp_c)}°
              </span>

              <div className="flex flex-col gap-0.5 mt-2" id={`hour-metrics-${index}`}>
                {hour.chance_of_rain > 10 ? (
                  <div className={`flex items-center gap-0.5 text-[10px] font-bold justify-center ${isCurrent ? "text-amber-950" : "text-amber-400"}`}>
                    <Umbrella className="w-2.5 h-2.5" />
                    <span>{hour.chance_of_rain}%</span>
                  </div>
                ) : (
                  <div className={`flex items-center gap-0.5 text-[10px] justify-center font-semibold ${isCurrent ? "text-slate-800" : "text-slate-400"}`}>
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{hour.humidity}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
