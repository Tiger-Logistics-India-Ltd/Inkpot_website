// Server-side Cloudflare Turnstile verification, shared by the three public
// forms (newsletter, heritage volunteers, Living Table interest).
//
// The check activates as soon as TURNSTILE_SECRET_KEY exists in the
// environment. While it is unset verification is skipped, so adding the key in
// Vercel switches protection on without a deploy and the forms never break in
// the window between shipping this and creating the key.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult = { ok: true } | { ok: false; reason: string };

export function clientIp(req: Request): string | undefined {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : undefined;
}

export async function verifyTurnstile(token: unknown, ip?: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY not set — bot check skipped");
    return { ok: true };
  }

  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return { ok: false, reason: "missing-token" };
  }

  try {
    const form = new URLSearchParams({ secret, response: token });
    if (ip) form.set("remoteip", ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };

    if (data.success) return { ok: true };
    console.warn("[turnstile] rejected:", data["error-codes"]?.join(", ") || "unknown");
    return { ok: false, reason: "failed" };
  } catch (e) {
    // Cloudflare unreachable. A real "this is a bot" verdict is still enforced
    // above; an outage on their side must not take our forms down, so a failed
    // request is allowed through rather than blocking real signups.
    console.error("[turnstile] verify request failed — allowing through:", e);
    return { ok: true };
  }
}

// A hidden field no human ever sees or fills. Scripted submitters fill every
// input they find, so any value here is a bot. Costs nothing and catches the
// cheap traffic that never runs JavaScript at all.
export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  return typeof body.company === "string" && body.company.trim().length > 0;
}

export const BOT_CHECK_MESSAGE =
  "We couldn't verify your browser. Please refresh the page and try again.";
