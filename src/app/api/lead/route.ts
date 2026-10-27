import { NextResponse, type NextRequest } from "next/server";
import { STRAPI_URL } from "@/lib/strapi";
import { parseLead, toStrapiLead } from "@/lib/lead-schema";

/**
 * POST /api/lead: validates a form submission and saves it as a Lead in Strapi.
 *
 * Needs the server-only env var STRAPI_LEADS_TOKEN (alias STRAPI_API_TOKEN): a Strapi API token
 * (custom type) with only Lead → create. It is never sent to the browser.
 *
 * Responses (JSON): { ok: true } | { ok: false, errors: { field: message } } (422)
 *                   | { ok: false, error } (429 / 5xx).
 * Bots (honeypot filled, or submitted under 3 seconds after the form loaded) get a generic
 * { ok: true } so they learn nothing, and nothing is saved.
 * Regular form posts (no JavaScript) are redirected to /thank-you or back to the form.
 * IP addresses are only used in memory for rate limiting and are never stored.
 */

const MIN_FILL_MS = 3000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// TODO: move to a shared store (Upstash Redis / Vercel KV). This map is per server instance,
// so on Vercel each lambda instance counts separately and the limit resets on cold starts.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
  );
}

async function readBody(request: NextRequest): Promise<{ body: Record<string, unknown>; isJson: boolean }> {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return { body: (await request.json()) ?? {}, isJson: true };
  const form = await request.formData();
  return { body: Object.fromEntries(form.entries()), isJson: false };
}

/** Form-post field names (hidden inputs) → schema names. JSON from the client already uses schema names. */
function normalize(body: Record<string, unknown>) {
  return {
    ...body,
    sourcePage: body.sourcePage ?? body.from,
    utmSource: body.utmSource ?? body.utm_source,
    utmMedium: body.utmMedium ?? body.utm_medium,
    utmCampaign: body.utmCampaign ?? body.utm_campaign,
  };
}

function looksLikeBot(body: Record<string, unknown>): boolean {
  if (typeof body.company_url === "string" && body.company_url.trim() !== "") return true;
  const started = Number(body.ts);
  const submitted = Number(body.ts_submit);
  if (!Number.isFinite(started) || !Number.isFinite(submitted) || started <= 0) return true;
  return submitted - started < MIN_FILL_MS;
}

export async function POST(request: NextRequest) {
  let parsed;
  try {
    parsed = await readBody(request);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const { body, isJson } = parsed;

  const back = (request.headers.get("referer") || "/contact").split("#")[0];
  const reply = (json: Record<string, unknown>, status: number) => {
    if (isJson) return NextResponse.json(json, { status });
    return NextResponse.redirect(new URL(json.ok ? "/thank-you" : back, request.url), 303);
  };

  // Honeypot or too fast: pretend it worked so bots don't adapt. Nothing is saved.
  if (looksLikeBot(body)) return reply({ ok: true }, 200);

  if (rateLimited(clientIp(request))) {
    return reply({ ok: false, error: "Too many requests. Please try again later." }, 429);
  }

  const result = parseLead(normalize(body));
  if (!result.ok) return reply({ ok: false, errors: result.errors }, 422);

  const token = process.env.STRAPI_LEADS_TOKEN || process.env.STRAPI_API_TOKEN;
  if (!token) {
    console.error("[lead] STRAPI_LEADS_TOKEN is not set; the lead was not saved.");
    return reply({ ok: false, error: "The form is not configured." }, 500);
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data: toStrapiLead(result.data) }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[lead] Strapi rejected the lead: ${res.status} ${await res.text()}`);
      return reply({ ok: false, error: "Could not save your request." }, 502);
    }
  } catch (error) {
    console.error("[lead] Could not reach Strapi:", (error as Error).message);
    return reply({ ok: false, error: "Could not save your request." }, 502);
  }

  return reply({ ok: true }, 200);
}
