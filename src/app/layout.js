import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "../styles/globals.scss";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import { getSingleType } from "@/lib/api/strapi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata = {
  title: "Business Website", // Change this to your website title
  description: "Welcome to our business website", // Change this to your website description
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: "Business Website",
    description: "Welcome to our business website",
    type: 'website',
    // opengraph-image.png in src/app folder is automatically used
  },
  twitter: {
    card: 'summary_large_image',
    title: "Business Website",
    description: "Welcome to our business website",
  },
};


export default async function RootLayout({ children }) {

  let navBarData = null;
  let footerData = null;

  try {
    navBarData = await getSingleType('navbar', {
  "populate": [
    "darkLogo",
    "lightLogo",
    "NavbarItems",
    "NavbarItems.sections",
    "NavbarItems.sections.links",
    "NavbarItems.sections.links.LightIcon",
    "NavbarItems.sections.links.darkIcon",
  ]
})
  } catch (error) {
    console.error('Error in RootLayout:', error);
  }

  try {
    footerData = await getSingleType('footer', {
      "populate": [
        "logo",
        "cta",
        "footerLink",
        "contactLink",
        "contactLink.lightIcon",
        "contactLink.darkIcon"
      ]
    });
  } catch (error) {
    console.error('Error in RootLayout:', error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme') || 'light';
              document.documentElement.setAttribute('data-theme', theme);
            })();
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="theme-wrapper" >
            <div className="grid-dot-1"></div>
            <div className="grid-dot-2"></div>
            <div className="grid-dot-3"></div>
            <div className="grid-dot-4"></div>
            <Navbar content={navBarData} />
            <main>
              {children}
            </main>
            <Footer data={footerData} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
