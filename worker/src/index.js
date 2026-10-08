const ALLOWED_ORIGINS = ["https://tryatoll.app", "https://www.tryatoll.app"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function cors(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors(origin) },
  });
}

async function notify(env, email) {
  if (!env.RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Atoll <hello@tryatoll.app>",
      to: [env.NOTIFY_TO],
      subject: "New Atoll signup",
      text: `${email} asked to be notified at launch.`,
    }),
  });
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, origin);
    if (!ALLOWED_ORIGINS.includes(origin)) return json({ error: "forbidden" }, 403, origin);

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ error: "bad_request" }, 400, origin);
    }

    // 봇이 채우는 숨은 입력칸. 값이 있으면 성공처럼 응답하고 저장하지 않는다.
    if (data.website) return json({ ok: true }, 200, origin);

    const email = String(data.email || "").trim().toLowerCase();
    if (email.length > 254 || !EMAIL_RE.test(email)) {
      return json({ error: "invalid_email" }, 400, origin);
    }

    const existing = await env.SIGNUPS.get(email);
    if (!existing) {
      await env.SIGNUPS.put(email, JSON.stringify({ at: new Date().toISOString() }));
      ctx.waitUntil(notify(env, email).catch(() => {}));
    }
    return json({ ok: true }, 200, origin);
  },
};
