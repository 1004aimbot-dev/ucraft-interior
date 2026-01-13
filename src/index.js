export default {
  async fetch(request, env) {
    // CORS (Pages에서 호출 가능하게)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (request.method !== "POST") {
      return json({ error: "Use POST" }, 405);
    }

    // 환경변수에 저장한 키
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) return json({ error: "Missing GEMINI_API_KEY" }, 500);

    const body = await request.json().catch(() => null);
    if (!body) return json({ error: "Invalid JSON body" }, 400);

    // 프론트에서 { prompt: "..."} 형태로 보내는 걸 가정
    const prompt = body.prompt;
    if (!prompt) return json({ error: "Missing prompt" }, 400);

    // 텍스트 생성(이미지 말고) 예시: gemini-2.5-flash
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    const resp = await fetch(url + "?key=" + encodeURIComponent(apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await resp.json().catch(() => ({}));

    // 구글에서 주는 에러를 그대로 반환(디버깅 편함)
    if (!resp.ok) {
      return json(
        {
          error: "Gemini request failed",
          status: resp.status,
          data,
        },
        resp.status
      );
    }

    // 응답을 프론트에 전달
    return json({ data }, 200);
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // 필요 시 도메인으로 제한 권장
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
}
