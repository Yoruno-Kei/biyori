import React, { useState } from "react";
import { useAppData } from "../contexts/AppDataContext";
import { scheduleLocal }  from "../utils/scheduleLocalNotif";
import { subscribePush }  from "../utils/push";     

export default function PersonalModal({ open, onClose }) {
  const { personal, setPersonal } = useAppData();

  const [workStyle, setWorkStyle] = useState(personal.workStyle);
  const [goals, setGoals]         = useState(personal.goals.join("\n"));
  const [morning, setMorning]     = useState(personal.morningAskTime);
  const [night,   setNight]       = useState(personal.nightAskTime);

/* ------------ 保存ボタン ------------ */
const save = async () => {
  /* ① Context へ保存 & localStorage に永続化 */
  setPersonal({
    workStyle,
    goals: goals.split("\n").filter(Boolean),
    morningAskTime: morning,
    nightAskTime:   night,
    morningMemo: ""
  });

  /* ② Push サブスクをサーバーへ登録（拒否なら内部で noop） */
  await subscribePush();

  /* ③ Android / デスクトップ Chrome でローカルトリガー */
  scheduleLocal("morning", morning);   // 例 "07:30"
  scheduleLocal("night",   night  );   // 例 "22:00"

  onClose();
};

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[320px] rounded-[22px] overflow-hidden
                      bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50
                      border-4 border-pink-200 shadow-2xl">
        <div className="p-5 space-y-3 relative">
          <h2 className="text-lg font-bold text-pink-600 text-center">パーソナル設定</h2>

          <label className="block text-sm font-medium">勤務形態</label>
          <input value={workStyle} onChange={e=>setWorkStyle(e.target.value)}
                 className="w-full rounded border border-pink-300 px-2 py-1 text-sm"/>

          <label className="block text-sm font-medium">今年の目標 <span className="text-[11px] text-gray-500">(1 行 1 目標)</span></label>
          <textarea value={goals} onChange={e=>setGoals(e.target.value)}
                    className="w-full h-20 rounded border border-pink-300 px-2 py-1 text-sm"/>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">朝の質問時刻</label>
              <input type="time" value={morning} onChange={e=>setMorning(e.target.value)}
                     className="w-full rounded border border-pink-300 px-2 py-1 text-sm"/>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">夜の質問時刻</label>
              <input type="time" value={night} onChange={e=>setNight(e.target.value)}
                     className="w-full rounded border border-pink-300 px-2 py-1 text-sm"/>
            </div>
          </div>

          <div className="text-right mt-4 space-x-2">
            <button onClick={onClose}
                    className="px-3 py-1 text-sm rounded border border-gray-400">キャンセル</button>
            <button onClick={save}
                    className="px-4 py-1 text-sm rounded bg-pink-500 text-white shadow">保存</button>
          </div>
        </div>
      </div>
    </div>
  );
}
