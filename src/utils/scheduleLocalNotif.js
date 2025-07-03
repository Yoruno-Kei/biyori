/* Chrome 125+ │ NotificationTrigger API 使用
   scheduleLocal("morning", "07:30")
   scheduleLocal("night",   "23:45") */

   export async function scheduleLocal(type, hhmm) {
    /* 1) API 対応ブラウザのみ */
    if (!("Notification" in window &&
          "showTrigger"  in Notification.prototype)) return;
  
    /* 2) 権限確保 */
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
    if (Notification.permission !== "granted") return;
  
    /* 3) 次回発火日時を算出 */
    const [h, m] = hhmm.split(":").map(Number);
    const now    = new Date();
    let   tgt    = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
  
    if (type === "morning") {
      /* ── 朝通知 ──   許容: 00:00 - 11:59 */
      if (h >= 12) return console.warn("morningAskTime は 00-11 時台のみ");
      if (tgt <= now) tgt.setDate(tgt.getDate() + 1);       // 既に過ぎていれば翌日
    } else if (type === "night") {
      /* ── 夜通知 ──   許容: 18:00〜翌 03:00 */
      const nightHour = h < 4 ? h + 24 : h;                 // 0-3時 → 24-27 に変換
      if (nightHour < 18 || nightHour > 27) {
        return console.warn("nightAskTime は 18-27 時台のみ(0-3 時は OK)");
      }
      if (nightHour <= (now.getHours() + (now.getHours() < 4 ? 24 : 0))) {
        tgt.setDate(tgt.getDate() + 1);                     // 同じ日の分は過ぎた
      }
      if (h < 4) tgt.setDate(tgt.getDate() + 1);            // 0-3 時指定は常に翌日側
    } else {
      return;
    }
  
    /* 4) 通知内容 */
    const payload = type === "morning"
      ? { title:"ひよりから朝の質問ですっ",
          body :"今日の気分や予定、教えてください！",
          tag :"hiyori-morning-local" }
      : { title:"ひよりから夜の質問ですっ",
          body :"1 日の振り返りをお願いできますか？",
          tag :"hiyori-night-local"  };
  
    /* 5) 予約実行 */
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(payload.title, {
      ...payload,
      icon:"/hiyori-128.png",
      showTrigger: new window.TimestampTrigger(tgt.getTime())
    });
  }
  