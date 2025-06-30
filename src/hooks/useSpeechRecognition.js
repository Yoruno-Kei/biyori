import { useEffect, useState } from "react";

export default function useSpeechRecognition(onResult) {
  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    recognitionRef.current = recognition;
  }, []);

  const recognitionRef = { current: null };

  const start = () => {
    recognitionRef.current?.start();
  };

  return start;
}
