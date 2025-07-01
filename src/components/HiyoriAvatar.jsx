import React, { useEffect, useRef } from "react";

export default function HiyoriAvatar({ onTap, onLifted, onPosUpdate }) {
  const avatarRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const requestRef = useRef(null);
  const hasLifted = useRef(false);

  const touchStartTime = useRef(0);
  const touchStartPos = useRef({ x: 0, y: 0 });

  const swingAngle = useRef(0);
  const isFalling = useRef(false);
  const dropVelocity = useRef(0);

  const GROUND_Y = 0;

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const updatePosition = () => {
    const el = avatarRef.current;
    if (!el || !onPosUpdate) return;
    const rect = el.getBoundingClientRect();
    onPosUpdate({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  const animate = () => {
    const el = avatarRef.current;
    if (!el) return;

    // ゆらゆら自然な揺れ（ドラッグ中のみ）
    if (isDragging.current) {
      swingAngle.current = Math.sin(Date.now() / 200) * 5;
    } else {
      swingAngle.current *= 0.9;
    }

    // 落下アニメーション
    if (isFalling.current) {
      dropVelocity.current += 1.2;
      pos.current.y += dropVelocity.current;
      if (pos.current.y >= GROUND_Y) {
        pos.current.y = GROUND_Y;
        if (Math.abs(dropVelocity.current) > 4) {
          dropVelocity.current *= -0.3;
        } else {
          dropVelocity.current = 0;
          isFalling.current = false;
        }
      }
    }

    // 高さに応じたスケール（700px以下で縮小）
    const scale = Math.min(1, window.innerHeight / 700);

    el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) rotate(${swingAngle.current}deg) scale(${scale})`;
    updatePosition();
    requestRef.current = requestAnimationFrame(animate);
  };

const handleTouchStart = (e) => {
  const t = e.touches[0];
  const el = avatarRef.current;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  dragOffset.current = {
    x: t.clientX - (rect.left + rect.width * 0.1),
    y: t.clientY - (rect.top + rect.height * 1.5),
  };

  touchStartTime.current = Date.now();
  touchStartPos.current = { x: t.clientX, y: t.clientY };
  isDragging.current = true;
  isFalling.current = false;
  dropVelocity.current = 0;
  hasLifted.current = false; // 🔸毎回初期化！
};

const handleTouchMove = (e) => {
  if (!isDragging.current) return;
  const t = e.touches[0];

  const movedX = Math.abs(t.clientX - touchStartPos.current.x);
  const movedY = Math.abs(t.clientY - touchStartPos.current.y);

  if (!hasLifted.current && (movedX > 10 || movedY > 10)) {
    hasLifted.current = true;
    onLifted?.();
  }

  const baseGround = window.innerHeight - 96;
  const newX = t.clientX - window.innerWidth / 2 - dragOffset.current.x;
  let newY = t.clientY - baseGround - dragOffset.current.y;

  // 🔸 地面より下にいかないよう制限（最低でも 0 ）
  if (newY > 0) newY = 0;

  pos.current.x = newX;
  pos.current.y = newY;
};


const handleTouchEnd = (e) => {
  const elapsed = Date.now() - touchStartTime.current;
  const movedX = Math.abs(touchStartPos.current.x - e.changedTouches[0].clientX);
  const movedY = Math.abs(touchStartPos.current.y - e.changedTouches[0].clientY);
  const isTap = elapsed < 200 && movedX < 10 && movedY < 10;

  if (isTap) {
    onTap?.(); // タップ処理
  }

  // 🔸ドラッグ済みなら onLifted はもう呼ばない
  isDragging.current = false;
  isFalling.current = true;
  dropVelocity.current = 0;
};
  return (
    <div
      className="fixed left-1/2 bottom-24 w-[50vw] max-w-xs select-none z-10"
      ref={avatarRef}
      style={{ transform: "translate(0, 0)", touchAction: "none" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
