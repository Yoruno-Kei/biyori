// src/components/usePoseControl.js
export const moodToPose = {
  normal: "idle",
  happy: "talk",
  sleep_sit: "sleep_sit",
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

export const getPoseFromMood = (mood) => moodToPose[mood] || "idle";
