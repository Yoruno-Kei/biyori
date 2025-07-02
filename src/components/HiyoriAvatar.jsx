import React, { useEffect, useLayoutEffect, useRef } from "react";
import poseImages from "./poseImages";

export default function HiyoriAvatar({
  pose           = "idle",
  direction      = "right",
  isSpeaking     = false,
  speakDropLine,
  setDirection,
  onTap,
  onLifted,
  onPosUpdate,
}) {
  /* refs ------------------------------------------------------------ */
  const avatarRef  = useRef(null);
  const pos        = useRef({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const hasLifted  = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const touchStart = useRef(0);

  const isJumping  = useRef(false);
  const jumpVel    = useRef(0);
  const isFalling  = useRef(false);
  const fallVel    = useRef(0);
  const fromDrag   = useRef(false);
  const dropDone   = useRef(false);

  const swing      = useRef(0);
  const reqId      = useRef(null);

  const GROUND_Y = -20;

  /* ---------- 初期位置：中央より少し右 ---------- */
  useLayoutEffect(() => {
    pos.current.x = window.innerWidth * 0.15;
    pos.current.y = GROUND_Y;
  }, []);

  /* ---------- メインループ ---------- */
  useEffect(() => {
    const animate = () => {
      const el = avatarRef.current;
      if (!el) { reqId.current = requestAnimationFrame(animate); return; }

      /* 1. walk */
      if (pose === "walk" && !isDragging.current && !isJumping.current) {
        pos.current.x += direction === "left" ? -2 : 2;
      }

      /* 2. Clamp & 反転 */
      const scaleVal = Math.min(1, window.innerHeight / 700);
      const rectVis  = avatarRef.current.getBoundingClientRect().width;   // 実幅
      const minT = (-window.innerWidth / 2 + rectVis / 2) / scaleVal;
      const maxT = ( window.innerWidth / 2 - rectVis / 2) / scaleVal;                              // translate 座標

      if (pos.current.x <= minT) {
        pos.current.x = minT;
        setDirection?.(() => "right");
      }
      if (pos.current.x >= maxT) {
        pos.current.x = maxT;
        setDirection?.(() => "left");
      }

      /* 3. swing */
      swing.current = isDragging.current
        ? Math.sin(Date.now() / 200) * 5
        : swing.current * 0.9;

      /* 4. ジャンプ & 落下 */
      if (isJumping.current) {
        pos.current.y += jumpVel.current;
        jumpVel.current += 0.6;
        if (jumpVel.current >= 0) {
          isFalling.current = true;
          fallVel.current   = 0;
        }
      }

      if (isFalling.current) {
        fallVel.current += 1.2;
        pos.current.y   += fallVel.current;
        if (pos.current.y >= GROUND_Y) {
          pos.current.y = GROUND_Y;
          if (Math.abs(fallVel.current) > 4) fallVel.current *= -0.3;
          else {
            isFalling.current = false;
            isJumping.current = false;
            if (fromDrag.current && !dropDone.current && speakDropLine) {
              dropDone.current = true;
              speakDropLine();
            }
          }
        }
      }

      /* 5. transform */
      const flip = direction === "left" ? 1 : -1;
      el.style.transform =
      `translateX(-50%) ` +  
        `translate(${pos.current.x}px,${pos.current.y}px)` +
        ` scale(${flip},1) scale(${scaleVal})` +
        ` rotate(${swing.current}deg)`;

      /* 6. 座標通知 */
      if (onPosUpdate) {
        const r = el.getBoundingClientRect();
        onPosUpdate({ x: r.left + r.width / 2, y: r.top + r.height * 0.28 });
      }

      reqId.current = requestAnimationFrame(animate);
    };
    reqId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqId.current);
  }, [direction, pose, setDirection, speakDropLine, onPosUpdate]);

  /* ---------- touch handlers ---------- */
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    const el = avatarRef.current; if (!el) return;
    const r = el.getBoundingClientRect();

    dragOffset.current = {
      x: t.clientX - (r.left + r.width / 2.3),
      y: t.clientY - (r.top  + r.height * 0.85),
    };

    isDragging.current = true;
    hasLifted.current  = false;
    isFalling.current  = false;
    dropDone.current   = false;
    isJumping.current  = false;
    fromDrag.current   = true;
    touchStart.current = Date.now();
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const t = e.touches[0];

    if (!hasLifted.current) { hasLifted.current = true; onLifted?.(); }

    pos.current.x = t.clientX - dragOffset.current.x - window.innerWidth / 2;

    const scaleVal = Math.min(1, window.innerHeight / 700);
    const rectW    = avatarRef.current.getBoundingClientRect().width;
    const halfImgT = rectW / 2 / scaleVal;
    const minT     = -window.innerWidth / 2 + halfImgT;
    const maxT     =  window.innerWidth / 2 - halfImgT;
    pos.current.x  = Math.max(minT, Math.min(maxT, pos.current.x));

    let newY = t.clientY - dragOffset.current.y - (window.innerHeight - 96);
    newY = Math.max(-window.innerHeight * 0.6, Math.min(0, newY));
    pos.current.y = newY;
  };

  const handleTouchEnd = (e) => {
    const t       = e.changedTouches[0];
    const moved   = Math.hypot(
      t.clientX - (e.targetTouches[0]?.clientX ?? t.clientX),
      t.clientY - (e.targetTouches[0]?.clientY ?? t.clientY)
    );
    const elapsed = Date.now() - touchStart.current;
    const isTap   = moved < 10 && elapsed < 200;

    if (isTap && !isSpeaking) {
      isJumping.current = true;
      jumpVel.current   = -12;
      fromDrag.current  = false;
      onTap?.();
    } else {
      isFalling.current = true;
      fallVel.current   = 0;
    }
    isDragging.current = false;
  };

  /* pose 決定 */
  let displayPose = pose;
  if (isJumping.current)                       displayPose = "jump";
  else if (isFalling.current && fromDrag.current) displayPose = "sit_fall";
  else if (isDragging.current)                 displayPose = "grabed";
  else if (isSpeaking)                         displayPose = pose;

  return (
    <div
      ref={avatarRef}
      className="fixed bottom-5 left-1/2 w-[50vw] max-w-xs z-10 touch-none select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={poseImages[displayPose] || poseImages["idle"]}
        alt="ひより"
        className="w-full h-auto drop-shadow-md pointer-events-auto"
        draggable={false}
      />
    </div>
  );
}
