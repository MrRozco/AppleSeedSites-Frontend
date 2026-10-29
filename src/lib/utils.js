export const cx = (...classes) => classes.filter(Boolean).join(" ");

export const has = (v) => v != null && v !== "" && !(Array.isArray(v) && v.length === 0);

/** Card grids pick their column layout from the item count (see `data-count` in appleseed.css). */
export const gridCount = (n) => (n > 6 ? "many" : String(n));

/** First usable `elements.link` from a single (`button`) or repeatable (`buttons`) field. */
export function firstButton(button) {
  const b = Array.isArray(button) ? button[0] : button;
  return b?.url && b?.label ? b : null;
}

/** Plain-text fields: blank lines separate paragraphs. */
export function paragraphs(text) {
  if (typeof text !== "string") return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

const HTML_TAG = /<[a-z][\s\S]*?>/i;
const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);

export const containsHtml = (value) => typeof value === "string" && HTML_TAG.test(value);

/**
 * Rich-text fields hold HTML written by editors and render as HTML, as on the old site.
 * Plain text without tags is escaped and split into paragraphs.
 */
export function richHtml(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  if (containsHtml(value)) return value;
  return paragraphs(value)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");
}

/** Short rich text (bullet points): HTML passes through, plain text is escaped without adding <p>. */
export function inlineHtml(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  return containsHtml(value) ? value : escapeHtml(value.trim());
}

/** External destinations render as plain anchors; internal ones use next/link. */
export const isExternal = (href = "") => /^(https?:)?\/\//i.test(href) || /^(mailto|tel|sms):/i.test(href);

export function formatPrice(price) {
  const n = Number(price);
  if (!Number.isFinite(n)) return String(price);
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}
