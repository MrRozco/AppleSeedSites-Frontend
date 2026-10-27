import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { TAGS } from "@/lib/strapi";

/**
 * POST /api/revalidate: called by a Strapi webhook on publish/unpublish/update.
 * Refreshes the cached Strapi data for the changed model right away instead of waiting for ISR.
 *
 * Auth: the REVALIDATE_SECRET env var, sent as an "Authorization: Bearer <secret>" header
 * (preferred; set it as a webhook header in Strapi) or as ?secret=<secret>.
 *
 * Body (Strapi webhook payload): { event, model, uid, entry }.
 */
const MODEL_TAGS: Record<string, string[]> = {
  plan: [TAGS.pricing],
  "add-on": [TAGS.pricing],
  "pricing-page": [TAGS.pricing],
  "lead-form": [TAGS.leadForm],
  "thank-you-page": [TAGS.thankYou],
};

function authorized(request: NextRequest): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization") || "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : request.nextUrl.searchParams.get("secret") || "";
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  if (!process.env.REVALIDATE_SECRET) {
    console.error("[revalidate] REVALIDATE_SECRET is not set.");
    return NextResponse.json({ ok: false, error: "Not configured." }, { status: 500 });
  }
  if (!authorized(request)) return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });

  let model = "";
  try {
    const body = (await request.json()) as { model?: unknown };
    model = typeof body.model === "string" ? body.model : "";
  } catch {
    // No body: refresh everything below.
  }

  // Known models refresh their own tag; anything else (navbar, footer, pages…) refreshes all Strapi data.
  const tags = MODEL_TAGS[model] ?? [TAGS.all];
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ ok: true, model: model || null, revalidated: tags });
}
