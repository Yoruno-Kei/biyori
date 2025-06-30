const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export async function fetchHiyoriLine(prompt) {
  const tryModel = async (modelName) => {
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${API_KEY}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) return null;
    const result = await response.json();
    return result?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  };

  // 2.5-flashを最大3回試す
  for (let i = 0; i < 3; i++) {
    const result = await tryModel("gemini-2.5-flash");
    if (result) return result;
    console.warn(`2.5-flash attempt ${i + 1} failed.`);
  }

  // 最後に2.0-flashを試す
  const fallback = await tryModel("gemini-2.0-flash");
  if (fallback) return fallback;

  // どちらも失敗した場合
  return "……（ひよりはちょっと黙っているみたいです）";
}
