import React, { useState } from "react";
import Avatar from "../components/Avatar";
import SpeechBubble from "../components/SpeechBubble";

export default function Home() {
  const [message, setMessage] = useState("ひよりです♪ タップして話しかけてください");

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-end bg-transparent text-center relative overflow-hidden">
      <SpeechBubble text={message} />
      <Avatar onTap={() => setMessage('はいっ、ご主人さま♪')} />
    </div>
  );
}
