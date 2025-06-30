import React, { useState } from "react";
import useIdleMonitor from "../hooks/useIdleMonitor";
import { fetchHiyoriLine } from "../api/GeminiClient";
import { generateHiyoriPrompt } from "../utils/GeminiPrompt";
import HiyoriAvatar from "../components/HiyoriAvatar";
import SpeechBubble from "../components/SpeechBubble";

export default function Home() {
  const [text, setText] = useState("");
  const [isTalking, setIsTalking] = useState(false);

  useIdleMonitor(async () => {
    setIsTalking(true);
    const prompt = generateHiyoriPrompt({
      situation: "5分間無操作",
      reason: "少し寂しそう"
    });
    const result = await fetchHiyoriLine(prompt);
    setText(result);
    setTimeout(() => setIsTalking(false), 2000);
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-end bg-transparent">
      <SpeechBubble text={text} />
      <HiyoriAvatar isTalking={isTalking} />
    </div>
  );
}
