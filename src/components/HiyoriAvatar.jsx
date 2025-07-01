// HiyoriAvatar.jsx
import React, { useEffect, useRef } from "react";

export default function HiyoriAvatar({ onTap, onSlide, onLifted, onPosUpdate }) {
  const avatarRef = useRef(null);
  const touchStart = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const requestRef = useRef(null);
  const GROUND_Y = window.innerHeight - 96; // h-24の高さに合わせる

  // 初期位置: 画面下部中央
  useEffect(() => {
    onPosUpdate?.({ x: window.innerWidth / 2, y: GROUND_Y });
  }, []);

  const animate = () => {
    const el = avatarRef.current;
    if (!el) return;

    // 回転や位置の更新
    el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) rotate(${isDragging.current ? 90 : 0}deg)`;

    // 吹き出し表示位置更新用
    const rect = el.getBoundingClientRect();
    onPosUpdate?.({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    isDragging.current = true;
    onLifted?.(); // 持ち上げ発話
    requestRef.current = requestAnimationFrame(animate);
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || !touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;

    pos.current.x = dx;

    // 地面より下に行かせない
    const el = avatarRef.current;
    if (el) {
      const newTop = el.offsetTop + dy;
      const maxY = GROUND_Y - el.offsetHeight;
      pos.current.y = Math.min(dy, maxY - el.offsetTop);
    }
  };

  const handleTouchEnd = () => {
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
        const rect = el.getBoundingClientRect();
        onPosUpdate?.({
          x: rect.left + rect.width / 2,
          y: rect.top,
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
