export function calcBubblePosition({
  faceX,
  faceY,
  bubbleWidth = 200,
  bubbleHeight = 140,
  offsetAbove = 60, // 顔の上に表示（顔から何px上）
}) {
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 360;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800;

  // 吹き出しの Y 位置（顔の上に表示）
  const top = Math.max(8, faceY - bubbleHeight - offsetAbove);

  // 吹き出しの X 位置（中心に合わせる、左右のはみ出し防止）
  const left = Math.max(
    8,
    Math.min(faceX - bubbleWidth / 2, screenWidth - bubbleWidth - 8)
  );

  // しっぽの位置（%指定）
  const tailLeftPercent = ((faceX - left) / bubbleWidth) * 100;

  return { top, left, tailLeftPercent, width: bubbleWidth };
}
