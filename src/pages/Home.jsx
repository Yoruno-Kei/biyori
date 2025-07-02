import React, { useState, useRef, useEffect } from "react";
import SpeechBubble from "../components/SpeechBubble";
import HiyoriAvatar from "../components/HiyoriAvatar";
import { fetchHiyoriLine } from "../api/GeminiClient";
import { generateHiyoriPrompt } from "../utils/GeminiPrompt";
import { liftLines, dragDropLines } from "../utils/speechPresets";
import useIdleMonitor from "../hooks/useIdleMonitor";
import Ground from "../components/Ground";
import { getPoseFromMood } from "../components/usePoseControl";
import { getTimeLabel } from "../utils/getTimeLabel";

export default function Home() {
  const [text, setText] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [mood, setMood] = useState("normal");
  const [pose, setPose] = useState("idle");
  const [direction, setDirection] = useState("right");
  const [animClass, setAnimClass] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [lastLiftTime, setLastLiftTime] = useState(0);
  const [lastIdleTime, setLastIdleTime] = useState(Date.now());
  const [isDraggingNow, setIsDraggingNow] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const [, forceUpdate] = useState(0);

  // ✅ Gemini発話
  const speak = async () => {
    const fixedPoses = ["grabed", "sit", "sleep_sit", "sit_fall", "walk", "jump"];
    if (isRequesting || isJumping || fixedPoses.includes(pose)) return;

    setIsRequesting(true);
    const prompt = generateHiyoriPrompt({ timeLabel: getTimeLabel() });
    const { mood: newMood, text: line } = await fetchHiyoriLine(prompt);

    setText(line);
    setMood(newMood);
    setShowBubble(true);
    setLastIdleTime(Date.now());

    if (!fixedPoses.includes(pose)) {
      setPose(getPoseFromMood(newMood));
    }

    setTimeout(() => {
      setShowBubble(false);
      setIsRequesting(false);
      if (!fixedPoses.includes(pose)) setPose("idle");
    }, Math.max(2500, line.length * 80));
  };

  const speakFixedLine = (lines, fixedMood = "normal") => {
    const now = Date.now();
    const fixedPoses = ["grabed", "sit", "sleep_sit", "sit_fall", "walk", "jump"];
    if (now - lastLiftTime < 4000 || isRequesting || isJumping) return;

    setLastLiftTime(now);
    const line = lines[Math.floor(Math.random() * lines.length)];

    setText(line);
    setMood(fixedMood);
    setShowBubble(true);
    setLastIdleTime(Date.now());

    if (!fixedPoses.includes(pose)) {
      setPose(getPoseFromMood(fixedMood));
    }

    setTimeout(() => {
      setShowBubble(false);
      if (!fixedPoses.includes(pose)) setPose("idle");
    }, Math.max(4000, line.length * 120));
  };

  // ✅ ジャンプ時
  const handleTap = () => {
    if (isRequesting || isJumping) return;

    setPose("jump");
    setIsJumping(true);
    setAnimClass("animate-bounce-fast");

    speak(); // moodに応じた発話

    setTimeout(() => {
      setAnimClass("");
      setIsJumping(false);
      setPose("idle");
    }, 1000); // idleに戻す
  };

  // ✅ スライド時
  const handleSlide = ({ dx }) => {
  if (isDraggingNow) return;

  setIsDraggingNow(true);
  setPose("grabed");
  setDirection(dx < 0 ? "left" : "right");
  setLastIdleTime(Date.now());

  setTimeout(() => {
    setPose("sit_fall");

    // 🟡 セリフ＋感情を取得
    const { text: dropLine, mood: dropMood } =
      dragDropLines[Math.floor(Math.random() * dragDropLines.length)];

    // セリフとmood表示（画像もmoodで切替）
    setTimeout(() => {
      setText(dropLine);
      setMood(dropMood);
      setShowBubble(true);
      setPose(getPoseFromMood(dropMood));

      setTimeout(() => {
        setShowBubble(false);
        setPose("idle");
        setIsDraggingNow(false);
      }, Math.max(3000, dropLine.length * 100));
    }, 600);
  }, 600);
};

  // ✅ 放置時セリフ（5〜8分）
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastIdleTime;
      if (
        !isRequesting &&
        !isDraggingNow &&
        !isJumping &&
        !isWalking &&
        pose === "idle" &&
        elapsed > 5 * 60000 &&
        elapsed < 8 * 60000
      ) {
        speak();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [pose, isRequesting, lastIdleTime, isDraggingNow, isJumping, isWalking]);

  useIdleMonitor(() => speak(), 600000); // 10分

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
          direction={direction}
          onWalkStart={() => setIsWalking(true)}
          onWalkEnd={() => setIsWalking(false)}
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
