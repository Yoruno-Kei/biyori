// Home.jsx
import React, { useState, useEffect, useRef } from "react";
import SpeechBubble from "../components/SpeechBubble";
import HiyoriAvatar from "../components/HiyoriAvatar";
import { fetchHiyoriLine } from "../api/GeminiClient";
import { generateHiyoriPrompt } from "../utils/GeminiPrompt";
import useIdleMonitor from "../hooks/useIdleMonitor";
import Ground from "../components/Ground";

export default function Home() {
  const [text, setText] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [mood, setMood] = useState("normal");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [animClass, setAnimClass] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);
  const avatarRef = useRef(null);

  useIdleMonitor(() => speak("sleep"));

  useEffect(() => {
    const actions = ["walk", "stop", "speak", "idle"];
    const timer = setInterval(() => {
      if (isRequesting || isDragging) return;
      const action = actions[Math.floor(Math.random() * actions.length)];
      switch (action) {
        case "walk":
          const newX = pos.x + Math.random() * 40 - 20;
          const newY = pos.y + Math.random() * 20 - 10;
          setPos({ x: newX, y: newY });
          break;
        case "speak":
          speak("normal");
          break;
        case "idle":
          setAnimClass("animate-bounce-fast");
          setTimeout(() => setAnimClass(""), 600);
          break;
        default:
          break;
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [pos, isRequesting, isDragging]);

  const speak = async (situation) => {
    if (isRequesting) return;
    setIsRequesting(true);
    setMood(situation);
    setText("……ん？");
    setShowBubble(true);
    const prompt = generateHiyoriPrompt({ situation });
    const serifu = await fetchHiyoriLine(prompt);
    const cleanText = serifu.replace(/^「|」$/g, "");
    setText(cleanText);
    const duration = Math.max(2000, cleanText.length * 60);
    setTimeout(() => {
      setShowBubble(false);
      setIsRequesting(false);
    }, duration);
  };

  const handleTap = () => {
    if (isRequesting) return;
    setAnimClass("animate-bounce-fast");
    speak("happy");
    setTimeout(() => setAnimClass(""), 700);
  };

  const handleSlide = ({ dx, dy, isDragging }) => {
    if (isDragging) {
      setIsDragging(true);
      setPos({ x: dx, y: dy });
    } else {
      setIsDragging(false);
      setAnimClass("rotate-12 scale-110");
      speak("warning");
      setTimeout(() => setAnimClass(""), 500);
    }
  };

  const isUpperScreen = (60 + pos.y) < 33; // 画面の上1/3以内にいるか
  const bubbleOffsetY = isUpperScreen ? 160 : -180;
  const bubbleTriangle = isUpperScreen ? "bottom" : "top";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-t from-pink-50/70 to-white">
      {/* 地面 */}
      <Ground />

      {/* 吹き出し */}
      {showBubble && (
        <SpeechBubble text={text} mood={mood} charY={pos.y} charX={pos.x} />
      )}

      {/* アバター */}
      <div
        className={`absolute bottom-[6rem] left-1/2 transition-transform duration-700 ${animClass}`}
        style={{
          transform: `translateX(calc(-50% + ${pos.x}px)) translateY(${-pos.y}px)`,
          zIndex: 10,
        }}
      >
        <HiyoriAvatar onTap={handleTap} onSlide={handleSlide} />
      </div>
    </div>
  );
}