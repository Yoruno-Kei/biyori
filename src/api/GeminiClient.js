const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

/**
 * Gemini へプロンプトを送りテキストを返す
 *
 * @param {string} prompt
 * @param {"hiyori" | "raw"} mode
 */
export async function fetchGemini(prompt, mode = "hiyori") {
  /* 試行順序: 2.5 → 2.5 → 2.0 */
  const models = ["gemini-2.5-flash", "gemini-2.5-flash", "gemini-2.0-flash"];

  for (let i = 0; i < models.length; i++) {
    const modelName = models[i];
    const endpoint =
      `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${API_KEY}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    /* --- 成功時パースして return --- */
    if (res.ok) {
      const out  = await res.json();
      const text = out?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      if (mode === "raw") return text;

      const m = text.match(/^\[(.*?)\](?:「|『)(.+?)(?:」|』)/);
      if (m) {
        return { mood: m[1].trim(), text: m[2].trim() };
      }
      return { mood: "normal", text: text.replace(/^「|」$/g, "").trim() };
    }

    /* --- 失敗時ログ & 次モデルまで 1 秒待つ --- */
    console.warn(`[${modelName}] -> ${res.status}`);
    if (i < models.length - 1) {
      await new Promise(r => setTimeout(r, 1000));   // ← 1 秒待機
    }
  }

  /* すべて失敗 */
  if (mode === "raw") return "";
  return { mood: "normal", text: "……（ひよりはちょっと黙っているみたいです）" };
}
