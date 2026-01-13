export async function generateText(prompt: string) {
  const res = await fetch("https://<너의-worker-도메인>/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `Worker error ${res.status}: ${JSON.stringify(json)}`
    );
  }

  // 구글 응답에서 텍스트만 뽑기(있을 때)
  const text =
    json?.data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ??
    "";

  return { raw: json.data, text };
}
