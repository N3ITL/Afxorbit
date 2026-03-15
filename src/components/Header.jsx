'use client';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
   { label: "Home",    href: "/" },
  { label: "About",    href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Work",     href: "/#work" },
  { label: "Pricing",  href: "/#pricing" },
  { label: "Contact",  href: "/#contact" },
];

/* ── Scroll progress bar ── */
function ScrollBar() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setProg(isNaN(pct) ? 0 : pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 1001, background: "rgba(10,15,30,0.05)" }}>
      <motion.div style={{ height: "100%", background: "linear-gradient(90deg,#1A56DB,#3B82F6)", transformOrigin: "left", scaleX: prog }} />
    </div>
  );
}

/* ── Logo ── */
function Logo() {
  return (
    <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{
        width: 30, height: 30, borderRadius: 7,
        background: "linear-gradient(135deg,#1A56DB 0%,#3B82F6 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(26,86,219,0.3)", flexShrink: 0,
      }}>
        <span style={{ color: "#fff", fontFamily: "'Bebas Neue',sans-serif", fontSize: "0.95rem", letterSpacing: "0.04em", lineHeight: 1 }}>A</span>
      </div>
      <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.45rem", letterSpacing: "0.1em", color: "#0A0F1E", lineHeight: 1 }}>
        AFX<span style={{ color: "#2563EB" }}>o</span>RBIT
      </span>
    </Link>
  );
}

/* ── Single nav link ── */
function NavLink({ link, isActive }) {
  return (
    <Link href={link.href} className={`hdr-nav-link${isActive ? " active" : ""}`}>
      {link.label}
    </Link>
  );
}

/* ── Main Header ── */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active,   setActive]   = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const ids = links.map(l => l.href.replace("/#", ""));
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <ScrollBar />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          padding: "0 1.5rem",
          background: scrolled ? "rgba(248,250,255,0.94)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(10,15,30,0.07)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow: scrolled ? "0 4px 24px rgba(10,15,30,0.06)" : "none",
          transition: "background 0.4s, border-color 0.4s, box-shadow 0.4s, backdrop-filter 0.4s",
        }}
      >
        <div style={{ maxWidth: 1300, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          <Logo />

          {/* Desktop nav */}
          <nav className="hdr-desktop" style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
            {links.map(l => <NavLink key={l.label} link={l} isActive={active === l.href.replace("/#","")} />)}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>

            {/* Available badge — desktop */}
            <div className="hdr-desktop" style={{
              display: "inline-flex", alignItems: "center", gap: "0.45rem",
              padding: "0.28rem 0.8rem", borderRadius: 100,
              border: "1px solid rgba(34,197,94,0.22)",
              background: "rgba(34,197,94,0.06)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 7px rgba(34,197,94,0.75)", animation: "hdr-pulse 2s ease infinite" }} />
              <span style={{ fontSize: "0.59rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#16a34a" }}>Available</span>
            </div>

            {/* Book a Call — desktop */}
            <Link href="/#contact" className="hdr-desktop hdr-cta">
              Book a Call
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="hdr-mobile"
              aria-label="Toggle menu"
              style={{
                width: 40, height: 40, borderRadius: 10,
                border: `1px solid ${menuOpen ? "rgba(37,99,235,0.3)" : "rgba(10,15,30,0.12)"}`,
                background: menuOpen ? "rgba(37,99,235,0.07)" : "transparent",
                display: "none", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 5, cursor: "none",
                transition: "border-color 0.25s, background 0.25s",
              }}
            >
              <motion.span
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6.5 : 0 }}
                transition={{ duration: 0.28 }}
                style={{ display: "block", width: 16, height: 1.5, borderRadius: 2, background: menuOpen ? "#1A56DB" : "#0A0F1E" }}
              />
              <motion.span
                animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                style={{ display: "block", width: 16, height: 1.5, borderRadius: 2, background: "#0A0F1E" }}
              />
              <motion.span
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6.5 : 0 }}
                transition={{ duration: 0.28 }}
                style={{ display: "block", width: 16, height: 1.5, borderRadius: 2, background: menuOpen ? "#1A56DB" : "#0A0F1E" }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "fixed", top: 76, left: 12, right: 12, zIndex: 999,
              borderRadius: 16,
              background: "rgba(248,250,255,0.98)",
              border: "1px solid rgba(10,15,30,0.08)",
              boxShadow: "0 20px 60px rgba(10,15,30,0.12), 0 4px 16px rgba(10,15,30,0.06)",
              backdropFilter: "blur(24px)",
              overflow: "hidden",
            }}
          >
            {/* Links */}
            <div style={{ padding: "0.6rem" }}>
              {links.map((link, i) => {
                const isAct = active === link.href.replace("/#","");
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045 }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      textDecoration: "none",
                      padding: "0.82rem 1rem",
                      borderRadius: 10,
                      background: isAct ? "rgba(26,86,219,0.07)" : "transparent",
                      color: isAct ? "#1A56DB" : "#0A0F1E",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: isAct ? 700 : 500,
                      fontSize: "0.88rem",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    {link.label}
                    {isAct && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563EB", flexShrink: 0 }} />}
                  </motion.a>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(10,15,30,0.06)", display: "flex", gap: "0.55rem" }}>
              <a
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                style={{
                  flex: 1, textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem",
                  padding: "0.82rem",
                  background: "linear-gradient(135deg,#1A56DB,#2563EB)",
                  color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.04em",
                  borderRadius: 10,
                  boxShadow: "0 6px 20px rgba(26,86,219,0.28)",
                }}
              >
                Book a Call →
              </a>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.82rem 0.9rem",
                border: "1px solid rgba(34,197,94,0.2)",
                background: "rgba(34,197,94,0.05)",
                borderRadius: 10,
                flexShrink: 0,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.8)", animation: "hdr-pulse 2s ease infinite" }} />
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#16a34a", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Open</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        @keyframes hdr-pulse {
          0%,100% { opacity: 0.65; }
          50%      { opacity: 1; }
        }

        .hdr-nav-link {
          text-decoration: none;
          padding: 0.42rem 0.72rem;
          border-radius: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: #384060;
          position: relative;
          transition: color 0.2s, background 0.2s;
          cursor: none;
        }
        .hdr-nav-link:hover { color: #1A56DB; background: rgba(37,99,235,0.06); }
        .hdr-nav-link.active { color: #1A56DB; font-weight: 650; }
        .hdr-nav-link.active::after {
          content: '';
          position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%; background: #2563EB;
        }

        .hdr-cta {
          display: inline-flex !important; align-items: center; gap: 0.42rem;
          padding: 0.52rem 1.1rem;
          background: #1A56DB;
          color: #fff !important;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.74rem; font-weight: 700; letter-spacing: 0.05em;
          text-decoration: none;
          border-radius: 8px; border: none;
          box-shadow: 0 4px 16px rgba(26,86,219,0.3);
          transition: box-shadow 0.25s, transform 0.2s;
          cursor: none; white-space: nowrap;
        }
        .hdr-cta:hover { box-shadow: 0 8px 28px rgba(26,86,219,0.4); transform: translateY(-1px); }

        .hdr-desktop { display: flex !important; }
        .hdr-mobile  { display: none  !important; }
        @media (max-width: 900px) {
          .hdr-desktop { display: none !important; }
          .hdr-mobile  { display: flex !important; }
        }
      `}</style>
    </>
  );
}

export default Header;
