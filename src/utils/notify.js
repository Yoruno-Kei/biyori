/* シンプル通知ユーティリティ */
export async function hiyoriNotify(title, body = "") {
    if (!("Notification" in window)) return;
  
    /* 権限が無ければまずリクエスト */
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
    if (Notification.permission !== "granted") return;
  
    /* 絵文字だけど “ひより” のアイコン代わり */  
    new Notification(title, {
      body,
      icon: "/hiyori-128.png"   // public に置いたアイコン
    });
  }
  