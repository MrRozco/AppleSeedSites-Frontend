import { buildImageSrc, pickIcon } from "./media";

/**
 * Turns the Strapi `navbar.NavbarItems` dynamic zone into the small, serializable shape
 * the client Navbar renders. This runs on the server, so only what the menu needs is sent
 * to the browser.
 *
 *   menu.menu-link   { title, url }                 → { type: "link" }
 *   menu.menu-button { text, url, type }            → { type: "button", variant: primary|secondary }
 *   menu.dropdown    { title, sections[], menuLink[] }
 *                    sections present → mega menu; otherwise menuLink → compact dropdown
 */
export function normalizeNavItems(navbar) {
  const items = Array.isArray(navbar?.NavbarItems) ? navbar.NavbarItems : [];

  return items
    .map((item) => {
      switch (item?.__component) {
        case "menu.menu-link":
          return item.url && item.title ? { type: "link", label: item.title, href: item.url } : null;

        case "menu.menu-button":
          return item.url && item.text
            ? { type: "button", label: item.text, href: item.url, variant: item.type === "secondary" ? "secondary" : "primary" }
            : null;

        case "menu.dropdown": {
          const sections = (item.sections || [])
            .map((section) => ({
              heading: section.heading || "",
              links: (section.links || [])
                .filter((l) => l?.url && l?.name)
                .map((l) => {
                  const icon = pickIcon(l);
                  return {
                    name: l.name,
                    description: l.description || "",
                    href: l.url,
                    icon: icon ? { src: buildImageSrc(icon.url) } : null,
                  };
                }),
            }))
            .filter((s) => s.links.length > 0);

          if (sections.length > 0) return { type: "dropdown", mode: "mega", label: item.title, sections };

          const links = (item.menuLink || []).filter((l) => l?.url && l?.title).map((l) => ({ title: l.title, href: l.url }));
          return links.length > 0 ? { type: "dropdown", mode: "compact", label: item.title, links } : null;
        }

        default:
          return null;
      }
    })
    .filter(Boolean);
}
