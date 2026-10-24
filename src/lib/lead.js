/**
 * Lead form rules, shared by the form (instant feedback) and the API route (the real check).
 * Fields are fixed: name, business, contact (email or phone), hasWebsite ("yes" | "no").
 */
export const LEAD_FIELDS = ["name", "business", "contact", "hasWebsite"];

const MAX_LENGTH = 200;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LEAD_MESSAGES = {
  name: "Enter your name.",
  business: "Enter your business name.",
  contact: "Enter an email address or a 10-digit phone number.",
  hasWebsite: "Choose yes or no.",
};

/** Returns the error message for one field, or "" when it's valid. */
export function checkLeadField(name, rawValue) {
  const value = typeof rawValue === "string" ? rawValue.trim() : "";
  if (value.length > MAX_LENGTH) return "Please keep this under 200 characters.";
  switch (name) {
    case "name":
    case "business":
      return value ? "" : LEAD_MESSAGES[name];
    case "contact":
      return EMAIL.test(value) || value.replace(/\D/g, "").length >= 10 ? "" : LEAD_MESSAGES.contact;
    case "hasWebsite":
      return value === "yes" || value === "no" ? "" : LEAD_MESSAGES.hasWebsite;
    default:
      return "";
  }
}

/** Validates a whole submission. Returns { data, errors } with trimmed values. */
export function validateLead(input = {}) {
  const errors = {};
  const data = {};
  for (const field of LEAD_FIELDS) {
    const message = checkLeadField(field, input[field]);
    if (message) errors[field] = message;
    data[field] = typeof input[field] === "string" ? input[field].trim() : "";
  }
  return { data, errors };
}
