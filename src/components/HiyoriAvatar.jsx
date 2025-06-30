// components/HiyoriAvatar.jsx
import React, { useRef, useState } from "react";

export default function HiyoriAvatar({ onTap, onSlide }) {
  const touchStart = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    const bounds = e.currentTarget.getBoundingClientRect();
    const centerY = bounds.top + bounds.height / 2;
    const centerX = bounds.left + bounds.width / 2;

    if (Math.abs(t.clientY - centerY) > bounds.height * 0.25 ||
        Math.abs(t.clientX - centerX) > bounds.width * 0.3) return;

    touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const angle = Math.max(-20, Math.min(20, dx / 3)); // 最大回転角 ±20度
    setRotation(angle);
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
    touchStart.current = null;
  };

  return (
    <div
      className="w-[50vw] max-w-xs mx-auto select-none touch-manipulation"
      style={{ touchAction: "manipulation" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onTap}
    >
      <img
        src="/biyori/images/Hiyori_idle.png"
        alt="ひより"
        className="w-full h-auto drop-shadow-lg pointer-events-auto transition-transform duration-100 ease-in-out"
        style={{ transform: `rotate(${rotation}deg)` }}
        draggable={false}
      />
    </div>
  );
}