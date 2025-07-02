import React, { useEffect, useRef } from "react";
import poseImages from "./poseImages";

export default function HiyoriAvatar({
  onTap,
  onLifted,
  onPosUpdate,
  pose = "idle",
  direction = "right",
}) {
  const avatarRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const isJumping = useRef(false);
  const jumpVelocity = useRef(0);
  const isFalling = useRef(false);
  const dropVelocity = useRef(0);
  const dragOffset = useRef({ x: 0, y: 0 });
  const hasLifted = useRef(false);
  const touchStartTime = useRef(0);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const requestRef = useRef(null);
  const swingAngle = useRef(0);
  const GROUND_Y = -20;

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const animate = () => {
    const el = avatarRef.current;
    if (!el) return;

    swingAngle.current = isDragging.current
      ? Math.sin(Date.now() / 200) * 5
      : swingAngle.current * 0.9;

    // ジャンプ
    if (isJumping.current) {
      pos.current.y += jumpVelocity.current;
      jumpVelocity.current += 0.6;
      if (jumpVelocity.current >= 0) {
        isJumping.current = false;
        isFalling.current = true;
        dropVelocity.current = 0;
      }
    }

    // 落下
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

    const scale = Math.min(1, window.innerHeight / 700);
    const flip = direction === "left" ? -1 : 1;

    el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) rotate(${swingAngle.current}deg) scale(${flip},1) scale(${scale})`;
    updatePosition();
    requestRef.current = requestAnimationFrame(animate);
  };

  const updatePosition = () => {
    const el = avatarRef.current;
    if (!el || !onPosUpdate) return;
    const rect = el.getBoundingClientRect();
    onPosUpdate({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height * 0.28,
    });
  };

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    const el = avatarRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    dragOffset.current = {
      x: t.clientX - (rect.left + rect.width * 0.05),
      y: t.clientY - (rect.top + rect.height * 1),
    };

    touchStartTime.current = Date.now();
    touchStartPos.current = { x: t.clientX, y: t.clientY };
    isDragging.current = true;
    isFalling.current = false;
    dropVelocity.current = 0;
    hasLifted.current = false;
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
    if (newY > 0) newY = 0;

    pos.current.x = newX;
    pos.current.y = newY;
    updatePosition();
  };

  const handleTouchEnd = (e) => {
    const elapsed = Date.now() - touchStartTime.current;
    const movedX = Math.abs(touchStartPos.current.x - e.changedTouches[0].clientX);
    const movedY = Math.abs(touchStartPos.current.y - e.changedTouches[0].clientY);
    const isTap = elapsed < 200 && movedX < 10 && movedY < 10;

    if (isTap) {
      jumpVelocity.current = -10
      isJumping.current = true;
      onTap?.();
    }

    isDragging.current = false;
    isFalling.current = true;
    dropVelocity.current = 0;
  };

  // 💡 pose 表示の最終決定ロジック
  let displayPose = pose;

  if (isJumping.current || pose === "jump") {
    displayPose = "jump"; // jump中は必ずjump固定
  } else if (isFalling.current && !isJumping.current && !isDragging.current) {
    displayPose = "sit_fall"; // drag後に離したときのみ自動でsit_fallにする
  } else if (isDragging.current) {
    displayPose = "grabed";
  }

  return (
    <div
      className="fixed left-1/2 bottom-5 w-[50vw] max-w-xs select-none z-10"
      ref={avatarRef}
      style={{ transform: "translate(0, 0)", touchAction: "none" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={poseImages[displayPose] || poseImages["idle"]}
        alt="ひより"
        className="w-full h-auto pointer-events-auto drop-shadow-md"
        draggable={false}
      />
    </div>
  );
}
