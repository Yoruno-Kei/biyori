import React from "react";

export default function SpeechBubble({ text, mood = "normal" }) {
  if (!text) return null;
  const base = "rounded-2xl px-5 py-3 text-[clamp(15px,4vw,20px)] shadow-lg max-w-[80vw] mx-auto bg-white/80 border-2 border-pink-200 relative";
  const moodColor = {
    normal: "border-pink-200",
    happy: "border-pink-400 bg-pink-50",
    warning: "border-yellow-300 bg-yellow-50",
    sleep: "border-blue-200 bg-blue-50"
  }[mood] || "";

  return (
    <div className={`${base} ${moodColor} animate-fadeIn`}>
      <span>{text}</span>
      {/* しっぽ */}
      <span className="absolute left-10 -bottom-4 w-6 h-6 bg-white border-l-2 border-b-2 border-pink-200 rounded-bl-2xl"
        style={{ transform: "rotate(25deg)" }}
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
  );
}
