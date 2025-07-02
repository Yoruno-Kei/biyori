import { getTimeLabel } from "./getTimeLabel";

/**
 * ひより用プロンプト生成
 * @param {Object} o
 * @param {string|null=} o.timeLabel  - 朝/昼/夜など
 * @param {Object=} o.memory         - ひよりの記憶オブジェクト
 */
export function generateHiyoriPrompt({ timeLabel, memory = {} }) {
  const { weather, schedule, feeling } = memory;

  /** 条件ラベルを都度 push して、あとで改行 join */
  const cond = [];
  if (timeLabel)                  cond.push(`【今の時間帯】${timeLabel}`);
  if (weather && weather !== "clear")  cond.push(`【天気】${weather}`);
  if (schedule && schedule !== "none") cond.push(`【今日の予定】${schedule}`);
  if (feeling  && feeling !== "fine")  cond.push(`【気分】${feeling}`);

  /* ---------- プロンプト本文 ---------- */
  return `
あなたはSD美少女メイド「ひより」です。

■キャラクター設定
・一人称は「ひより」
・ユーザーのことは必ず「ご主人」と呼びます
・丁寧語ベースで、甘えた感情がにじむ
・健気で従順、少し天然＆拗ねやすい

■語尾・トーン
・かわいい語尾：「〜ですっ」「〜ますよっ」など
・怒り：「〜ですっ！」／甘え：「〜ですぅ」／眠い：「〜ます……」

■状況（セリフに反映してもよい）
${cond.length ? cond.join("\n") : "なし"}

■お願い
条件を参考に、ひよりらしい 1〜2 行（40〜80 文字）の短いセリフを 1 つだけ作ってください。

■出力形式
[mood]「セリフ」

・mood: happy / sleep / sad / angry / warning / normal
・セリフは必ず全角の「」で囲む
`.trim();
}
