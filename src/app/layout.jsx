import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";
import Script from "next/script";
import { DM_Sans, Bebas_Neue, Instrument_Serif } from "next/font/google";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-dm-sans" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas-neue" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument-serif" });

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AFXoRBIT",
  url: "https://afxorbit.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://afxorbit.com/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const metadata = {
  metadataBase: new URL("https://afxorbit.com"),
  title: {
    default: "AFXoRBIT | Web Design, SEO, and Growth Systems",
    template: "%s | AFXoRBIT",
  },
  description: "AFXoRBIT builds high-performance websites, SEO-ready pages, and automation systems that help businesses generate leads and grow.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "AFXoRBIT",
    url: "https://afxorbit.com",
    title: "AFXoRBIT | Web Design, SEO, and Growth Systems",
    description: "AFXoRBIT builds high-performance websites, SEO-ready pages, and automation systems that help businesses generate leads and grow.",
    images: [{ url: "/favicon.png", width: 512, height: 512, alt: "AFXoRBIT logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AFXoRBIT | Web Design, SEO, and Growth Systems",
    description: "AFXoRBIT builds high-performance websites, SEO-ready pages, and automation systems that help businesses generate leads and grow.",
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${dmSans.variable} ${bebas.variable} ${instrumentSerif.variable}`}
        style={{ minHeight: "100vh", background: "var(--deep)" }}
      >
        <Script id="afxorbit-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(siteJsonLd)}
        </Script>
        <Preloader>
          <Header />
          <main>{children}</main>
          <Footer />
        </Preloader>
      </body>
    </html>
  );
}
