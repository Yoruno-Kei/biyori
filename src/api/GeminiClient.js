const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export async function fetchHiyoriLine(prompt) {
  const tryModel = async (modelName) => {
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${API_KEY}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!response.ok) {
      console.warn(`[${modelName}] failed with status ${response.status}`);
      return null;
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const match = text.match(/^\[(.*?)\](?:「|『)(.+?)(?:」|』)/);
    if (match) {
      return { mood: match[1].trim(), text: match[2].trim() };
    } else {
      return { mood: "normal", text: text.replace(/^「|」$/g, "").trim() };
    }
  };

  const result = await tryModel("gemini-2.0-flash");
  if (result) return result;

  await new Promise((res) => setTimeout(res, 500));
  const retry = await tryModel("gemini-2.0-flash");
  return retry || { mood: "normal", text: "……（ひよりはちょっと黙っているみたいです）" };
}
