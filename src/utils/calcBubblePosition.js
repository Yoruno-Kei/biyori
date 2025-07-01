export function calcBubblePosition({
  faceX,
  faceY,
  bubbleWidth = 300,
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

  // tailLeft: キャラ位置に近い位置にしっぽをつける（最大で吹き出し横幅の中）
  const tailLeftPx = Math.max(16, Math.min(faceX - left, bubbleWidth - 16));
  const tailLeftPercent = (tailLeftPx / bubbleWidth) * 100;

  // 角度（吹き出し中心から顔への方向）
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
