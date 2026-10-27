import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/appleseed.css";
import "@/styles/site.css";
import "@/styles/pricing-forms.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RevealObserver from "@/components/layout/RevealObserver";
import ClickTracker from "@/components/shared/ClickTracker";
import { getSingleType } from "@/lib/strapi";
import { NAVBAR_QUERY, FOOTER_QUERY } from "@/lib/queries";
import { normalizeNavItems } from "@/lib/navigation";
import { SITE_URL } from "@/lib/routes";

/* Two families, self-hosted by next/font (no layout shift, no third-party requests). */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AppleSeedSites",
  description: "Fast, mobile-first websites for small businesses.",
  icons: { icon: "/icon.png", apple: "/icon.png" },
  openGraph: {
    type: "website",
    siteName: "AppleSeedSites",
    title: "AppleSeedSites",
    description: "Fast, mobile-first websites for small businesses.",
  },
};

export const viewport = {
  themeColor: "#0a0e17",
  colorScheme: "dark",
};

/* The layout never fails the page: if the CMS is unreachable the menu and footer
   simply render empty, and the page fetch decides whether to error. */
async function safeSingleType(type, query) {
  try {
    return await getSingleType(type, query);
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }) {
  const [navbar, footer] = await Promise.all([
    safeSingleType("navbar", NAVBAR_QUERY),
    safeSingleType("footer", FOOTER_QUERY),
  ]);

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="as as-page">
        <Navbar items={normalizeNavItems(navbar)} />
        <main id="main">{children}</main>
        <Footer data={footer} />
        <RevealObserver />
        <ClickTracker />
      </body>
    </html>
  );
}
