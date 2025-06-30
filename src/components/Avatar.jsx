import React from "react";
import Lottie from "lottie-react";
import avatarAnim from "../assets/avatar.json";

export default function Avatar({ onTap }) {
  return (
    <div
      onClick={onTap}
      className="w-36 h-36 mx-auto cursor-pointer animate-float drop-shadow-lg"
    >
      <Lottie animationData={avatarAnim} loop={true} />
    </div>
  );
}
