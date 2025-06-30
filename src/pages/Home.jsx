import React, { useState } from "react";
import useIdleMonitor from "../hooks/useIdleMonitor";
import { fetchHiyoriLine } from "../api/GeminiClient";
import { generateHiyoriPrompt } from "../utils/GeminiPrompt";
import HiyoriAvatar from "../components/HiyoriAvatar";
import SpeechBubble from "../components/SpeechBubble";

export default function Home() {
  const [text, setText] = useState("……あの、ご主人、暇そうですけど");
  const [mood, setMood] = useState("normal");

  // 状態管理
  const askGemini = async (situation) => {
    setMood(situation);
    const prompt = generateHiyoriPrompt({ situation });
    const result = await fetchHiyoriLine(prompt);
    setText(result.replace(/^「|」$/g, "")); // かならず「」で囲むので外す
  };

  // 5分放置で「sleep」
  useIdleMonitor(() => askGemini("sleep"));

  // タップで「happy」
  const handleTap = () => askGemini("happy");

  // スライドで「warning」
  const handleSlide = () => askGemini("warning");

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-end pb-12 bg-gradient-to-t from-pink-50/70 to-white">
      {/* 吹き出し */}
      <SpeechBubble text={text} mood={mood} />
      {/* アバター */}
      <HiyoriAvatar onTap={handleTap} onSlide={handleSlide} />
      {/* ToDo/カレンダー土台（省略、必要なら下に追加） */}
    </div>
  );
}
