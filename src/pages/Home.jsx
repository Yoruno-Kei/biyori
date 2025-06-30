import React, { useState, useEffect, useRef } from "react";
import SpeechBubble from "../components/SpeechBubble";
import HiyoriAvatar from "../components/HiyoriAvatar";
import { fetchHiyoriLine } from "../api/GeminiClient";
import { generateHiyoriPrompt } from "../utils/GeminiPrompt";
import useIdleMonitor from "../hooks/useIdleMonitor";

export default function Home() {
  const [text, setText] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [mood, setMood] = useState("normal");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [animClass, setAnimClass] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const dragStart = useRef(null);

  // アバターちょこちょこ動く
  useEffect(() => {
    const timer = setInterval(() => {
      if (!animClass) {
        setPos({
          x: Math.random() * 20 - 10,
          y: Math.random() * 10 - 5,
        });
      }
    }, 2800);
    return () => clearInterval(timer);
  }, [animClass]);

  // 吹き出し＋Gemini
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
    }, 2200);
  };

  // 5分放置
  useIdleMonitor(() => speak("sleep"));

  // タップ（嬉しい・ビクッ）
  const handleTap = () => {
    setAnimClass("animate-bounce-fast");
    speak("happy");
    setTimeout(() => setAnimClass(""), 700);
  };

  // スライド系（捕まった/持ち上げアニメ）
  const handleSlide = ({ dx, dy }) => {
    setAnimClass("brightness-110 scale-105");
    setPos({ x: dx, y: dy - 30 });
    speak("warning");
    setTimeout(() => {
      setAnimClass("animate-drop");
      setTimeout(() => {
        setPos({ x: 0, y: 0 });
        setAnimClass("");
      }, 500);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-end bg-gradient-to-t from-pink-50/70 to-white pb-10">
      {showBubble && <SpeechBubble text={text} mood={mood} />}
      <div
        className={`transition-transform duration-700 ${animClass}`}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
        }}
      >
        <HiyoriAvatar onTap={handleTap} onSlide={handleSlide} />
      </div>
    </div>
  );
}
