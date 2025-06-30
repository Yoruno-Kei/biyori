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

    // ドラッグ判定を画像中心の小さな領域に限定（服をつかまれる想定）
    const relativeX = t.clientX - bounds.left;
    const relativeY = t.clientY - bounds.top;
    const withinMiddle = relativeX > bounds.width * 0.4 && relativeX < bounds.width * 0.6 && relativeY > bounds.height * 0.4 && relativeY < bounds.height * 0.6;
    if (!withinMiddle) return;

    touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const angle = Math.max(-60, Math.min(60, dx)); // 最大 ±60度（ぶら下がる感）
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
    setRotation(90); // 掴まれたあと90度まで回転しその後戻る
    setTimeout(() => setRotation(0), 300);
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
        className="w-full h-auto drop-shadow-lg pointer-events-auto transition-transform duration-200 ease-in-out"
        style={{ transform: `rotate(${rotation}deg)` }}
        draggable={false}
      />
    </div>
  );
}
