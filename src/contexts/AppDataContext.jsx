/* src/contexts/AppDataContext.jsx */
import React, { createContext, useContext, useState, useEffect } from "react";

const Ctx = createContext(null);
export const useAppData = () => useContext(Ctx);

/* 🔸 欠損時に埋めるデフォルト値を先に定義 */
const DEFAULTS = {
  workStyle: "",
  goals: [],
  morningAskTime: "07:30",
  nightAskTime:   "22:00",
  morningMemo: ""
};

export function AppDataProvider({ children }) {
  /* ---------- 個人設定 ---------- */
  const [personal, setPersonal] = useState(() => {
    const saved = localStorage.getItem("personal");
    /* もし古い JSON でも ...DEFAULTS で必ずキーを補完 */
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  });

  /* ---------- そのほかアプリ状態 ---------- */
  const [todos,     setTodos]     = useState([]);
  const [dayPlan,   setDayPlan]   = useState([]);
  const [todayRec,  setTodayRec]  = useState(null);
  const [recLoading,setRecLoading]= useState(false);

  /* ---------- 永続化 ---------- */
  useEffect(() => {
    localStorage.setItem("personal", JSON.stringify(personal));
  }, [personal]);

  return (
    <Ctx.Provider value={{
      personal, setPersonal,
      todos, setTodos,
      dayPlan, setDayPlan,
      todayRec, setTodayRec,
      recLoading, setRecLoading
    }}>
      {children}
    </Ctx.Provider>
  );
}
