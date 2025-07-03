/* hooks/useTimeTrigger.js */
import { useEffect } from "react";

export default function useTimeTrigger(target, callback) {
  useEffect(()=>{
    const id = setInterval(()=>{
      const now = new Date();
      const hhmm = now.getHours()*60 + now.getMinutes();
      if (Math.abs(hhmm - target) <= 5) callback();
    }, 60000);              // 1分ごと
    return ()=>clearInterval(id);
  }, [target, callback]);
}
