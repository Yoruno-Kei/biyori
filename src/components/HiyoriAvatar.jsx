// HiyoriAvatar.jsx
import React, { useEffect, useRef } from "react";

export default function HiyoriAvatar({ onTap, onSlide, onLifted, onPosUpdate }) {
  const avatarRef = useRef(null);
  const touchStart = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const requestRef = useRef(null);
  const GROUND_Y = window.innerHeight - 180; // 地面位置の基準

  // 初期化: 中央に配置
  useEffect(() => {
    onPosUpdate?.({ x: window.innerWidth / 2, y: GROUND_Y });
  }, []);

  const animate = () => {
    const el = avatarRef.current;
    if (!el) return;

    el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) rotate(${isDragging.current ? 90 : 0}deg)`;
    onPosUpdate?.({
      x: el.getBoundingClientRect().left + el.offsetWidth / 2,
      y: el.getBoundingClientRect().top + el.offsetHeight / 2,
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    isDragging.current = true;
    onLifted?.();
    requestRef.current = requestAnimationFrame(animate);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || !touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    pos.current.x = dx;
    pos.current.y = Math.min(dy, GROUND_Y - avatarRef.current.getBoundingClientRect().top - avatarRef.current.offsetHeight / 2);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current) return;

    cancelAnimationFrame(requestRef.current);
    isDragging.current = false;

    const duration = 400;
    const steps = 20;
    const startX = pos.current.x;
    const startY = pos.current.y;
    let currentStep = 0;

    const animateBack = () => {
      currentStep++;
      const progress = currentStep / steps;
      pos.current.x = startX * (1 - progress);
      pos.current.y = startY * (1 - progress);

      const el = avatarRef.current;
      if (el) {
        el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) rotate(0deg)`;
        onPosUpdate?.({
          x: el.getBoundingClientRect().left + el.offsetWidth / 2,
          y: el.getBoundingClientRect().top + el.offsetHeight / 2,
        });
      }

      if (currentStep < steps) {
        requestAnimationFrame(animateBack);
      }
    };
    animateBack();

    touchStart.current = null;
  };

  return (
    <div
      className="w-[50vw] max-w-xs mx-auto select-none transition-transform duration-300"
      ref={avatarRef}
      style={{ touchAction: "manipulation" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        if (!isDragging.current) onTap?.();
      }}
    >
      <img
        src="/biyori/images/Hiyori_idle.png"
        alt="ひより"
        className="w-full h-auto drop-shadow-md pointer-events-auto select-none"
        draggable={false}
      />
    </div>
  );
}
