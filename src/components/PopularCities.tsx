import React from "react";
import { PopularCity } from "../types";
import { Sparkles } from "lucide-react";

interface PopularCitiesProps {
  selectedCity: string;
  onSelectCity: (cityEn: string) => void;
}

export const POPULAR_CITIES: PopularCity[] = [
  { id: "seoul", nameKr: "서울", nameEn: "Seoul", description: "대한민국의 수도" },
  { id: "jeju", nameKr: "제주", nameEn: "Jeju", description: "따뜻한 섬의 바람" },
  { id: "busan", nameKr: "부산", nameEn: "Busan", description: "시원한 바다 날씨" },
  { id: "tokyo", nameKr: "도쿄", nameEn: "Tokyo", description: "이웃나라 메트로폴리스" },
  { id: "newyork", nameKr: "뉴욕", nameEn: "New York", description: "세계의 중심 도시" },
  { id: "london", nameKr: "런던", nameEn: "London", description: "클래식한 안개의 도시" },
  { id: "paris", nameKr: "파리", nameEn: "Paris", description: "낭만 가득한 예술의 도시" },
];

export const PopularCities: React.FC<PopularCitiesProps> = ({
  selectedCity,
  onSelectCity,
}) => {
  return (
    <div className="w-full flex flex-col gap-2 mb-6" id="popular-cities-container">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-300 px-1">
        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>인기 도시 빠른 선택</span>
      </div>
      <div className="flex flex-wrap gap-2" id="popular-cities-list">
        {POPULAR_CITIES.map((city) => {
          const isSelected =
            selectedCity.toLowerCase() === city.nameEn.toLowerCase() ||
            selectedCity === city.nameKr;

          return (
            <button
              key={city.id}
              id={`city-btn-${city.id}`}
              onClick={() => onSelectCity(city.nameEn)}
              className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 relative overflow-hidden flex flex-col items-start cursor-pointer group shadow-sm ${
                isSelected
                  ? "bg-amber-400 text-slate-950 border border-amber-300 shadow-xl scale-[1.03]"
                  : "bg-slate-900/40 backdrop-blur-md border border-white/5 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-[1.01]"
              }`}
            >
              <span className="font-bold text-[14px]">{city.nameKr}</span>
              <span
                className={`text-[10px] font-mono mt-0.5 transition-colors ${
                  isSelected
                    ? "text-slate-850 font-bold"
                    : "text-slate-400 group-hover:text-slate-300"
                }`}
              >
                {city.nameEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
