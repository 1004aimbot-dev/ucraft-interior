export async function onRequest({ env }) {
  return new Response(
    JSON.stringify({
      hasKey: !!env.GEMINI_API_KEY,
      keyLen: env.GEMINI_API_KEY ? env.GEMINI_API_KEY.length : 0,
      keyHead: env.GEMINI_API_KEY ? env.GEMINI_API_KEY.slice(0, 6) : null,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
