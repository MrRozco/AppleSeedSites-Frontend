import { describe, expect, it } from "vitest";
import {
  MESSAGES,
  intentToNeed,
  isUsPhone,
  normalizeWebsite,
  parseLead,
  toStrapiLead,
  type LeadData,
} from "./lead-schema";

const valid = {
  name: "Jane Doe",
  contact: "jane@example.com",
  businessName: "Jane's Landscaping",
};

function ok(input: unknown): LeadData {
  const result = parseLead(input);
  if (!result.ok) throw new Error(`expected valid, got ${JSON.stringify(result.errors)}`);
  return result.data;
}

function errors(input: unknown) {
  const result = parseLead(input);
  if (result.ok) throw new Error("expected errors");
  return result.errors;
}

describe("contact", () => {
  it("accepts an email", () => {
    expect(ok(valid).contact).toBe("jane@example.com");
  });

  it.each(["(240) 276-0695", "240-276-0695", "2402760695", "+1 240 276 0695", "1-240-276-0695"])(
    "accepts the US phone %s",
    (phone) => {
      expect(ok({ ...valid, contact: phone }).contact).toBe(phone);
    },
  );

  it.each(["", "jane", "jane@", "12345", "123-456-7890", "(240) 176-0695", "+44 20 7946 0958", "240 276 0695 x12"])(
    "rejects %j",
    (contact) => {
      expect(errors({ ...valid, contact }).contact).toBe(MESSAGES.contact);
    },
  );

  it("isUsPhone checks area code and exchange", () => {
    expect(isUsPhone("240 276 0695")).toBe(true);
    expect(isUsPhone("040 276 0695")).toBe(false);
    expect(isUsPhone("240 076 0695")).toBe(false);
    expect(isUsPhone("2 240 276 0695")).toBe(false);
  });
});

describe("required fields", () => {
  it("reports every missing field at once", () => {
    expect(errors({})).toEqual({
      name: MESSAGES.name,
      contact: MESSAGES.contact,
      businessName: MESSAGES.businessName,
    });
  });

  it("treats whitespace as empty and trims values", () => {
    expect(errors({ ...valid, name: "   " }).name).toBe(MESSAGES.name);
    expect(ok({ ...valid, name: "  Jane  " }).name).toBe("Jane");
  });
});

describe("website", () => {
  it("is optional", () => {
    expect(ok({ ...valid, website: "" }).website).toBeUndefined();
    expect(ok(valid).website).toBeUndefined();
  });

  it("adds https:// when the protocol is missing", () => {
    expect(ok({ ...valid, website: "example.com" }).website).toBe("https://example.com");
    expect(ok({ ...valid, website: "www.example.com/menu" }).website).toBe("https://www.example.com/menu");
  });

  it("keeps an existing protocol", () => {
    expect(ok({ ...valid, website: "http://example.com" }).website).toBe("http://example.com");
  });

  it.each(["not a site", "localhost", "ftp://example.com", "javascript:alert(1)"])("rejects %j", (website) => {
    expect(errors({ ...valid, website }).website).toBe(MESSAGES.website);
  });

  it("normalizeWebsite returns null for bad input", () => {
    expect(normalizeWebsite("")).toBeNull();
    expect(normalizeWebsite("exa mple.com")).toBeNull();
    expect(normalizeWebsite("example.com")).toBe("https://example.com");
  });
});

describe("max lengths", () => {
  it("rejects visible fields that are too long", () => {
    const e = errors({
      ...valid,
      name: "a".repeat(121),
      businessName: "b".repeat(161),
      message: "c".repeat(3001),
      website: `example.com/${"d".repeat(300)}`,
    });
    expect(e.name).toBe(MESSAGES.tooLong(120));
    expect(e.businessName).toBe(MESSAGES.tooLong(160));
    expect(e.message).toBe(MESSAGES.tooLong(3000));
    expect(e.website).toBe(MESSAGES.tooLong(300));
  });

  it("caps hidden attribution fields instead of failing", () => {
    const data = ok({ ...valid, plan: "p".repeat(500), sourcePage: "s".repeat(500), utmSource: "u".repeat(500) });
    expect(data.plan).toHaveLength(80);
    expect(data.sourcePage).toHaveLength(200);
    expect(data.utmSource).toHaveLength(120);
  });
});

describe("need", () => {
  it("accepts known values and rejects others", () => {
    expect(ok({ ...valid, need: "online-store" }).need).toBe("online-store");
    expect(errors({ ...valid, need: "world-peace" }).need).toBe(MESSAGES.need);
  });

  it("maps ?intent= to a need", () => {
    expect(intentToNeed("store")).toBe("online-store");
    expect(intentToNeed("review")).toBe("site-review");
    expect(intentToNeed("landing")).toBe("landing-page");
    expect(intentToNeed("seo")).toBe("local-seo");
    expect(intentToNeed("audit")).toBe("site-audit");
    expect(intentToNeed("preview")).toBe("preview");
    expect(intentToNeed("local-seo")).toBe("local-seo");
    expect(intentToNeed("nope")).toBeUndefined();
    expect(intentToNeed(null)).toBeUndefined();
  });
});

describe("site review form", () => {
  it("needs only a website and contact", () => {
    const data = ok({ contact: "jane@example.com", website: "example.com", need: "site-review" });
    expect(data.website).toBe("https://example.com");
    expect(data.name).toBeUndefined();
  });

  it("requires a website", () => {
    expect(errors({ contact: "jane@example.com", need: "site-review" }).website).toBe(MESSAGES.website);
  });
});

describe("toStrapiLead", () => {
  it("maps form fields to the Strapi lead", () => {
    const lead = toStrapiLead(ok({ ...valid, plan: "elevate", sourcePage: "pricing", need: "new-website" }));
    expect(lead).toMatchObject({
      name: "Jane Doe",
      business: "Jane's Landscaping",
      contact: "jane@example.com",
      plan: "elevate",
      sourcePage: "pricing",
      need: "new-website",
      website: null,
    });
  });

  it("fills required Strapi fields for review requests", () => {
    const lead = toStrapiLead(ok({ contact: "a@b.co", website: "www.shop.com", need: "site-review" }));
    expect(lead.business).toBe("shop.com");
    expect(lead.name).toBe("(site review request)");
  });
});
