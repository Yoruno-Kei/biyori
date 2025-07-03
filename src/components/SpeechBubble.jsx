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
  } = calcBubblePosition({ faceX: positionX, faceY: positionY });

  /* 共通クラス */
  const base =
    "absolute z-10 px-4 py-2 text-[clamp(14px,4vw,18px)] shadow-xl rounded-[18px] max-w-[90vw] transition-all duration-300";

  /* mood 別の配色 */
  const moodColor = {
    normal:       "bg-[#f3f5f9] border-2 border-gray-300",
    normal_idle:  "bg-[#f3f5f9] border-2 border-gray-300",
    happy:        "bg-[#fff4d6] border-2 border-yellow-400",
    warning:      "bg-[#ffecec] border-2 border-red-300",
    sleep:        "bg-[#e8f1ff] border-2 border-blue-300",
    sleep_sit:    "bg-[#e8f1ff] border-2 border-blue-300",
    sad:          "bg-[#edf0ff] border-2 border-indigo-300",
    angry:        "bg-[#ffe8e8] border-2 border-rose-400",
    surprise:     "bg-[#fff0e5] border-2 border-orange-300",
  }[mood] || "bg-[#f3f5f9] border-2 border-gray-300";

  /* mood 別アイコン（SVG） */
  const moodIcon = {
    happy: (
      <path
        d="M14 25s-8.5-6.7-10.7-10.4c-2.7-4.4 2-8.4 6.1-7.1C11.6 8.3 14 11 14 11s2.4-2.7 4.6-3.5c4.1-1.3 8.8 2.7 6.1 7.1C22.5 18.3 14 25 14 25z"
        fill="#f883b6"
        stroke="#f26c99"
        strokeWidth="1"
      />
    ),
    sad: (
      <path
        d="M14 24c5-3 8-6 8-9a8 8 0 10-16 0c0 3 3 6 8 9z"
        fill="#89a6ff"
        stroke="#607aff"
        strokeWidth="1"
      />
    ),
    angry: (
      <path
        d="M4 5l4 4M24 5l-4 4"
        stroke="#d22"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    sleep: (
      <text
        x="4" y="18"
        fontSize="14"
        fill="#5a8aff"
        fontFamily="monospace"
      >Zz</text>
    ),
    warning: (
      <path
        d="M14 4l9 16H5L14 4z"
        fill="#ffbe8b"
        stroke="#ff8c42"
        strokeWidth="1"
      />
    ),
    surprise: (
      <polygon
        points="14,3 17,11 26,11 19,17 22,25 14,20 6,25 9,17 2,11 11,11"
        fill="#ffd966"
        stroke="#f4b400"
        strokeWidth="1"
      />
    ),
  }[mood];

  /* happy は弾む・他はふわっと */
  const iconAnim = mood === "happy" ? "animate-bounce" : "animate-ping";

  return (
    <div
      className={`${base} ${moodColor}`}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
    >
      <span>{text}</span>

      {/* しっぽ */}
      <div
        className="absolute w-5 h-5 bg-inherit border-inherit"
        style={{
          left: `${tailLeftPercent}%`,
          transform: `translateX(-50%) rotate(${tailAngleDeg + 90}deg)`,
          transformOrigin: "top center",
          top: "130%",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          borderLeftWidth: 2,
          borderBottomWidth: 2,
          borderBottomLeftRadius: "6px",
          borderBottomRightRadius: "6px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      />

      {/* mood アイコン（happy/sad/angry/sleep/warning/surprise） */}
      {moodIcon && (
        <span className={`absolute -right-3 -top-3 ${iconAnim}`}>
          <svg width="24" height="24" viewBox="0 0 28 28">
            {moodIcon}
          </svg>
        </span>
      )}
    </div>
  );
}
