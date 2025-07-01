import React from "react";
import { calcBubblePosition } from "../utils/calcBubblePosition";

export default function SpeechBubble({
  text,
  mood = "normal",
  positionY = 0,
  positionX = 0,
}) {
  if (!text) return null;

  const {
    top,
    left,
    tailLeftPercent,
    width,
    tailAngleDeg,
  } = calcBubblePosition({
    faceX: positionX,
    faceY: positionY,
  });

  const base =
    "absolute z-10 px-4 py-2 text-[clamp(14px,4vw,18px)] shadow-xl rounded-[18px] max-w-[90vw] transition-all duration-300";

const moodColor = {
  normal: "bg-[#f3f5f9] border-2 border-gray-300",     // 青みグレー（安全系）
  happy: "bg-[#fff4d6] border-2 border-yellow-400",     // 明るいベージュ
  warning: "bg-[#ffecec] border-2 border-red-300",      // 警告時の薄赤
  sleep: "bg-[#e8f1ff] border-2 border-blue-300",        // 寝ぼけたブルー
}[mood] || "bg-[#f3f5f9] border-2 border-gray-300";

  return (
    <div
      className={`${base} ${moodColor}`}
      style={{ top: `${top}px`, left: `${left}px`, width: `${width}px` ,boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",}}
    >
      <span>{text}</span>

      {/* 🎯しっぽ（楕円ぽくて柔らかい形） */}
<div
  className="absolute w-5 h-5 bg-inherit border-inherit"
  style={{
    left: `${tailLeftPercent}%`,
    transform: `translateX(-50%) rotate(${tailAngleDeg + 90}deg)`,
    transformOrigin: "top center",
    top: "170%",
    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", // 三角形ベース
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px", // 🔸 両サイドを丸める
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)", // ちょっと影で立体感
  }}
/>

      {/* 💖ハート */}
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
