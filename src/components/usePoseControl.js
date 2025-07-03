// src/components/usePoseControl.js
export const moodToPose = {
  normal: "idle",
  normal_idle: "normal_idle",
  talk: "talk",
  happy: "happy",
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
  surprise: "surprise",
  thinking: "thinking",
};

export const getPoseFromMood = (mood) => moodToPose[mood] || "idle";
