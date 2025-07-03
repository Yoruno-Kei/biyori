import React from "react";
import { useAppData } from "../../contexts/AppDataContext";
import { v4 as uuid } from "uuid";

export default function TodoPanel() {
  const { todos, setTodos } = useAppData();

  const add = () => {
    const t = prompt("新しい ToDo");
    if (t) setTodos([...todos, { id: uuid(), text: t, done: false }]);
  };

  const toggle = id =>
    setTodos(ts => ts.map(x => x.id === id ? { ...x, done: !x.done } : x));

  return (
    <>
      <div className="text-xs mb-1">
        残り {todos.filter(t => !t.done).length} 件
      </div>

      <ul className="space-y-1 max-h-[88px] overflow-y-auto pr-1">
        {todos.map(t => (
          <li key={t.id} className="flex items-center">
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} className="mr-1" />
            <span className={t.done ? "line-through text-gray-400" : ""}>{t.text}</span>
          </li>
        ))}
      </ul>

      <button onClick={add} className="text-xs text-blue-500 mt-1">
        ＋追加
      </button>
    </>
  );
}
