import React, { useState, useEffect } from "react";

export default function TodoList() {
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem("todos") || "[]");
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input.trim()]);
      setInput("");
    }
  };

  return (
    <div className="p-2">
      <input
        className="border px-2 py-1 rounded mr-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="タスクを入力"
      />
      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={addTodo}>
        追加
      </button>
      <ul className="mt-2 text-sm">
        {todos.map((todo, index) => (
          <li key={index} className="mt-1">
            {todo}
          </li>
        ))}
      </ul>
    </div>
  );
}
