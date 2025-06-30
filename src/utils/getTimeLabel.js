// src/utils/getTimeLabel.js
export function getTimeLabel() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return "朝";
    if (hour >= 10 && hour < 17) return "昼";
    if (hour >= 17 && hour < 20) return "夕方";
    if (hour >= 20 || hour < 1) return "夜";
    return "深夜";
  }
  