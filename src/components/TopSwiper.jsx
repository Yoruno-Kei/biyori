/* src/components/TopSwiper.jsx */
import React, { useState, useRef } from "react";
import TodoPanel     from "./panels/TodoPanel";
import CalendarPanel from "./panels/CalendarPanel";
import TodayPanel    from "./panels/TodayPanel";
import TodayRecPanel    from "./panels/TodayRecPanel";

/* スライドする 3 ページ */
const pages = [
  {key:"todayRec",node:<TodayRecPanel/>},
  { key:"todo",      node:<TodoPanel/>     },
  { key:"calendar",  node:<CalendarPanel/> },
  { key:"today",     node:<TodayPanel/>    },
];

export default function TopSwiper() {
  const [idx, setIdx] = useState(0);
  const startX = useRef(0);

  /* ───────── スワイプ判定 ───────── */
  const onStart = e => { startX.current = e.touches[0].clientX; };
  const onEnd   = e => {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) < 80) return;
    if (dx < 0 && idx < pages.length-1) setIdx(idx+1);
    if (dx > 0 && idx > 0)              setIdx(idx-1);
  };

  /* サイズ定数（必要なら好みで調整） */
  const CARD_W  = "90vw";
  const CARD_H  = "38vh";

  return (
    <>
      {/* ========= ビューポート（下寄せ） ========= */}
      <div
        className="fixed z-[5] left-1/2 top-[88px] -translate-x-1/2
                   overflow-hidden select-none"
        style={{ width:CARD_W, height:CARD_H, maxWidth:720, maxHeight:340 }}
        onTouchStart={onStart}
        onTouchEnd={onEnd}
      >
        {/* ========= スライド列 ========= */}
        <div
          className="flex h-full transition-transform duration-300"
          style={{ transform:`translateX(-${idx*100}%)` }}
        >
          {pages.map(p=>(
            <div key={p.key}
              className="shrink-0 h-full px-[3vw] box-border flex items-center justify-center"
              style={{ width:CARD_W, maxWidth: 730}}
            >
              {/* ----- かわいいカード ----- */}
              <div className="w-full h-full rounded-[24px] shadow-xl overflow-y-auto
                              border-4 border-pink-200
                              bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50
                              patterned relative">
                <div className="p-4">{p.node}</div>
                {/* 水玉ドット背景（pseudo で繰り返し） */}
                <style jsx>{`
                  .patterned::before{
                    content:"";
                    position:absolute; inset:0;
                    background-image:
                      radial-gradient(#f8d4e2 1px, transparent 1px);
                    background-size:12px 12px;
                    opacity:0.25; pointer-events:none;
                    border-radius:20px;
                  }
                `}</style>
              </div>
            </div>
          ))}
        </div>

        {/* ========= インジケータ (ハート) ========= */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {pages.map((_,i)=>(
            <svg key={i} width="16" height="16"
                 className={i===idx?"fill-pink-500":"fill-gray-300/70"}>
              <path d="M8 14S1 9 1 5a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4-7 9-7 9z"/>
            </svg>
          ))}
        </div>
      </div>

      {/* ========= landscape ========= */}
      <style jsx="true">{`
        @media (orientation: landscape) {
          .fixed {
            left: 16px !important;
            bottom: 16px !important;
            transform: none !important;
            width: 45vw !important;
            height: 90vh !important;
            max-width: none !important;
            max-height: none !important;
          }
        }
      `}</style>
    </>
  );
}
