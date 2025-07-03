import webpush from "web-push";
import cron from "node-cron";
import dotenv from "dotenv";
dotenv.config();

/* 1) VAPID キー設定 */
webpush.setVapidDetails(
  "mailto:you@example.com",
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

/* 2) 毎分ジョブ */
cron.schedule("* * * * *", async () => {
  const subs = await getAllSubscriptionsFromDB();      // ← 自前DB
  const now  = new Date();
  const hhmm = now.toTimeString().slice(0,5);          // "14:07"

  for (const s of subs) {
    if (isHit(s.morningAskTime, hhmm)) {
      await send(s, {
        title:"ひよりから朝の質問ですっ",
        body :"今日の気分や予定、教えてください！",
        tag  :"hiyori-morning"
      });
    }
    if (isHit(s.nightAskTime, hhmm)) {
      await send(s, {
        title:"ひよりから夜の質問ですっ",
        body :"1 日の振り返りをお願いできますか？",
        tag  :"hiyori-night"
      });
    }
  }
});

function isHit(target, nowHHMM) {
  if (!target) return false;
  const [th,tm] = target.split(":").map(Number);
  const [nh,nm] = nowHHMM.split(":").map(Number);
  return Math.abs((th*60+tm) - (nh*60+nm)) <= 5;
}

function send(sub, payload){
  return webpush.sendNotification(sub, JSON.stringify(payload))
                .catch(console.error);
}
