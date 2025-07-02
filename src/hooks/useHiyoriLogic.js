import { useState, useRef, useEffect } from "react";
import { fetchHiyoriLine } from "../api/GeminiClient";
import { generateHiyoriPrompt } from "../utils/GeminiPrompt";
import { dragDropLines, liftLines } from "../utils/speechPresets";
import { getPoseFromMood } from "../components/usePoseControl";
import { getTimeLabel } from "../utils/getTimeLabel";
import useIdleMonitor from "./useIdleMonitor";

const idleMoods = [
  "happy","point","sleep","sleep_sit","sit",
  "sad","angry","warning","normal","normal_idle"
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

  const posRef      = useRef({x:0,y:0});
  const [,force]    = useState(0);

  const hideTimer  = useRef(null);   // 吹き出しを閉じるタイマー
  const idleTimer  = useRef(null);   // idle に戻すタイマー

  /* ---------- Gemini 発話 ---------- */
  const speak = async()=>{
    if(isReq||isJump||isDrag) return;

    clearTimeout(hideTimer.current);
    clearTimeout(idleTimer.current);

    setReq(true); 
    setPose("normal_idle");
    setSp(true);

    const prompt = generateHiyoriPrompt({ timeLabel:Math.random()<.3?getTimeLabel():null });
    const { mood:newMood, text:line } = await fetchHiyoriLine(prompt);
    if(!idleMoods.includes(newMood)){ setReq(false); setSp(false); return; }

    setText(line); setMood(newMood); setShow(true); setPose(getPoseFromMood(newMood));
    const hold = 1000;
    const disp = Math.max(2500,line.length*80);
    hideTimer.current = setTimeout(() => setShow(false), disp);
    idleTimer.current = setTimeout(() => { setSp(false); setPose("idle"); }, disp + hold);
    setReq(false);
  };

  /* ---------- 固定セリフ ---------- */
  const speakFixedLine = (lines=liftLines,m="warning")=>{
    const line=lines[Math.floor(Math.random()*lines.length)];
    setText(line); setMood(m); setShow(true); setSp(true); setPose(getPoseFromMood(m));
    const hold=1000;
    setTimeout(()=>setShow(false), Math.max(2500,line.length*80));
    setTimeout(()=>{ setSp(false); setPose("idle"); }, Math.max(2500,line.length*80)+hold);
  };

  const speakDropLine = ()=>{
    const {text:drop,mood:m} = dragDropLines[Math.floor(Math.random()*dragDropLines.length)];
    setText(drop); setMood(m); setShow(true); setSp(true); setPose(getPoseFromMood(m));
    const hold=1000;
    setTimeout(()=>setShow(false), Math.max(2500,drop.length*80));
    setTimeout(()=>{ setSp(false); setPose("idle"); }, Math.max(2500,drop.length*80)+hold);
  };

  /* ---------- タップ ---------- */
  const handleTap = ()=>{
    if(!isReq&&!isSpeak&&!isDrag&&!isJump){
      setJump(true); setPose("jump"); 
      setTimeout(()=>{ setJump(false); speak();},1000);
    }
  };

  /* ---------- ドラッグ ---------- */
  const handleSlide = ({dx})=>{
    if(!isDrag){ setDrag(true); setPose("grabed"); setDir(dx<0?"left":"right"); }
  };

  /* ---------- Drop 完了 ---------- */
  const triggerDropCompleted = ()=>{ speakDropLine(); setDrag(false); };

  /* ---------- Idle Walk ---------- */
  useEffect(()=>{
    const id=setInterval(()=>{
      if(isReq||isDrag||isJump||isSpeak) return;
      if(!isWalk){ setPose("walk"); setWalk(true); }
      const r=Math.random();
      if(r<.02){ setWalk(false); setPose("sleep_sit"); setTimeout(()=>setPose("idle"),4000); }
      else if(r<.04){ setWalk(false); setPose("point");     setTimeout(()=>setPose("idle"),3000); }
      else if(r<.06){ setWalk(false); setPose("back");      setTimeout(()=>{ setPose("turn"); setTimeout(()=>setPose("idle"),1500); },2000); }
    },1000);
    return ()=>clearInterval(id);
  },[isReq,isDrag,isJump,isSpeak,isWalk]);

  /* ---------- 無操作 2〜3分発話 ---------- */
  useEffect(()=>{
    const loop=()=>setTimeout(()=>{
      if(!isReq&&!isDrag&&!isJump&&!isSpeak) speak();
      timer.current=loop();
    },120000+Math.random()*60000);
    const timer={current:loop()};
    return ()=>clearTimeout(timer.current);
  },[isReq,isDrag,isJump,isSpeak]);

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
