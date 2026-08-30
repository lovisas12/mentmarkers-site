import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "jsr:@supabase/server@^1";

const allowedOrigins = new Set([
  "https://mentmarkers.com",
  "https://www.mentmarkers.com",
]);

const json = (origin: string, status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json",
      Vary: "Origin",
    },
  });

const sha256 = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(
    new Uint8Array(digest),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
};

export default {
  fetch: withSupabase({ auth: "publishable" }, async (request, ctx) => {
    const origin = request.headers.get("origin") ?? "";
    const corsOrigin = allowedOrigins.has(origin)
      ? origin
      : "https://mentmarkers.com";

    if (!allowedOrigins.has(origin)) {
      return json(corsOrigin, 403, { error: "Origin not allowed" });
    }

    if (request.method !== "POST") {
      return json(corsOrigin, 405, { error: "Request not allowed" });
    }

    let payload: {
      email?: string;
      language?: string;
      turnstileToken?: string;
    };

    try {
      payload = await request.json();
    } catch {
      return json(corsOrigin, 400, { error: "Invalid request" });
    }

    const email = (payload.email ?? "").trim().toLowerCase();
    const language = payload.language === "en" ? "en" : "sv";
    const turnstileToken = payload.turnstileToken ?? "";

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 320 ||
      !turnstileToken
    ) {
      return json(corsOrigin, 400, { error: "Invalid request" });
    }

    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";
    if (!turnstileSecret) {
      return json(corsOrigin, 500, { error: "Service unavailable" });
    }

    const ip = request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: turnstileToken,
          remoteip: ip,
        }),
      },
    );
    const verificationResult = await verification.json();

    if (
      !verificationResult.success ||
      !allowedOrigins.has(`https://${verificationResult.hostname}`)
    ) {
      return json(corsOrigin, 403, { error: "Verification failed" });
    }

    const ipHash = await sha256(`${ip}:${turnstileSecret}`);
    const { data: allowed, error: rateLimitError } = await ctx.supabaseAdmin.rpc(
      "consume_waitlist_attempt",
      {
        p_ip_hash: ipHash,
        p_limit: 5,
        p_window_seconds: 900,
      },
    );

    if (rateLimitError) {
      return json(corsOrigin, 500, { error: "Service unavailable" });
    }

    if (!allowed) {
      return json(corsOrigin, 429, { error: "Too many attempts" });
    }

    const { error: insertError } = await ctx.supabaseAdmin
      .from("waitlist_signups")
      .insert({ email, source: "website", language });

    if (insertError && insertError.code !== "23505") {
      return json(corsOrigin, 500, { error: "Service unavailable" });
    }

    return json(corsOrigin, 200, { ok: true });
  }),
};
