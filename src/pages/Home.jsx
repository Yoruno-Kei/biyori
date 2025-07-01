import React, { useState, useRef } from "react";
import SpeechBubble from "../components/SpeechBubble";
import HiyoriAvatar from "../components/HiyoriAvatar";
import { fetchHiyoriLine } from "../api/GeminiClient";
import { generateHiyoriPrompt } from "../utils/GeminiPrompt";
import { liftLines } from "../utils/speechPresets";
import useIdleMonitor from "../hooks/useIdleMonitor";
import Ground from "../components/Ground";
import { getPoseFromMood } from "../components/usePoseControl";

export default function Home() {
  const [text, setText] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [mood, setMood] = useState("normal");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [animClass, setAnimClass] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [lastLiftTime, setLastLiftTime] = useState(0);
  const [pose, setPose] = useState("idle");

  const speak = async (situation) => {
    if (isRequesting) return;
    setIsRequesting(true);
    setMood(situation);
    setPose(getPoseFromMood(situation));
    const prompt = generateHiyoriPrompt({ situation });
    const serifu = await fetchHiyoriLine(prompt);
    setText(serifu.replace(/^「|」$/g, ""));
    setShowBubble(true);
    setTimeout(() => {
      setShowBubble(false);
      setIsRequesting(false);
      setPose("idle");
    }, Math.max(2500, serifu.length * 80));
  };

  const speakFixedLine = (lines, mood = "normal") => {
    const now = Date.now();
    if (now - lastLiftTime < 4000 || isRequesting) return;
    setLastLiftTime(now);

    const serifu = lines[Math.floor(Math.random() * lines.length)];
    setText(serifu);
    setMood(mood);
    setPose(getPoseFromMood(mood));
    setShowBubble(true);
    setTimeout(() => {
      setShowBubble(false);
      setPose("idle");
    }, Math.max(4000, serifu.length * 120));
  };

  useIdleMonitor(() => speak("sleep"), 600000);

  const handleTap = () => {
    if (isRequesting) return;
    setAnimClass("animate-bounce-fast");
    speak("happy");
    setTimeout(() => setAnimClass(""), 1000);
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

  const posRef = useRef({ x: 0, y: 0 });
  const [, forceUpdate] = useState(0);
  const handlePosUpdate = ({ x, y }) => {
    posRef.current = { x, y };
    forceUpdate((v) => v + 1);
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
          pose={pose}
        />
      </div>
      {showBubble && (
        <SpeechBubble
          text={text}
          mood={mood}
          positionX={posRef.current.x}
          positionY={posRef.current.y}
        />
      )}
    </div>
  );
}
