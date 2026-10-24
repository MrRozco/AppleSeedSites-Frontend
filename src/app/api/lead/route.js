import { NextResponse } from "next/server";
import { STRAPI_URL } from "@/lib/strapi";
import { validateLead } from "@/lib/lead";

/**
 * POST /api/lead: receives the lead form (custom.lead-form) and saves it as a Lead in Strapi.
 *
 * Needs a server-only env var STRAPI_LEADS_TOKEN: a Strapi API token (custom type) with only
 * Lead → create permission. Never expose it with a NEXT_PUBLIC_ prefix.
 *
 * Accepts JSON (the form with JavaScript) and regular form posts (without JavaScript).
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map(); // best-effort, per server instance

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

async function readBody(request) {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return { body: await request.json(), isJson: true };
  const form = await request.formData();
  return { body: Object.fromEntries(form.entries()), isJson: false };
}

export async function POST(request) {
  let parsed;
  try {
    parsed = await readBody(request);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { body, isJson } = parsed;
  const back = (request.headers.get("referer") || "/").split("#")[0] + "#get-plan";
  const reply = (json, status) => (isJson ? NextResponse.json(json, { status }) : NextResponse.redirect(back, 303));

  // Honeypot: real people never see this field. Pretend it worked so bots don't retry.
  if (body.company) return reply({ ok: true }, 200);

  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return reply({ error: "Too many requests. Please try again later." }, 429);

  const { data, errors } = validateLead(body);
  if (Object.keys(errors).length) return reply({ errors }, 422);

  const token = process.env.STRAPI_LEADS_TOKEN;
  if (!token) {
    console.error("[lead] STRAPI_LEADS_TOKEN is not set; the lead was not saved.");
    return reply({ error: "Lead form is not configured." }, 500);
  }

  const page = typeof body.page === "string" ? body.page.slice(0, 200) : "";
  try {
    const res = await fetch(`${STRAPI_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data: { ...data, page } }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[lead] Strapi rejected the lead: ${res.status} ${await res.text()}`);
      return reply({ error: "Could not save your request." }, 502);
    }
  } catch (error) {
    console.error("[lead] Could not reach Strapi:", error.message);
    return reply({ error: "Could not save your request." }, 502);
  }

  return reply({ ok: true }, 201);
}
