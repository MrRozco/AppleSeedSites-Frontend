import { describe, expect, it } from "vitest";
import { isContactHref, pageSlug, withFrom } from "./contact-link";

describe("pageSlug", () => {
  it("turns paths into slugs", () => {
    expect(pageSlug("/")).toBe("home");
    expect(pageSlug("/small-business")).toBe("small-business");
    expect(pageSlug("/web-ops/")).toBe("web-ops");
    expect(pageSlug("/a/b")).toBe("a-b");
  });
});

describe("isContactHref", () => {
  it.each(["/contact", "/contact/", "/contact?plan=spark", "/contact#form", "https://www.appleseedsites.com/contact", "https://appleseedsites.com/contact?x=1"])(
    "matches %s",
    (href) => expect(isContactHref(href)).toBe(true),
  );

  it.each(["/contact-us", "/contacts", "/pricing", "https://example.com/contact", "//example.com/contact", "mailto:a@b.co", "tel:+12402760695", "", null])(
    "ignores %s",
    (href) => expect(isContactHref(href)).toBe(false),
  );
});

describe("withFrom", () => {
  it("adds the page slug", () => {
    expect(withFrom("/contact", "small-business")).toBe("/contact?from=small-business");
    expect(withFrom("/contact#form", "home")).toBe("/contact?from=home#form");
  });

  it("keeps other params", () => {
    expect(withFrom("/contact?intent=store", "e-commerce")).toBe("/contact?intent=store&from=e-commerce");
  });

  it("never overrides an existing from", () => {
    expect(withFrom("/contact?plan=elevate&from=pricing", "home")).toBe("/contact?plan=elevate&from=pricing");
  });

  it("handles absolute site URLs", () => {
    expect(withFrom("https://www.appleseedsites.com/contact", "seo")).toBe("https://www.appleseedsites.com/contact?from=seo");
  });

  it("leaves non-contact links alone", () => {
    expect(withFrom("/pricing", "home")).toBe("/pricing");
    expect(withFrom("https://example.com/contact", "home")).toBe("https://example.com/contact");
  });
});
