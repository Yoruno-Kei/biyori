import React from "react";
import { useAppData } from "../../contexts/AppDataContext";

export default function TodayPanel() {
  const { dayPlan } = useAppData();
  if (!dayPlan.length) return (
    <div className="text-sm text-gray-500">今日の予定は未登録</div>
  );

  return (
    <div className="flex space-x-2 overflow-x-auto max-h-[90px]">
      {dayPlan.map((p, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-xs">
            {p.time}
          </div>
          <span className="text-[10px] mt-0.5">{p.label}</span>
        </div>
      ))}
    </div>
  );
}
