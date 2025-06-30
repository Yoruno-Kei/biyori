import React, { useRef } from "react";

export default function HiyoriAvatar({ onTap, onSlide }) {
  const touchStart = useRef(null);

  // タップとスライド判定
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
  };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;
    if (Math.abs(dx) > 40 || Math.abs(dy) > 40) {
      onSlide && onSlide({ dx, dy });
    } else if (dt < 500) {
      onTap && onTap();
    }
    touchStart.current = null;
  };

  return (
    <div
      className="w-[40vw] max-w-xs mx-auto select-none"
      style={{ touchAction: "manipulation" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onTap}
    >
      <img
        src="/assets/images/Hiyori_idle.png"
        alt="ひより"
        className="w-full h-auto drop-shadow-lg pointer-events-none"
        draggable={false}
      />
    </div>
  );
}
