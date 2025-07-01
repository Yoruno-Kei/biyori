// components/SpeechBubble.jsx
import React from "react";

export default function SpeechBubble({ text, mood = "normal", y = 0 }) {
  if (!text) return null;

  const moodStyles = {
    normal: { border: "border-pink-200", bg: "bg-white/80", tail: "#fff", stroke: "#f2b5c9" },
    happy: { border: "border-pink-400", bg: "bg-pink-50", tail: "#ffe4ec", stroke: "#f26c99" },
    warning: { border: "border-yellow-300", bg: "bg-yellow-50", tail: "#fff9db", stroke: "#facc15" },
    sleep: { border: "border-blue-200", bg: "bg-blue-50", tail: "#e0f2fe", stroke: "#60a5fa" },
  }[mood] || {};

  const isTop = y > window.innerHeight / 3;

  const base = `rounded-2xl px-5 py-3 text-[clamp(15px,4vw,20px)] shadow-md max-w-[90vw] ${moodStyles.bg} ${moodStyles.border} border-2 relative transition-all duration-300`;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-50"
      style={{ top: isTop ? undefined : y - 100, bottom: isTop ? window.innerHeight - y + 80 : undefined }}
    >
      <div className={base}>
        <span>{text}</span>
        {/* しっぽ（三角） */}
        <span
          className={`absolute ${isTop ? "top-[-8px] rotate-180" : "bottom-[-8px]"} left-10 w-6 h-6 ${moodStyles.bg} border-l-2 border-b-2 ${moodStyles.border} rounded-bl-2xl`}
          style={{ transform: isTop ? "rotate(225deg)" : "rotate(45deg)" }}
        />
        {/* ハート */}
        <span className="absolute -right-3 -top-3 animate-bounce">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <path
              d="M14 25s-8.5-6.7-10.7-10.4c-2.7-4.4 2-8.4 6.1-7.1C11.6 8.3 14 11 14 11s2.4-2.7 4.6-3.5c4.1-1.3 8.8 2.7 6.1 7.1C22.5 18.3 14 25 14 25z"
              fill="#f883b6"
              stroke="#f26c99"
              strokeWidth="1"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
