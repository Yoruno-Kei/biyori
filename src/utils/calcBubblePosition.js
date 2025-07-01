export function calcBubblePosition({
  faceX,
  faceY,
  bubbleWidth = 200,
  bubbleHeight = 140,
  offsetAbove = 60,
}) {
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 360;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800;

  const top = Math.max(8, faceY - bubbleHeight - offsetAbove);
  const left = Math.max(
    8,
    Math.min(faceX - bubbleWidth / 2, screenWidth - bubbleWidth - 8)
  );

  const tailLeftPercent = ((faceX - left) / bubbleWidth) * 100;

  // 🔸 しっぽの向きを求める角度（ラジアン → 度に変換）
  const centerX = left + bubbleWidth / 2;
  const centerY = top + bubbleHeight / 2;
  const dx = faceX - centerX;
  const dy = faceY - centerY;
  const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);

  return {
    top,
    left,
    width: bubbleWidth,
    tailLeftPercent,
    tailAngleDeg: angleDeg,
  };
}
