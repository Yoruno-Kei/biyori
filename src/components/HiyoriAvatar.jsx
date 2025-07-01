// components/HiyoriAvatar.jsx
import React, { useRef, useState, useEffect } from "react";

const cuteProtestLines = [
  "やめてぇ～っ！落ちるぅぅ～！",
  "うわああ、ご主人ひどいですっ！",
  "ぐるぐるぐるぅ～……もうっ！",
  "うええぇぇ、目が回るぅ……！"
];

export default function HiyoriAvatar({ onTap, onSlide }) {
  const touchStart = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [posX, setPosX] = useState(window.innerWidth / 2);
  const [posY, setPosY] = useState(0);
  const [lineOverride, setLineOverride] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setPosX(window.innerWidth / 2);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    const bounds = e.currentTarget.getBoundingClientRect();
    touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const screenWidth = window.innerWidth;
    let newX = (posX + dx) % screenWidth;
    if (newX < 0) newX += screenWidth;

    setPosX(newX);
    setPosY(-60); // 持ち上げ中の位置
    setRotation(90);

    const randomLine = cuteProtestLines[Math.floor(Math.random() * cuteProtestLines.length)];
    setLineOverride(randomLine);

    onSlide?.({ dx, dy, isDragging: true });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;

    if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
      onSlide?.({ dx, dy, isDragging: false });
    } else if (dt < 500) {
      onTap?.();
    }

    setIsDragging(false);
    setRotation(0);
    setPosY(0); // 地面に戻る
    setLineOverride("");
    touchStart.current = null;
  };

  return (
    <div
      className="w-[50vw] max-w-xs mx-auto select-none touch-manipulation absolute bottom-0"
      style={{
        touchAction: "manipulation",
        transform: `translateX(${posX - window.innerWidth / 2}px) translateY(${posY}px) rotate(${rotation}deg)`
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onTap}
    >
      <img
        src="/biyori/images/Hiyori_idle.png"
        alt="ひより"
        className="w-full h-auto drop-shadow-lg pointer-events-auto transition-transform duration-200 ease-in-out"
        draggable={false}
      />
      {lineOverride && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white border border-pink-300 rounded-xl px-4 py-2 text-sm shadow-md">
          {lineOverride}
        </div>
      )}
    </div>
  );
}
