/* 表示だけなのでバックエンド不要で動く */
import { useEffect, useState } from "react";
import { useAppData } from "../contexts/AppDataContext";
import QuestionModal  from "./QuestionModal";

export default function QuestionScheduler() {
  const { personal } = useAppData();
  const [modal, setModal] = useState(null);  // "morning" | "night" | null

  useEffect(()=> {
    const timer = setInterval(()=> tick(), 60_000); // 毎分
    tick();                                         // 起動直後1回
    return ()=> clearInterval(timer);
  }, [personal.morningAskTime, personal.nightAskTime]);

  const tick = () => {
    const now  = new Date();
    const hhmm = now.toTimeString().slice(0,5);

    /* helper: window が既にフォーカス & modal 開いてたら無視 */
    if (document.visibilityState !== "visible" || modal) return;

    /* 1. 朝 */
    if (isTimeHit(hhmm, personal.morningAskTime)) {
      setModal("morning");
      return;
    }
    /* 2. 夜 */
    if (isTimeHitNight(hhmm, personal.nightAskTime)) {
      setModal("night");
    }
  };

  return (
    <QuestionModal
      type={modal}
      open={!!modal}
      onClose={()=>setModal(null)}
    />
  );
}

/* "07:30" 等と完全一致した分だけ発火 */
function isTimeHit(nowHHMM, targetHHMM){
  return targetHHMM && nowHHMM === targetHHMM;
}

/* night: 18:00〜翌03:00 許容 */
function isTimeHitNight(nowHHMM, target){
  if (!target) return false;
  const [th,tm] = target.split(":").map(Number);
  const [nh,nm] = nowHHMM.split(":").map(Number);
  const nt = nh*60+nm;
  let tt  = th*60+tm;
  if (th < 4) tt += 24*60;       // 0〜3 時は +24h
  return nt === (tt % (24*60));
}
