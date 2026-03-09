import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import TermsPage from "./pages/TermsPage";
import FaqPage from "./pages/FaqPage";

const SITE_URL = "https://afxorbit.com";

const SEO_BY_PATH = {
  "/": {
    title: "AFXoRBIT | Web Design, SEO, and Growth Systems",
    description:
      "AFXoRBIT builds high-performance websites, SEO-ready pages, and automation systems that help businesses generate leads and grow.",
    canonical: "/",
  },
  "/about": {
    title: "About AFXoRBIT | Digital Agency for Growth",
    description:
      "Learn about AFXoRBIT's approach to strategy, web development, SEO, and automation for scalable business growth.",
    canonical: "/about",
  },
  "/faq": {
    title: "FAQ | AFXoRBIT",
    description:
      "Answers to common questions about AFXoRBIT services, timelines, pricing, SEO, website redesign, and support.",
    canonical: "/faq",
  },
  "/privacy": {
    title: "Privacy Policy | AFXoRBIT",
    description:
      "Read the AFXoRBIT privacy policy to understand how information is collected, used, and protected.",
    canonical: "/privacy",
  },
  "/refund": {
    title: "Refund Policy | AFXoRBIT",
    description:
      "Review AFXoRBIT refund terms and policy details for web and digital service engagements.",
    canonical: "/refund",
  },
  "/terms": {
    title: "Terms and Conditions | AFXoRBIT",
    description:
      "Read the terms and conditions for using AFXoRBIT website and services.",
    canonical: "/terms",
  },
  "/terms-and-conditions": {
    title: "Terms and Conditions | AFXoRBIT",
    description:
      "Read the terms and conditions for using AFXoRBIT website and services.",
    canonical: "/terms",
  },
};

function getCurrentPath() {
  const normalized = window.location.pathname.toLowerCase().replace(/\/+$/, "");
  return normalized || "/";
}

function upsertMeta(name, content, attr = "name") {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, json) {
  let el = document.head.querySelector(`script[data-seo-id="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-seo-id", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(json);
}

function getPage(pathname) {
  switch (pathname) {
    case "/about":
      return <AboutPage />;
    case "/privacy":
      return <PrivacyPage />;
    case "/refund":
      return <RefundPage />;
    case "/terms":
    case "/terms-and-conditions":
      return <TermsPage />;
    case "/faq":
      return <FaqPage />;
    default:
      return <Home />;
  }
}

export default function App() {
  const [pathname, setPathname] = useState(getCurrentPath);

  useEffect(() => {
    const onPopState = () => setPathname(getCurrentPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    setPathname(getCurrentPath());
  }, []);

  useEffect(() => {
    const seo = SEO_BY_PATH[pathname] || SEO_BY_PATH["/"];
    const canonicalUrl = `${SITE_URL}${seo.canonical}`;

    document.title = seo.title;

    upsertMeta("description", seo.description);
    upsertMeta("robots", "index, follow");
    upsertMeta("og:type", "website", "property");
    upsertMeta("og:site_name", "AFXoRBIT", "property");
    upsertMeta("og:title", seo.title, "property");
    upsertMeta("og:description", seo.description, "property");
    upsertMeta("og:url", canonicalUrl, "property");
    upsertMeta("og:image", `${SITE_URL}/favicon.png`, "property");
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", seo.title);
    upsertMeta("twitter:description", seo.description);
    upsertMeta("twitter:image", `${SITE_URL}/favicon.png`);
    upsertLink("canonical", canonicalUrl);

    upsertJsonLd("website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "AFXoRBIT",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
  }, [pathname]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--deep)" }}>
      <Header />
      {getPage(pathname)}
      <Footer />
    </div>
  );
}
