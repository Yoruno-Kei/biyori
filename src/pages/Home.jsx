// Home.jsx
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
          setPos({
            x: pos.x + Math.random() * 40 - 20,
            y: pos.y + Math.random() * 20 - 10,
          });
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
    // setPos({ x: 0, y: 0 }); // ← 削除して位置リセットを防ぐ
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
      setAnimClass("brightness-110 scale-105");
      speak("warning");
      setTimeout(() => setAnimClass(""), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-end bg-gradient-to-t from-pink-50/70 to-white pb-10 overflow-hidden select-none relative">
      {showBubble && (
        <div
          className="absolute z-10"
          style={{
            left: `calc(50% + ${pos.x}px)`,
            top: `calc(60% + ${pos.y}px - 280px)`,
            transform: "translateX(-50%)",
          }}
        >
          <SpeechBubble text={text} mood={mood} />
        </div>
      )}
      <div
        ref={avatarRef}
        className={`transition-transform duration-300 ease-linear ${animClass}`}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
        }}
      >
        <HiyoriAvatar onTap={handleTap} onSlide={handleSlide} />
      </div>
    </div>
  );
}
