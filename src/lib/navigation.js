import { buildImageSrc, pickIcon } from "./media";

/**
 * Turns the Strapi `navbar.items` dynamic zone into the small, serializable shape
 * the client Navbar renders. This runs on the server, so only what the menu needs is sent
 * to the browser.
 *
 *   navigation.link     { label, url }                → { type: "link" }
 *   navigation.button   { label, url, style }         → { type: "button", variant: primary|secondary }
 *   navigation.dropdown { label, sections[], links[] }
 *                       sections (mega menu columns) present → mega menu; otherwise links → compact dropdown
 */
export function normalizeNavItems(navbar) {
  const items = Array.isArray(navbar?.items) ? navbar.items : [];

  return items
    .map((item) => {
      switch (item?.__component) {
        case "navigation.link":
          return item.url && item.label ? { type: "link", label: item.label, href: item.url } : null;

        case "navigation.button":
          return item.url && item.label
            ? { type: "button", label: item.label, href: item.url, variant: item.style === "secondary" ? "secondary" : "primary" }
            : null;

        case "navigation.dropdown": {
          const sections = (item.sections || [])
            .map((column) => ({
              heading: column.title || "",
              links: (column.links || [])
                .filter((l) => l?.url && l?.label)
                .map((l) => {
                  const icon = pickIcon(l);
                  return {
                    name: l.label,
                    description: l.description || "",
                    href: l.url,
                    icon: icon ? { src: buildImageSrc(icon.url) } : null,
                  };
                }),
            }))
            .filter((s) => s.links.length > 0);

          if (sections.length > 0) return { type: "dropdown", mode: "mega", label: item.label, sections };

          const links = (item.links || []).filter((l) => l?.url && l?.label).map((l) => ({ title: l.label, href: l.url }));
          return links.length > 0 ? { type: "dropdown", mode: "compact", label: item.label, links } : null;
        }

        default:
          return null;
      }
    })
    .filter(Boolean);
}
