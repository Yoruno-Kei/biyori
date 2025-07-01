import { useState } from "react";

const moodToPose = {
  normal: "idle",
  happy: "talk",
  sleep: "sleep",
  warning: "worry",
  angry: "angry",
  sad: "sad",
  jump: "jump",
  point: "point",
  sit: "sit",
  sit_fall: "sit_fall",
  grabed: "grabed",
  walk: "walk",
  back: "back",
  turn: "turn",
};

export default function usePoseControl() {
  const [pose, setPose] = useState("idle");

  const setPoseByMood = (mood) => {
    setPose(moodToPose[mood] || "idle");
  };

  return { pose, setPose, setPoseByMood };
}
