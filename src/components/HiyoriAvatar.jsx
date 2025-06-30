import React from "react";
import Lottie from "lottie-react";
import idleAnimation from "../assets/lottie/hiyori-idle.json";
import talkAnimation from "../assets/lottie/hiyori-talk.json";

export default function HiyoriAvatar({ isTalking }) {
  return (
    <div className="w-48 h-48 pointer-events-none select-none">
      <Lottie animationData={isTalking ? talkAnimation : idleAnimation} loop />
    </div>
  );
}
