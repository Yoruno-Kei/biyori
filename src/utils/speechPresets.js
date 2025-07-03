/* utils/speechPresets.js */

/* ────────── Lift（持ち上げ） ────────── */
export const liftLines = [
  "や、やめてぇ〜！",
  "うわあっ、持ち上げないで〜！",
  "ひゃっ！？",
  "ご、ご主人…！？",
  "服ひっぱったらダメ〜っ！",
  "ひより、落ちちゃいますぅ…！",
  "あわわ…高いところ怖いですっ！",
  "ご主人〜っ、乱暴にしないでください〜！",
  "きゃあっ、スカートめくれちゃいますぅ！",
];

/* ────────── Drag→Drop（落下後） ────────── */
export const dragDropLines = [
  { text: "いたた……ひどいですっ",                    mood: "sad"      },
  { text: "落っことさないでくださいっ",               mood: "angry"    },
  { text: "うぅ……ひよりはぬいぐるみじゃないですっ",   mood: "sad"      },
  { text: "もう…大事に扱ってくださいよぉ",             mood: "sad"      },
  { text: "乱暴にするなら、ご主人でも怒りますっ！",      mood: "angry"    },
  { text: "びっくりした…落とされたら痛いんですからっ",    mood: "warning"  },
  { text: "ひより、壊れちゃいますよ…",                 mood: "sad"      },
  { text: "次は優しく抱えてくださいね？",               mood: "warning"  },
  { text: "ひより、ぺしゃんこになっちゃいますっ！",        mood: "sad"      },
  { text: "ご主人の意地悪…！ ぷんっ！",                  mood: "angry"    },
  { text: "いきなり手を放すなんてズルいです〜…",            mood: "sad"      },
  { text: "ね？　次はそっと降ろしてください…",              mood: "warning"  },
  { text: "今のは試練ですか？ ひより頑張りました…",          mood: "happy"    },
];

/* ────────── Tap＋Jump ────────── */
export const tapJumpLines = [
  { text: "ひょ、ひょいっとっ！",                    mood: "happy"    },
  { text: "わーい！ご主人、今の見ましたか？",          mood: "happy"    },
  { text: "ジャンプ成功ですっ！ えへへ〜",             mood: "happy"    },
  { text: "宙に浮いた気分……たのしいです〜！",          mood: "happy"    },
  { text: "もっと高く跳べるかも…ですっ！",             mood: "happy"   },
];

/* ────────── Tap＋Surprise ────────── */
export const tapSurpriseLines = [
  { text: "きゃっ！？…びっくりしましたぁ…",              mood: "surprise" },
  { text: "ふぇっ！？ 急に触らないでくださいっ！",         mood: "surprise" },
  { text: "ひより心臓止まるかと思いましたっ！",            mood: "surprise" },
  { text: "ご、ご主人…脅かしちゃダメです〜…",             mood: "surprise" },
  { text: "びくっ…もうっ！ 驚かせないでください〜",         mood: "surprise" },
];
