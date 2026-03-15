'use client';
import { motion } from "framer-motion";

function LegacyPageSection({ heading, paragraphs = [], bullets = [], index = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      style={{
        background: "#fff",
        border: "1px solid rgba(10,15,30,0.08)",
        borderRadius: 12,
        padding: "1.8rem",
        display: "grid",
        gap: "0.9rem",
        boxShadow: "0 2px 12px rgba(10,15,30,0.05)",
        transition: "box-shadow 0.3s, border-color 0.3s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(10,15,30,0.09)";
        e.currentTarget.style.borderColor = "rgba(37,99,235,0.18)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(10,15,30,0.05)";
        e.currentTarget.style.borderColor = "rgba(10,15,30,0.08)";
      }}
    >
      {/* Blue left accent */}
      <div style={{ position: "absolute", left: 0, top: "1.2rem", bottom: "1.2rem", width: 3, borderRadius: "0 3px 3px 0", background: "linear-gradient(to bottom, #1A56DB, #3B82F6)" }} />

      <h2 style={{
        margin: 0, fontSize: "1rem", fontWeight: 700,
        color: "#0A0F1E", lineHeight: 1.4,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {heading}
      </h2>

      {paragraphs.map((p, i) => (
        <p key={i} style={{ margin: 0, color: "#384060", lineHeight: 1.85, fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif" }}>
          {p}
        </p>
      ))}

      {bullets.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "grid", gap: "0.45rem" }}>
          {bullets.map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", color: "#384060", fontSize: "0.9rem", lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563EB", flexShrink: 0, marginTop: "0.55rem" }} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}

export default function LegacyPageLayout({ title, updated, intro = [], sections = [], faqs = [] }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
      `}</style>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "8rem 1.5rem 5rem", background: "var(--page, #F8FAFF)", minHeight: "100vh" }}>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.26em",
            textTransform: "uppercase", color: "#2563EB",
            marginBottom: "0.9rem",
          }}
        >
          <span style={{ display: "block", width: 20, height: 1.5, background: "#2563EB" }} />
          Legal
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            lineHeight: 0.95, letterSpacing: "0.02em",
            color: "#0A0F1E", marginBottom: "0.8rem",
          }}
        >
          {title}
        </motion.h1>

        {/* Updated */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
          style={{ color: "#A8B4CC", fontSize: "0.82rem", fontWeight: 500, marginBottom: "2.5rem", fontFamily: "'DM Sans', sans-serif" }}
        >
          Last updated: {updated}
        </motion.p>

        {/* Divider */}
        <div style={{ height: 1, background: "linear-gradient(90deg, rgba(37,99,235,0.3), transparent)", marginBottom: "2.5rem" }} />

        {/* Intro */}
        {intro.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }}
            style={{
              background: "rgba(37,99,235,0.04)",
              border: "1px solid rgba(37,99,235,0.14)",
              borderRadius: 12,
              padding: "1.8rem",
              display: "grid",
              gap: "0.9rem",
              marginBottom: "1.2rem",
            }}
          >
            {intro.map((p, i) => (
              <p key={i} style={{ margin: 0, color: "#384060", lineHeight: 1.88, fontSize: "0.94rem", fontFamily: "'DM Sans', sans-serif" }}>
                {p}
              </p>
            ))}
          </motion.section>
        )}

        {/* Sections */}
        <div style={{ display: "grid", gap: "1rem" }}>
          {sections.map((s, i) => (
            <LegacyPageSection
              key={`${s.heading}-${i}`}
              heading={s.heading}
              paragraphs={s.paragraphs}
              bullets={s.bullets}
              index={i}
            />
          ))}

          {faqs.map((item, i) => (
            <LegacyPageSection
              key={`faq-${i}`}
              heading={item.question}
              paragraphs={[item.answer]}
              index={sections.length + i}
            />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{
            marginTop: "3rem",
            padding: "2rem",
            borderRadius: 14,
            background: "linear-gradient(135deg, #1A56DB, #2563EB)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1.2rem",
            boxShadow: "0 16px 48px rgba(26,86,219,0.22)",
          }}
        >
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", marginBottom: "0.25rem" }}>
              Have a question?
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.84rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
              We're happy to clarify anything on this page.
            </p>
          </div>
          <a
            href="mailto:contact@afxorbit.com"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.45rem",
              padding: "0.72rem 1.4rem",
              background: "#fff", color: "#1A56DB",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.04em",
              borderRadius: 8, textDecoration: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Contact Us →
          </a>
        </motion.div>
      </main>
    </>
  );
}
