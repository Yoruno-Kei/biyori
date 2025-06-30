import React from "react";

export default function SpeechBubble({ text }) {
  if (!text) return null;
  return (
    <div className="bg-white/80 backdrop-blur-md text-black text-sm rounded-xl px-4 py-2 max-w-xs mx-auto mt-2 shadow-md">
      {text}
    </div>
  );
}
