// Home.jsx
import React, { useState, useEffect, useRef } from "react";
import SpeechBubble from "../components/SpeechBubble";
import HiyoriAvatar from "../components/HiyoriAvatar";
import { fetchHiyoriLine } from "../api/GeminiClient";
import { generateHiyoriPrompt } from "../utils/GeminiPrompt";
import { liftLines } from "../utils/speechPresets";
import useIdleMonitor from "../hooks/useIdleMonitor";
import Ground from "../components/Ground";

export default function Home() {
  const [text, setText] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [mood, setMood] = useState("normal");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [animClass, setAnimClass] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [lastLiftTime, setLastLiftTime] = useState(0);

  // Gemini にリクエスト
  const speak = async (situation) => {
    if (isRequesting) return;
    setIsRequesting(true);
    setMood(situation);
    const prompt = generateHiyoriPrompt({ situation });
    const serifu = await fetchHiyoriLine(prompt);
    setText(serifu.replace(/^「|」$/g, ""));
    setShowBubble(true);
    setTimeout(() => {
      setShowBubble(false);
      setIsRequesting(false);
    }, Math.max(2500, serifu.length * 80));
  };

  // 固定セリフ
  const speakFixedLine = (lines, mood = "normal") => {
    const now = Date.now();
    if (now - lastLiftTime < 4000 || isRequesting) return;
    setLastLiftTime(now);

    const serifu = lines[Math.floor(Math.random() * lines.length)];
    setText(serifu);
    setMood(mood);
    setShowBubble(true);
    setTimeout(() => setShowBubble(false), Math.max(2500, serifu.length * 80));
  };

  // 放置でセリフ
  useIdleMonitor(() => speak("sleep"), 600000); // 10分

  // タップ時
  const handleTap = () => {
    setAnimClass("animate-bounce-fast");
    speak("happy");
    setTimeout(() => setAnimClass(""), 700);
  };

  // スライド時
  const handleSlide = ({ dx, dy }) => {
    setAnimClass("brightness-110 scale-105");
    setPos({ x: dx, y: dy });
    speak("warning");
    setTimeout(() => {
      setAnimClass("animate-drop");
      setTimeout(() => {
        setPos({ x: 0, y: 0 });
        setAnimClass("");
      }, 500);
    }, 600);
  };

  // アバターの座標更新
  const handlePosUpdate = ({ x, y }) => {
    setPos({ x, y });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-end bg-gradient-to-t from-pink-50/70 to-white pb-10 overflow-hidden">
      <Ground />
      <div className={`${animClass}`}>
        <HiyoriAvatar
          onTap={handleTap}
          onSlide={handleSlide}
          onLifted={() => speakFixedLine(liftLines, "warning")}
          onPosUpdate={handlePosUpdate}
        />
      </div>
      {showBubble && (
        <SpeechBubble
          text={text}
          mood={mood}
          positionX={pos.x}
          positionY={pos.y}
        />
      )}
    </div>
  );
}
