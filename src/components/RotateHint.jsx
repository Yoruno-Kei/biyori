/* src/components/RotateHint.jsx */
import React, { useEffect, useState } from "react";

export default function RotateHint() {
  const [show, setShow] = useState(
    window.matchMedia("(orientation: landscape)").matches
  );

  /* 画面回転を監視 */
  useEffect(() => {
    const mq = window.matchMedia("(orientation: landscape)");
    const fn = e => setShow(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  if (!show) return null;

  return (
    <div className="rotate-mask">
        <div className="rm-inner">
      {/* スマホ＋矢印アイコン */}
      <div className="phone-wrap">
        <svg viewBox="0 0 60 100" className="phone">
          <rect x="5" y="5" width="50" height="90" rx="8" />
          <circle cx="30" cy="85" r="4" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 24 24" className="arrow">
          <path d="M12 2v20m0 0l-6-6m6 6l6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
        </svg>
      </div>
      <p className="msg">縦向きでご利用ください</p>
      </div>
    </div>
  );
}
