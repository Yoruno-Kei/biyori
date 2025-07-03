const VAPID_PUBLIC = "BBPk3iJI5aLSBKMgPs4mlqOIfxQJTxqZexbKfH4Wj1PLqoQrXYZ0BP7AS99cR0xxilxpW-mpGVnI_uPsmhzJBxw";

/* 1. 許可を取り 2. service-worker へ購読を要求して返す */
export async function subscribePush() {
  if (!("serviceWorker" in navigator)) throw new Error("SW unsupported");
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
  if (Notification.permission !== "granted") throw new Error("denied");

  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription() ||
              await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8(VAPID_PUBLIC)
              });
  return sub.toJSON();      // → fetch でサーバーへ保存
}

/* tiny util */
function urlBase64ToUint8(base64) {
  const pad = "=".repeat((4 - base64.length % 4) % 4);
  const data = atob(base64.replace(/-/g,"+").replace(/_/g,"/")+pad);
  return Uint8Array.from([...data].map(c=>c.charCodeAt(0)));
}
