import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function HiyoriLottie({ anim = "idle" }) {
  const containerRef = useRef(null);
  const animInstance = useRef(null);

  useEffect(() => {
    const path = `/biyori/images/lottie/${anim}.json`; // 例: /lottie/idle.json, /lottie/talk.json など

    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error("Animation not found");
        return res.json();
      })
      .then((data) => {
        animInstance.current?.destroy();
        animInstance.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData: data,
        });
      })
      .catch((err) => {
        console.error("Lottie animation load error:", err);
      });

    return () => animInstance.current?.destroy();
  }, [anim]);

  return (
    <div
      ref={containerRef}
      className="w-full h-auto pointer-events-none select-none"
    />
  );
}
