import { useState, useRef, useEffect } from "react";
import { fetchGemini } from "../api/GeminiClient";
import { generateHiyoriPrompt } from "../utils/GeminiPrompt";
import { tapJumpLines, tapSurpriseLines, liftLines, dragDropLines } from "../utils/speechPresets";
import { getPoseFromMood } from "../components/usePoseControl";
import { getTimeLabel } from "../utils/getTimeLabel";
import useIdleMonitor from "./useIdleMonitor";
import { useAppData } from "../contexts/AppDataContext";

const idleMoods = [
  "happy","point","sleep","sleep_sit","sit",
  "sad","angry","warning","normal","normal_idle","surprise"
];

export default function useHiyoriLogic() {

  /* ---------- state ---------- */
  const [text,setText]         = useState("");
  const [showBubble,setShow]   = useState(false);
  const [mood,setMood]         = useState("normal");
  const [pose,setPose]         = useState("idle");
  const [direction,setDir]     = useState("right");

  const [isReq,setReq]   = useState(false);
  const [isSpeak,setSp]  = useState(false);
  const [isDrag,setDrag] = useState(false);
  const [isJump,setJump] = useState(false);
  const [isWalk,setWalk] = useState(false);

  const { setTodayRec, setRecLoading } = useAppData();

  const posRef      = useRef({x:0,y:0});
  const [,force]    = useState(0);

  const hideTimer  = useRef(null);   // 吹き出しを閉じるタイマー
  const idleTimer  = useRef(null);   // idle に戻すタイマー

  /* ---------- Gemini 発話 ---------- */
  const speak = async()=>{
    if(recLoading ||isReq||isJump||isDrag) return;

    clearTimeout(hideTimer.current);
    clearTimeout(idleTimer.current);

    setReq(true); 
    setPose("normal_idle");
    setSp(true);

    const prompt = generateHiyoriPrompt({ timeLabel:Math.random()<.3?getTimeLabel():null });
    const { mood:newMood, text:line } = await fetchGemini(prompt, "hiyori");
    if(!idleMoods.includes(newMood)){ setReq(false); setSp(false); return; }

    setText(line); setMood(newMood); setShow(true); setPose(getPoseFromMood(newMood));
    const hold = 1000;
    const disp = Math.max(2500,line.length*80);
    hideTimer.current = setTimeout(() => setShow(false), disp);
    idleTimer.current = setTimeout(() => { setSp(false); setPose("idle"); }, disp + hold);
    setReq(false);
  };

  const FIXED_MIN  = 4000;   // 最低表示 4 s（旧: 2.5 s）
  const FIXED_CHAR = 120;    // 1 文字あたり 120 ms（旧: 80 ms）

/* ---------- 固定セリフ (堅牢版) ---------- */
const speakFixedLine = (lines, fallbackMood = "warning") => {
  if (!Array.isArray(lines) || lines.length === 0) return;

  const pick      = lines[Math.floor(Math.random() * lines.length)];
  const lineText  = typeof pick === "string" ? pick : pick.text || "";
  const lineMood  = typeof pick === "string" ? fallbackMood : pick.mood || fallbackMood;
  if (!lineText) return;

  setText(lineText);
  setMood(lineMood);
  setShow(true);
  setSp(true);
  setPose(getPoseFromMood(lineMood));

  const disp = Math.max(FIXED_MIN, lineText.length * FIXED_CHAR);
  setTimeout(() => {
    setShow(false);       // 吹き出し非表示
    setSp(false);         // 発話フラグOFF
    setPose("idle");      // ポーズを即 idle へ
  }, disp);
};

const speakDropLine = () => {
  const pick = dragDropLines[Math.floor(Math.random() * dragDropLines.length)];
  const drop = pick.text, m = pick.mood;

  setText(drop);
  setMood(m);
  setShow(true);
  setSp(true);
  setPose(getPoseFromMood(m));

  const disp = Math.max(FIXED_MIN, drop.length * FIXED_CHAR);

  setTimeout(() => {
    setShow(false);
    setSp(false);
    setPose("idle");
  }, disp);
};



  /* ---------- タップ ---------- */
const handleTap = () => {
  if (recLoading ||isReq || isSpeak || isDrag || isJump) return true;  // true を返すと Avatar がジャンプ

  // 50 % ずつジャンプ or サプライズ
  if (Math.random() < 0.5) {
    /* ジャンプ */
    setJump(true);
    setPose("jump");

    setTimeout(() => {
      setJump(false);
      setPose("idle");
      speakFixedLine(tapJumpLines);          // 固定セリフ
    }, 1000);

    return true;                             // ← Avatar に「ジャンプしてOK」と伝える
  }

  /* サプライズ（ジャンプしない） */
  setPose("surprise");
  speakFixedLine(tapSurpriseLines);          // 固定セリフ
  setTimeout(() => setPose("idle"), 2000);

  return false;                              // ← Avatar に「ジャンプ禁止」と伝える
};

  /* ---------- ドラッグ ---------- */
  const handleSlide = ({dx})=>{
    if(recLoading) return;
    if(!isDrag){ setDrag(true); setPose("grabed"); setDir(dx<0?"left":"right"); }
  };

  /* ---------- Drop 完了 ---------- */
  const triggerDropCompleted = ()=>{ speakDropLine(); setDrag(false); };

  const { recLoading } = useAppData();

 /* recLoading → thinking ポーズ固定 */
  useEffect(()=>{
    if(recLoading){
      setPose("thinking");
      setSp(false); setReq(false); setDrag(false); setJump(false); setWalk(false);
      setShow(false);               // 吹き出しも閉じる
    }
  },[recLoading]);

/* ---------- Idle マネージャ ---------- */
useEffect(() => {
  /* 内部ステート */
  let phase = "idle";             // "idle" | "walk" | "special"
  let phaseTimer = null;          // setTimeout の ID 保持

  /* ユーザー操作が入ったら idle に戻す関数 */
  const resetToIdle = () => {
    clearTimeout(phaseTimer);
    phase = "idle";
    setPose("idle");
    setWalk(false);
  };

  /* 外から呼べるように、リセット関数をグローバルに登録 */
  window.__HIYORI_CANCEL_IDLE = resetToIdle;

  /* フェーズ進行関数 */
  const nextPhase = () => {
    if (recLoading ||isReq || isDrag || isJump || isSpeak) {
      /* いずれか動作中ならリセット */
      resetToIdle();
      phaseTimer = setTimeout(nextPhase, 4000);
      return;
    }

    switch (phase) {
      case "idle": {                 /* -------- idle → walk へ -------- */
        phase = "walk";
        setPose("walk");
        setWalk(true);
        phaseTimer = setTimeout(nextPhase, 4000); // 5 秒歩き続ける
        break;
      }
      case "walk": {                 /* -------- walk → special へ ----- */
        phase = "special";
        setWalk(false);

        /* 5 つの特殊ポーズから等確率抽選 */
        const specials = ["sleep_sit", "sleep", "sit", "point", "back"];
        const pick = specials[Math.floor(Math.random() * specials.length)];

        if (pick === "back") {
          /* back → turn → idle へ */
          setPose("back");
          setTimeout(() => {
            setPose("turn");
            phaseTimer = setTimeout(() => {
              resetToIdle();
              phaseTimer = setTimeout(nextPhase, 8000); // idle 維持 8 秒後再抽選
            }, 2000);
          }, 2000);
        } else {
          setPose(pick);
          phaseTimer = setTimeout(() => {
            resetToIdle();
            phaseTimer = setTimeout(nextPhase, 8000);   // idle 維持 8 秒後再抽選
          }, 6000);  // special を最低 6 秒維持
        }
        break;
      }
      case "special": {
        /* ここには来ないが念のため idle へ */
        resetToIdle();
        phaseTimer = setTimeout(nextPhase, 10000);
        break;
      }
    }
  };

  /* 初回キック */
  phaseTimer = setTimeout(nextPhase, 5000);  // 起動後 5 秒後に first walk

  /* クリーンアップ */
  return () => clearTimeout(phaseTimer);
}, [isReq, isDrag, isJump, isSpeak, recLoading]);


  /* ---------- 10分強制発話 ---------- */
  useIdleMonitor(()=>speak(),600000);

  /* ---------- 座標 ---------- */
  const handlePosUpdate=p=>{ posRef.current=p; force(v=>v+1); };

  return {
    text,mood,pose,direction,showBubble,
    handleTap,handleSlide,handlePosUpdate,setDirection:setDir,
    speakDropLine,speakFixedLine,
    posRef,triggerDropCompleted,
  };
}
