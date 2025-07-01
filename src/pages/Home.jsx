// Home.jsx
import React, { useState, useEffect, useRef } from "react";
import SpeechBubble from "../components/SpeechBubble";
import HiyoriAvatar from "../components/HiyoriAvatar";
import { fetchHiyoriLine } from "../api/GeminiClient";
import { generateHiyoriPrompt } from "../utils/GeminiPrompt";
import { liftLines } from "../utils/speechPresets";
import useIdleMonitor from "../hooks/useIdleMonitor";

export default function Home() {
  const [text, setText] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [mood, setMood] = useState("normal");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [animClass, setAnimClass] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const dragStart = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!animClass) {
        setPos({
          x: Math.random() * 20 - 10,
          y: 0,
        });
      }
    }, 10000); // ちょこちょこ移動 10秒間隔
    return () => clearInterval(timer);
  }, [animClass]);

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

  // 固定セリフ（持ち上げ時）
  const speakFixedLine = (lines, mood = "normal") => {
    if (isRequesting) return;
    const serifu = lines[Math.floor(Math.random() * lines.length)];
    setText(serifu);
    setMood(mood);
    setShowBubble(true);
    setTimeout(() => {
      setShowBubble(false);
    }, Math.max(2500, serifu.length * 80));
  };

  useIdleMonitor(() => speak("sleep"));

  const handleTap = () => {
    setAnimClass("animate-bounce-fast");
    speak("happy");
    setTimeout(() => setAnimClass(""), 700);
  };

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

  const handlePosUpdate = ({ x, y }) => {
    setPos({ x, y });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-end bg-gradient-to-t from-pink-50/70 to-white pb-10 overflow-hidden">
      {showBubble && (
        <SpeechBubble text={text} mood={mood} positionX={pos.x} positionY={pos.y} />
      )}
      <div className={`transition-transform duration-700 ${animClass}`}>
        <HiyoriAvatar
          onTap={handleTap}
          onSlide={handleSlide}
          onLifted={() => speakFixedLine(liftLines, "warning")}
          onPosUpdate={handlePosUpdate}
        />
      </div>
    </div>
  );
}
