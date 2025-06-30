// HiyoriAvatar.jsx
import React, { useRef } from "react";

export default function HiyoriAvatar({ onTap, onSlide }) {
  const touchStart = useRef(null);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, time: Date.now() };
    console.log("[TouchStart]", touchStart.current);
  };

  const handleTouchMove = (e) => {
    if (!touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    console.log("[TouchMove] dx:", dx, "dy:", dy);
    onSlide && onSlide({ dx, dy, isDragging: true });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;
    console.log("[TouchEnd] dx:", dx, "dy:", dy, "dt:", dt);

    if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
      console.log("[TouchEnd] Trigger slide");
      onSlide && onSlide({ dx, dy, isDragging: false });
    } else if (dt < 500) {
      console.log("[TouchEnd] Trigger tap");
      onTap && onTap();
    }

    touchStart.current = null;
  };

  return (
    <div
      className="w-[50vw] max-w-xs mx-auto select-none"
      style={{ touchAction: "manipulation" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onTap}
    >
      <img
        src="/biyori/images/Hiyori_idle.png"
        alt="ひより"
        className="w-full h-auto drop-shadow-lg pointer-events-auto select-none"
        draggable={false}
      />
    </div>
  );
}
