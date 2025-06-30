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
      console.log("[Idle Timer] Triggered");
      if (isRequesting || isDragging) {
        console.log("[Idle Timer] Skipped due to request/drag");
        return;
      }
      const action = actions[Math.floor(Math.random() * actions.length)];
      console.log("[Idle Timer] Action:", action);
      switch (action) {
        case "walk":
          const newX = pos.x + Math.random() * 40 - 20;
          const newY = pos.y + Math.random() * 20 - 10;
          console.log("[Walk] New position:", { x: newX, y: newY });
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
    if (isRequesting) {
      console.log("[Speak] Skipped, already requesting");
      return;
    }
    console.log("[Speak] Start for situation:", situation);
    setIsRequesting(true);
    setMood(situation);
    setText("……ん？");
    setShowBubble(true);
    const prompt = generateHiyoriPrompt({ situation });
    console.log("[Prompt]", prompt);
    const serifu = await fetchHiyoriLine(prompt);
    const cleanText = serifu.replace(/^「|」$/g, "");
    console.log("[Response]", cleanText);
    setText(cleanText);

    const duration = Math.max(2000, cleanText.length * 60);
    console.log("[Speech Duration]", duration);

    setTimeout(() => {
      setShowBubble(false);
      setIsRequesting(false);
      console.log("[Speak] End");
    }, duration);
  };

  const handleTap = () => {
    if (isRequesting) {
      console.log("[Tap] Ignored due to ongoing request");
      return;
    }
    console.log("[Tap] Triggered");
    setAnimClass("animate-bounce-fast");
    speak("happy");
    setTimeout(() => setAnimClass(""), 700);
  };

  const handleSlide = ({ dx, dy, isDragging }) => {
    console.log("[Slide]", { dx, dy, isDragging });
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

  const bubbleOffsetY = pos.y < -200 ? 160 : -180;
  const bubbleTriangle = pos.y < -200 ? "bottom" : "top";

  return (
    <div className="min-h-screen flex flex-col items-center justify-end bg-gradient-to-t from-pink-50/70 to-white pb-10 overflow-hidden select-none relative">
      {showBubble && (
        <div
          className="absolute z-10 w-screen max-w-full px-4"
          style={{
            left: `calc(50% + ${pos.x}px)`,
            top: `calc(60% + ${pos.y}px + ${bubbleOffsetY}px)`,
            transform: "translateX(-50%)",
          }}
        >
          <SpeechBubble text={text} mood={mood} triangle={bubbleTriangle} />
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
