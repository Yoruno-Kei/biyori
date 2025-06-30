// src/components/SpeechManager.jsx
import React, { useState, useEffect } from "react";
import { fetchHiyoriLine } from "../api/GeminiClient";
import { generateHiyoriPrompt } from "../utils/GeminiPrompt";
import SpeechBubble from "./SpeechBubble";

export default function SpeechManager({ trigger }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (trigger) {
      const prompt = generateHiyoriPrompt({
        situation: "ご主人がしばらく無操作",
        time: "夜",
        reason: "寂しそうに見える"
      });
      fetchHiyoriLine(prompt).then(setText);
    }
  }, [trigger]);

  return <SpeechBubble text={text} />;
}
