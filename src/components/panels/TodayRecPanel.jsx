import React from "react";
import { useAppData } from "../../contexts/AppDataContext";

export default function TodayRecPanel() {
  const { todayRec, recLoading } = useAppData();

  /* ───────── 考え中アニメ ───────── */
  if (recLoading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        {/* くるくるハート */}
        <svg
          className="w-8 h-8 animate-spin-slow text-pink-400 mb-2"
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M12 21s-6.5-5-8.2-7.8C1.1 10.5 4 6.5 7.8 8.1 9 8.6 10 9.7 12 12c2-2.3 3-3.4 4.2-3.9 3.8-1.6 6.7 2.4 4 5.1C18.5 16 12 21 12 21z"/>
        </svg>
        <p className="text-pink-500 text-sm tracking-wide">
          ひよりが&nbsp;<span className="animate-pulse">考え中…</span>
        </p>
      </div>
    );
  }

  /* ───────── まだ作っていない ───────── */
  if (!todayRec) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-center">
        <svg
          className="w-16 h-16 text-amber-300 mb-1"
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M12 21s-6.5-5-8.2-7.8C1.1 10.5 4 6.5 7.8 8.1c1.3.5 2.2 1.6 4.2 3.9 2-2.3 3-3.4 4.2-3.9C19 6.5 22.9 10.5 20.2 13.2 18.5 16 12 21 12 21z"/>
        </svg>
        <p className="text-[13px] leading-tight text-gray-500 px-4">
          朝の<span className="font-semibold text-pink-500">“今日の予定＆気分”</span>に
          答えると、<br/>ひよりが&nbsp;おすすめスケジュールを&nbsp;作ります♪
        </p>
      </div>
    );
  }

  /* ───────── 円グラフを描画 ───────── */
  const sectors = todayRec
    .map(({ start, end, color }) =>
      `${color} ${(start / 24) * 360}deg ${(end / 24) * 360}deg`
    )
    .join(", ");

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        className="relative drop-shadow-lg"
        style={{
          width: 180,
          height: 180,
          background: `conic-gradient(${sectors})`,
          borderRadius: "50%"
        }}
      >
        <div className="absolute inset-[26px] bg-white rounded-full flex items-center justify-center text-xs font-semibold text-pink-500">
          Today ❤
        </div>
      </div>
    </div>
  );
}

/* --- Tailwind カスタム: 回転速度を少し遅く --- */
<style jsx="true">{`
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
  }
`}</style>
