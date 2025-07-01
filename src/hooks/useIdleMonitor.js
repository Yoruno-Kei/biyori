// src/hooks/useIdleMonitor.js
import { useEffect } from "react";

export default function useIdleMonitor(callback, timeout = 10 * 60 * 1000) {
  useEffect(() => {
    let timer = setTimeout(callback, timeout);

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(callback, timeout);
    };

    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("click", reset);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("click", reset);
    };
  }, [callback, timeout]);
}
