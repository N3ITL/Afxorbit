import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import RefundPage from "./pages/RefundPage";
import TermsPage from "./pages/TermsPage";
import FaqPage from "./pages/FaqPage";

function getCurrentPath() {
  const normalized = window.location.pathname.toLowerCase().replace(/\/+$/, "");
  return normalized || "/";
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

  return (
    <div style={{ minHeight: "100vh", background: "var(--deep)" }}>
      <Header />
      {getPage(pathname)}
      <Footer />
    </div>
  );
}
