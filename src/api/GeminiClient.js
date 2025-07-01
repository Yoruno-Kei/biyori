const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export async function fetchHiyoriLine(prompt) {
  const tryModel = async (modelName) => {
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${API_KEY}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      }),
    });

    if (!response.ok) {
      console.warn(`[${modelName}] failed with status ${response.status}`);
      return null;
    }

    const result = await response.json();
    return result?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  };

  // まず 2.0-flash を試す
  const result2_5 = await tryModel("gemini-2.0-flash");
  if (result2_5) return result2_5;

  // 次に 2.0-flash を試す
  const result2_0 = await tryModel("gemini-2.0-flash");
  if (result2_0) return result2_0;

  // 両方失敗したらダミー返答
  return "……（ひよりはちょっと黙っているみたいです）";
}
