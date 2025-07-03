/* src/components/QuestionModal.jsx */
import React, { useState } from "react";
import { useAppData } from "../contexts/AppDataContext";

export default function QuestionModal({ type, open, onClose }) {
  const { setDayPlan, setPersonal } = useAppData();
  const [memo, setMemo] = useState("");

  const save = () => {
    if (type === "night") {
      /* 日付付きで振り返りを dayPlan へ追記 */
      setDayPlan(dp => [...dp, {
        time: new Date().toLocaleTimeString("ja-JP", {hour:"2-digit",minute:"2-digit"}),
        label: `振り返り：${memo}`
      }]);
    } else {
      /* 朝は personal.morningMemo に保存（例） */
      setPersonal(p => ({ ...p, morningMemo: memo }));
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-72 rounded-xl bg-white shadow-lg p-4">
        <h2 className="font-bold text-sm mb-2">
          {type === "night" ? "今日の振り返り" : "今日の気分や予定"}
        </h2>
        <textarea value={memo} onChange={e=>setMemo(e.target.value)}
                  className="w-full h-24 border p-1 text-sm rounded"/>
        <div className="text-right mt-2 space-x-2">
          <button onClick={onClose} className="text-sm">キャンセル</button>
          <button onClick={save}
                  className="bg-pink-500 text-white text-sm px-3 py-1 rounded">
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
