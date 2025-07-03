/* src/App.jsx */
import React, { useState, useEffect } from "react";
import Home             from "./pages/Home";               // ← pages 配下なら
import PersonalModal    from "./components/PersonalModal";
import QuestionScheduler from "./components/QuestionScheduler";
import { subscribePush } from "./utils/push";

export default function App() {
  const [open, setOpen] = useState(false);  
  useEffect(()=>{
    subscribePush().catch(()=>{/* ユーザー拒否でも無視 */});
  },[]);

  return (
    <>
      <Home onOpenSetting={()=>setOpen(true)} />
      <PersonalModal open={open} onClose={()=>setOpen(false)} />

      {/* 毎分チェックして自動で質問モーダルを出す */}
      <QuestionScheduler />
    </>
  );
}
