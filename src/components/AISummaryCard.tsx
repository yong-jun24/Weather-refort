import React from "react";
import { Sparkles, Bot, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface AISummaryCardProps {
  summary?: string;
  loading: boolean;
  isPreview: boolean;
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({
  summary,
  loading,
  isPreview,
}) => {
  return (
    <motion.div
      id="ai-summary-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full relative rounded-3xl p-6 bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden text-white"
    >
      {/* Dynamic Animated Core Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl animate-pulse pointer-events-none" />
      
      <div className="flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between" id="ai-card-title-row">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-amber-400">
              <Bot className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                AI 기상 캐스터 브리핑
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black tracking-wide uppercase">
                  Gemini 3.5
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                오늘의 맞춤형 건강 & 라이프 스타일 가이드
              </p>
            </div>
          </div>
          
          <Sparkles className="w-4 h-4 text-amber-400 animate-[spin_4s_linear_infinite]" />
        </div>

        <div className="h-[1px] bg-white/5 w-full" />

        {loading ? (
          <div className="flex flex-col gap-2.5 py-4" id="ai-loading-skeleton">
            <div className="h-4 bg-white/5 rounded-md animate-pulse w-full" />
            <div className="h-4 bg-white/5 rounded-md animate-pulse w-[92%]" />
            <div className="h-4 bg-white/5 rounded-md animate-pulse w-[85%]" />
          </div>
        ) : summary ? (
          <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-medium" id="ai-summary-content">
            {summary}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-200 text-sm py-2" id="ai-no-data">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>AI 가이드가 생성되지 않았습니다. API 키 설정을 확인해 주세요.</span>
          </div>
        )}

        {isPreview && !loading && (
          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 font-medium bg-white/5 py-1.5 px-3 rounded-lg border border-white/5">
            <span>💡</span>
            <span>API 키가 등록되지 않아 샘플 데이터 기반의 브리핑이 출력되고 있습니다.</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
