// public/service-worker.js（サンプル・最低限でOK）
self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => self.clients.claim());
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
/* global self */

self.addEventListener("push", (event) => {
  if (!event.data) return;
  const { title, body, tag } = event.data.json();

  /* showNotification は Promise を返す */
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,                       // 同じ tag はまとめて更新
      icon: "/hiyori-192.png",
      badge: "/hiyori-badge.png" // 小アイコン (optional)
    })
  );
});

/* 通知クリックでアプリをフォーカス */
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type:"window" }).then(wins=>{
      const url = new URL("/", self.location.origin).href;
      for (const w of wins) {
        if (w.url === url && "focus" in w) return w.focus();
      }
      return clients.openWindow(url);
    })
  );
});

/* src/App.jsx */
import React, { useState } from "react";
import Home             from "./pages/Home";               // ← pages 配下なら
import PersonalModal    from "./components/PersonalModal";
import QuestionScheduler from "./components/QuestionScheduler";

export default function App() {
  const [open, setOpen] = useState(false);  

  return (
    <>
      <Home onOpenSetting={()=>setOpen(true)} />
      <PersonalModal open={open} onClose={()=>setOpen(false)} />

      {/* 毎分チェックして自動で質問モーダルを出す */}
      <QuestionScheduler />
    </>
  );
}

