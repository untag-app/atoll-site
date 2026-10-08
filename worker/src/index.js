import { WELCOME_SUBJECT, WELCOME_TEXT, WELCOME_HTML } from "./email.js";

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

async function resend(env, path, body) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) console.error("resend_failed", path, res.status, await res.text());
}

async function afterSignup(env, email) {
  if (!env.RESEND_API_KEY) {
    console.error("resend_key_missing");
    return;
  }
  // 하나가 실패해도 다른 하나는 계속 진행한다
  await Promise.allSettled([
    resend(env, "/contacts", { email, segments: [{ id: env.SEGMENT_ID }] }),
    resend(env, "/emails", {
      from: "Atoll <hello@tryatoll.app>",
      to: [env.NOTIFY_TO],
      subject: "New Atoll signup",
      text: `${email} asked to be notified at launch.`,
    }),
    resend(env, "/emails", {
      from: "Atoll <hello@tryatoll.app>",
      reply_to: "hello@tryatoll.app",
      to: [email],
      subject: WELCOME_SUBJECT,
      text: WELCOME_TEXT,
      html: WELCOME_HTML,
    }),
  ]);
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

    // 남의 주소로 메일을 보내게 하는 악용을 막는다. IP당 시간당 신규 가입 5건까지.
    // "rl:" 키는 가입자 목록이 아니다(이메일 키에는 @가 있다).
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const rlKey = `rl:${ip}`;
    const used = parseInt((await env.SIGNUPS.get(rlKey)) || "0", 10);
    if (used >= 5) return json({ error: "rate_limited" }, 429, origin);

    const existing = await env.SIGNUPS.get(email);
    if (!existing) {
      await env.SIGNUPS.put(rlKey, String(used + 1), { expirationTtl: 3600 });
      await env.SIGNUPS.put(email, JSON.stringify({ at: new Date().toISOString() }));
      ctx.waitUntil(afterSignup(env, email).catch((e) => console.error("signup_error", String(e))));
    }
    return json({ ok: true }, 200, origin);
  },
};
