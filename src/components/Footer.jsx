'use client';
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home",    href: "/" },
  { label: "About",   href: "/about" },
  { label: "FAQ",     href: "/faq" },
  { label: "Privacy", href: "/privacy" },
  { label: "Refund",  href: "/refund" },
  { label: "Terms",   href: "/terms" },
];

const SERVICES = [
  "Web Design",
  "Landing Pages",
  "SEO & Local Search",
  "AI Chat Systems",
  "Business Automations",
  "Brand Design",
];

const SOCIALS = [
  {
    label: "Email",
    href: "mailto:contact@afxorbit.com",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  },
  {
    label: "Instagram",
    href: "#",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></svg>,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  },
  {
    label: "X",
    href: "#",
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l16 16M4 20 20 4"/></svg>,
  },
];

/* ── Marquee ── */
function MarqueeStrip() {
  const items = ["Available for new projects","Web Design","SEO","AI Automation","Local Business Growth","Premium Digital Systems"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(10,15,30,0.07)", padding: "0.8rem 0", background: "rgba(37,99,235,0.03)" }}>
      <div style={{ display: "inline-flex", gap: "3rem", animation: "ftr-mq 22s linear infinite", whiteSpace: "nowrap" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "1.4rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--muted, #7A88A8)" }}>
            {item}
            <span style={{ color: "var(--blue, #2563EB)", fontSize: "0.38rem" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Footer link ── */
function FootLink({ label, href }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: "0.5rem",
        fontSize: "0.86rem", fontWeight: 500,
        color: hov ? "#0A0F1E" : "#7A88A8",
        textDecoration: "none",
        marginBottom: "0.75rem",
        transition: "color 0.22s, transform 0.22s",
        transform: hov ? "translateX(4px)" : "none",
        cursor: "none",
      }}
    >
      <motion.span
        animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -4 }}
        transition={{ duration: 0.18 }}
        style={{ color: "#2563EB", fontSize: "0.42rem", flexShrink: 0 }}
      >◆</motion.span>
      {label}
    </Link>
  );
}

/* ── Back to top ── */
function BackToTop() {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(37,99,235,0.07)" : "transparent",
        border: `1px solid ${hov ? "rgba(37,99,235,0.3)" : "rgba(10,15,30,0.12)"}`,
        borderRadius: 8,
        cursor: "none",
        padding: "0.48rem 1rem",
        display: "flex", alignItems: "center", gap: "0.45rem",
        color: hov ? "#1A56DB" : "#7A88A8",
        fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.18em",
        textTransform: "uppercase",
        transition: "all 0.25s",
        fontFamily: "inherit",
      }}
    >
      <motion.span animate={{ y: hov ? -2 : 0 }} transition={{ duration: 0.25 }}>↑</motion.span>
      Back to top
    </button>
  );
}

/* ── Main Footer ── */
function Footer() {
  const [email, setEmail]     = useState("");
  const [sent,  setSent]      = useState(false);
  const [hov,   setHov]       = useState(false);

  const handleSend = () => {
    if (email.trim()) { setSent(true); setEmail(""); }
  };

  return (
    <footer style={{ background: "#F2F6FF", position: "relative", overflow: "hidden" }}>

      {/* Subtle top gradient wash */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 900, height: 400, borderRadius: "0 0 50% 50%", background: "radial-gradient(ellipse,rgba(37,99,235,0.05) 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* Marquee */}
      <MarqueeStrip />

      {/* Main content */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "5rem 2rem 3rem", position: "relative" }}>

        {/* ── Big logo row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ marginBottom: "4rem", paddingBottom: "3rem", borderBottom: "1px solid rgba(10,15,30,0.08)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "2rem" }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              lineHeight: 1, letterSpacing: "0.06em",
              color: hov ? "transparent" : "#0A0F1E",
              WebkitTextStroke: hov ? "1.5px rgba(37,99,235,0.4)" : "none",
              textDecoration: "none",
              transition: "color 0.35s",
              cursor: "none", userSelect: "none",
            }}
          >
            AFX<span style={{ color: hov ? "transparent" : "#2563EB", WebkitTextStroke: hov ? "1.5px rgba(37,99,235,0.5)" : "none" }}>o</span>RBIT
          </Link>

          {/* Tagline + socials */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1.2rem" }}>
            <p style={{ fontSize: "0.86rem", color: "#7A88A8", fontWeight: 400, textAlign: "right", maxWidth: 260, lineHeight: 1.75 }}>
              Premium digital systems for local businesses that want to grow, convert, and dominate.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {SOCIALS.map(s => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  title={s.label}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  style={{
                    width: 34, height: 34,
                    border: "1px solid rgba(10,15,30,0.1)",
                    borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#7A88A8", textDecoration: "none",
                    background: "#fff",
                    transition: "color 0.25s, border-color 0.25s, background 0.25s",
                    cursor: "none",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#2563EB"; e.currentTarget.style.borderColor = "rgba(37,99,235,0.3)"; e.currentTarget.style.background = "rgba(37,99,235,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#7A88A8"; e.currentTarget.style.borderColor = "rgba(10,15,30,0.1)"; e.currentTarget.style.background = "#fff"; }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 4-column grid ── */}
        <div className="ftr-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr", gap: "3rem", marginBottom: "4rem" }}>

          {/* Col 1 — Services */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0 }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#2563EB", marginBottom: "1.3rem" }}>Services</p>
            {SERVICES.map(s => <FootLink key={s} label={s} href="/#services" />)}
          </motion.div>

          {/* Col 2 — Navigation */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#2563EB", marginBottom: "1.3rem" }}>Navigation</p>
            {NAV_LINKS.map(l => <FootLink key={l.label} label={l.label} href={l.href} />)}
          </motion.div>

          {/* Col 3 — Contact */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#2563EB", marginBottom: "1.3rem" }}>Contact</p>
            {[
              { label: "contact@afxorbit.com", href: "mailto:contact@afxorbit.com", icon: "✉" },
              { label: "Book a call",           href: "/#contact",                  icon: "📞" },
              { label: "afxorbit.com",          href: "/",                          icon: "🌐" },
            ].map(item => (
              <a key={item.label} href={item.href} style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem", marginBottom: "0.9rem", textDecoration: "none", cursor: "none" }}
                onMouseEnter={e => e.currentTarget.querySelector(".ci").style.color = "#0A0F1E"}
                onMouseLeave={e => e.currentTarget.querySelector(".ci").style.color = "#7A88A8"}
              >
                <span style={{ fontSize: "0.75rem", flexShrink: 0, marginTop: "0.05rem" }}>{item.icon}</span>
                <span className="ci" style={{ fontSize: "0.84rem", color: "#7A88A8", lineHeight: 1.55, transition: "color 0.22s" }}>{item.label}</span>
              </a>
            ))}

            {/* Status badge */}
            <div style={{ marginTop: "1.2rem", padding: "0.85rem 1rem", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, background: "rgba(34,197,94,0.04)", display: "flex", alignItems: "center", gap: "0.55rem" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 7px rgba(34,197,94,0.7)", animation: "ftr-pulse 2s ease infinite", flexShrink: 0 }} />
              <span style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600 }}>Open for new projects</span>
            </div>
          </motion.div>

          {/* Col 4 — Newsletter CTA */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.21 }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#2563EB", marginBottom: "1.3rem" }}>Stay Updated</p>
            <p style={{ fontSize: "0.86rem", color: "#7A88A8", lineHeight: 1.75, marginBottom: "1.4rem" }}>
              Get tips on web design, local SEO, and growing your business online — delivered monthly.
            </p>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                style={{ padding: "1rem", borderRadius: 10, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", gap: "0.6rem" }}
              >
                <span style={{ color: "#22c55e" }}>✓</span>
                <span style={{ fontSize: "0.84rem", color: "#16a34a", fontWeight: 600 }}>You're on the list!</span>
              </motion.div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  style={{
                    padding: "0.82rem 1rem",
                    borderRadius: 9, border: "1px solid rgba(10,15,30,0.12)",
                    background: "#fff",
                    fontSize: "0.84rem", color: "#0A0F1E",
                    fontFamily: "inherit", outline: "none",
                    transition: "border-color 0.22s",
                    width: "100%",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(37,99,235,0.4)"}
                  onBlur={e => e.target.style.borderColor = "rgba(10,15,30,0.12)"}
                />
                <button
                  onClick={handleSend}
                  style={{
                    padding: "0.82rem",
                    background: "linear-gradient(135deg,#1A56DB,#2563EB)",
                    color: "#fff", border: "none", borderRadius: 9,
                    fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.05em",
                    cursor: "none", fontFamily: "inherit",
                    boxShadow: "0 6px 20px rgba(26,86,219,0.24)",
                    transition: "box-shadow 0.25s, transform 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 28px rgba(26,86,219,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(26,86,219,0.24)"; e.currentTarget.style.transform = "none"; }}
                >
                  Subscribe →
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(37,99,235,0.2),transparent)", marginBottom: "1.8rem" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
            <p style={{ fontSize: "0.7rem", color: "#A8B4CC", letterSpacing: "0.1em" }}>© 2026 AFXoRBIT. All rights reserved.</p>
            <span style={{ width: 1, height: 12, background: "rgba(10,15,30,0.12)" }} />
            <p style={{ fontSize: "0.7rem", color: "#A8B4CC", letterSpacing: "0.1em" }}>Premium Digital Agency</p>
          </div>
          <BackToTop />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        @keyframes ftr-mq {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes ftr-pulse {
          0%,100% { opacity: 0.65; }
          50%      { opacity: 1; box-shadow: 0 0 10px rgba(34,197,94,0.9); }
        }

        .ftr-grid { grid-template-columns: 1.5fr 1fr 1fr 1.5fr; }
        @media (max-width: 1024px) { .ftr-grid { grid-template-columns: 1fr 1fr !important; gap: 2.5rem !important; } }
        @media (max-width: 560px)  { .ftr-grid { grid-template-columns: 1fr !important; gap: 2rem !important; } }

        input[type="email"]::placeholder { color: #A8B4CC; }
      `}</style>
    </footer>
  );
}

export default Footer;
