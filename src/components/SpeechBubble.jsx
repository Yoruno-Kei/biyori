import React from "react";

export default function SpeechBubble({
  text,
  mood = "normal",
  positionY = 0,
  positionX = 0,
}) {
  if (!text) return null;

  const base =
    "absolute z-10 px-4 py-2 text-[clamp(14px,4vw,18px)] shadow-xl rounded-2xl max-w-[90vw] transition-all duration-300";

  const moodColor = {
    normal: "bg-white/80 border-2 border-pink-200",
    happy: "bg-pink-50 border-2 border-pink-300",
    warning: "bg-yellow-50 border-2 border-yellow-300",
    sleep: "bg-blue-50 border-2 border-blue-200",
  }[mood] || "bg-white/80 border-2 border-pink-200";

  // 安全な高さチェック（SSR対策）
  const isBottom =
    typeof window !== "undefined"
      ? positionY < window.innerHeight * 0.33
      : false;

  return (
    <div
      className={`${base} ${moodColor}`}
      style={{
        top: isBottom ? `${positionY + 100}px` : `${positionY - 140}px`,
        left: `max(8px, min(${positionX - 80}px, calc(100vw - 160px)))`,
      }}
    >
      <span>{text}</span>

      {/* しっぽ（三角） */}
      <span
        className="absolute w-5 h-5 bg-inherit border-inherit"
        style={{
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          bottom: isBottom ? "100%" : undefined,
          top: isBottom ? undefined : "100%",
          borderLeftWidth: 2,
          borderBottomWidth: 2,
        }}
      />

      {/* ハートマーク（アニメ） */}
      <span className="absolute -right-3 -top-3 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 28 28">
          <path
            d="M14 25s-8.5-6.7-10.7-10.4c-2.7-4.4 2-8.4 6.1-7.1C11.6 8.3 14 11 14 11s2.4-2.7 4.6-3.5c4.1-1.3 8.8 2.7 6.1 7.1C22.5 18.3 14 25 14 25z"
            fill="#f883b6"
            stroke="#f26c99"
            strokeWidth="1"
          />
        </svg>
      </span>
    </div>
  );
}
