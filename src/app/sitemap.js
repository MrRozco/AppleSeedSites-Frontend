import { ROUTES, SITE_URL } from "@/lib/routes";

export default function sitemap() {
  return Object.values(ROUTES).map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
    changeFrequency: route.changeFrequency || "monthly",
    priority: route.priority ?? 0.8,
  }));
}
