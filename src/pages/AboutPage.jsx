import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

/* ─────────────────────────────────────
   Global Styles
───────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    :root {
      --blue: #1d8cf8;
      --blue-bright: #45a8ff;
      --deep: #03050f;
      --navy: #070d1e;
      --panel: #0b1425;
      --muted: #3a506b;
      --silver: #6a84a0;
      --white: #f4f8ff;
      --offwhite: #c8d8ee;
    }

    body {
      background: var(--deep);
      color: var(--white);
      font-family: 'DM Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      cursor: none;
    }

    ::selection { background: var(--blue); color: var(--deep); }

    #cin-cursor {
      position: fixed; top: 0; left: 0;
      width: 10px; height: 10px;
      background: var(--blue-bright);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: screen;
    }
    #cin-ring {
      position: fixed; top: 0; left: 0;
      width: 36px; height: 36px;
      border: 1px solid rgba(69,168,255,0.45);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.12s ease;
    }

    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-track { background: var(--deep); }
    ::-webkit-scrollbar-thumb { background: var(--blue); }

    .fd { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.06em; }
    .fi { font-family: 'Instrument Serif', serif; }

    .bt {
      background: linear-gradient(120deg, #1d8cf8 0%, #8dcfff 50%, #1d8cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    body::after {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 9990;
      opacity: 0.5;
    }

    .rule {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(29,140,248,0.4), transparent);
    }

    @keyframes glow {
      0%,100% { opacity: 0.5; transform: scale(1); }
      50%      { opacity: 1;   transform: scale(1.04); }
    }

    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    .shimmer-btn {
      background: linear-gradient(90deg, var(--blue) 0%, var(--blue-bright) 35%, var(--blue) 65%, var(--blue-bright) 100%);
      background-size: 250% auto;
      animation: shimmer 3.5s linear infinite;
    }

    @keyframes scanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }

    @media (max-width: 768px) {
      .two-col   { grid-template-columns: 1fr !important; gap: 3rem !important; }
      .three-col { grid-template-columns: 1fr !important; }
      .five-col  { grid-template-columns: repeat(2,1fr) !important; }
      .step-grid { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 480px) {
      .five-col { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

/* ─────────────────────────────────────
   Cursor
───────────────────────────────────── */
function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (dot.current)  dot.current.style.transform  = `translate(${e.clientX - 5}px,${e.clientY - 5}px)`;
      if (ring.current) ring.current.style.transform = `translate(${e.clientX - 18}px,${e.clientY - 18}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <>
      <div id="cin-cursor" ref={dot} />
      <div id="cin-ring"   ref={ring} />
    </>
  );
}

const Label = ({ children }) => (
  <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--blue)", marginBottom: "1.2rem" }}>
    {children}
  </p>
);

/* ─────────────────────────────────────
   01 — CINEMATIC HERO
───────────────────────────────────── */
function CinematicHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale   = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const yText   = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <section ref={ref} style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", background: "var(--deep)" }}>
      <motion.div style={{ position: "absolute", inset: 0, scale }}>
        <div style={{ position: "absolute", top: "8%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,140,248,0.10) 0%, transparent 65%)", animation: "glow 6s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(29,140,248,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(29,140,248,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(29,140,248,0.035) 1px,transparent 1px)", backgroundSize: "70px 70px" }} />
        <div style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,rgba(29,140,248,0.18),transparent)", animation: "scanline 6s linear infinite", pointerEvents: "none" }} />
      </motion.div>

      <motion.div style={{ position: "relative", width: "100%", padding: "0 2rem 6rem", y: yText, opacity }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16,1,0.3,1] }}
            style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}
          >
            <div style={{ width: 32, height: 1, background: "var(--blue)" }} />
            <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--blue)" }}>About AFXoRBIT</span>
          </motion.div>

          <div style={{ overflow: "hidden", marginBottom: "0.1em" }}>
            <motion.h1 initial={{ y: 160 }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.35, ease: [0.16,1,0.3,1] }}
              className="fd" style={{ fontSize: "clamp(5rem,14vw,14rem)", lineHeight: 0.88, color: "var(--white)" }}>
              BUILDING
            </motion.h1>
          </div>
          <div style={{ overflow: "hidden", marginBottom: "0.1em" }}>
            <motion.h1 initial={{ y: 160 }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.46, ease: [0.16,1,0.3,1] }}
              className="fd" style={{ fontSize: "clamp(5rem,14vw,14rem)", lineHeight: 0.88, color: "transparent", WebkitTextStroke: "1.5px rgba(29,140,248,0.35)" }}>
              DIGITAL
            </motion.h1>
          </div>
          <div style={{ overflow: "hidden", marginBottom: "2.5rem" }}>
            <motion.h1 initial={{ y: 160 }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.57, ease: [0.16,1,0.3,1] }}
              className="fd bt" style={{ fontSize: "clamp(5rem,14vw,14rem)", lineHeight: 0.88 }}>
              SYSTEMS.
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: [0.16,1,0.3,1] }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}
          >
            <p style={{ maxWidth: 440, fontSize: "1rem", lineHeight: 1.8, color: "var(--silver)", fontWeight: 300 }}>
              A modern digital agency combining technology and strategy to build platforms that perform, convert, and grow.
            </p>
            <div style={{ display: "flex", gap: "3rem" }}>
              {[["50+","Projects"],["3×","More Leads"],["24/7","AI Systems"]].map(([n,l]) => (
                <div key={l} style={{ textAlign: "right" }}>
                  <div className="fd" style={{ fontSize: "2.8rem", lineHeight: 1, color: "var(--blue)" }}>{n}</div>
                  <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--silver)", marginTop: "0.2rem" }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 180, background: "linear-gradient(to top, var(--deep), transparent)", pointerEvents: "none" }} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--muted)" }}>Scroll</span>
        <motion.div animate={{ y: [0,9,0] }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ width: 1, height: 36, background: "linear-gradient(to bottom, var(--blue), transparent)" }} />
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────
   02 — MISSION
───────────────────────────────────── */
function MissionSection() {
  return (
    <section style={{ background: "var(--navy)", overflow: "hidden", position: "relative" }}>
      <div className="rule" />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(10rem,28vw,26rem)", lineHeight: 1, color: "rgba(29,140,248,0.03)", whiteSpace: "nowrap", pointerEvents: "none", userSelect: "none", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.06em" }}>
        MISSION
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "8rem 2rem", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }} className="two-col">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: [0.16,1,0.3,1] }}>
            <Label>Our Mission</Label>
            <h2 className="fd" style={{ fontSize: "clamp(3rem,6vw,5.5rem)", lineHeight: 1, color: "var(--white)", marginBottom: "2rem" }}>
              PLATFORMS THAT<br /><span className="bt">PERFORM.</span><br />CONVERT.<br />GROW.
            </h2>
            <div style={{ height: 1, width: 80, background: "var(--blue)", marginBottom: "2rem", opacity: 0.6 }} />
            <p style={{ fontSize: "1rem", lineHeight: 1.85, color: "var(--silver)", fontWeight: 300 }}>
              We build digital platforms that don't just look professional — but work relentlessly to attract clients, close deals, and scale your business. Every business deserves a digital presence as ambitious as they are.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, delay: 0.15, ease: [0.16,1,0.3,1] }}
            style={{ display: "flex", flexDirection: "column", gap: "1px", border: "1px solid rgba(29,140,248,0.15)", borderRadius: 8, overflow: "hidden" }}>
            {[
              { icon: "◎", label: "Attract qualified traffic" },
              { icon: "◈", label: "Convert visitors into clients" },
              { icon: "⬡", label: "Automate repetitive processes" },
              { icon: "◇", label: "Improve operational efficiency" },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                style={{ padding: "1.8rem 2rem", background: "var(--panel)", display: "flex", alignItems: "center", gap: "1.4rem", transition: "background 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(29,140,248,0.06)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--panel)"}>
                <span style={{ fontSize: "1.4rem", color: "var(--blue)", flexShrink: 0, opacity: 0.8 }}>{item.icon}</span>
                <p style={{ fontSize: "1rem", fontWeight: 500, color: "var(--offwhite)" }}>{item.label}</p>
                <span style={{ marginLeft: "auto", color: "var(--blue)", opacity: 0.4, fontSize: "0.8rem" }}>→</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="rule" />
    </section>
  );
}

/* ─────────────────────────────────────
   03 — APPROACH
───────────────────────────────────── */
const steps = [
  { n: "01", title: "Strategy First",       body: "Every project begins with deep research. We analyze your business, competitors, audience, and goals before writing a single line of code." },
  { n: "02", title: "Performance Dev",      body: "We build fast, secure, and responsive websites optimized simultaneously for users and search engines from day one." },
  { n: "03", title: "Visibility & SEO",     body: "On-page SEO, local schema, Google Business optimization — we make sure the right people find you first." },
  { n: "04", title: "Smart Automation",     body: "From lead capture to CRM integration, we build workflows that eliminate busywork and run 24/7." },
];

function ApproachSection() {
  return (
    <section style={{ background: "var(--deep)", padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "5rem", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <Label>Our Approach</Label>
            <h2 className="fd" style={{ fontSize: "clamp(3rem,6vw,5.5rem)", lineHeight: 1, color: "var(--white)" }}>
              STRUCTURED.<br /><span className="bt">STRATEGIC.<br />SCALABLE.</span>
            </h2>
          </div>
          <p style={{ maxWidth: 320, fontSize: "0.95rem", lineHeight: 1.8, color: "var(--silver)", fontWeight: 300 }}>
            Our goal is not just to deliver a project — but to build a scalable digital system that compounds value over time.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(29,140,248,0.1)", border: "1px solid rgba(29,140,248,0.1)", borderRadius: 8, overflow: "hidden" }} className="step-grid">
          {steps.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16,1,0.3,1] }}
              style={{ background: "var(--navy)", padding: "2.8rem 2.2rem", position: "relative", overflow: "hidden", transition: "background 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(29,140,248,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--navy)"}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--blue),transparent)", opacity: 0, transition: "opacity 0.3s" }} />
              <div className="fd" style={{ fontSize: "5.5rem", lineHeight: 1, color: "rgba(29,140,248,0.1)", marginBottom: "1.5rem" }}>{s.n}</div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.9rem" }}>{s.title}</h3>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.75, color: "var(--silver)", fontWeight: 300 }}>{s.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
          style={{ marginTop: "2rem", padding: "2rem 2.5rem", border: "1px solid rgba(29,140,248,0.18)", borderRadius: 8, background: "var(--panel)", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ width: 3, height: 56, background: "var(--blue)", borderRadius: 2, flexShrink: 0 }} />
          <p className="fi" style={{ fontSize: "1.15rem", fontStyle: "italic", color: "var(--offwhite)", lineHeight: 1.6 }}>
            "We don't just deliver websites — we engineer digital systems designed to compound value and outlast trends."
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   04 — DIFFERENTIATORS
───────────────────────────────────── */
const diffs = [
  "Strategic thinking before execution",
  "SEO-focused development structure",
  "Clean, scalable code and architecture",
  "Data-driven decision making",
  "Long-term growth perspective",
];

function DifferentSection() {
  return (
    <section style={{ background: "var(--navy)", overflow: "hidden" }}>
      <div className="rule" />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "8rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }} className="two-col">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: [0.16,1,0.3,1] }}>
            <Label>What Makes Us Different</Label>
            <h2 className="fd" style={{ fontSize: "clamp(3rem,6vw,5.5rem)", lineHeight: 1, color: "var(--white)", marginBottom: "1.5rem" }}>
              WE BUILD<br />
              <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(29,140,248,0.35)" }}>DIGITAL</span><br />
              <span className="bt">ASSETS.</span>
            </h2>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.85, color: "var(--silver)", fontWeight: 300, maxWidth: 400 }}>
              We don't chase trends. Every system we build is a long-term digital asset designed to create measurable, compounding value for your business.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {diffs.map((d, i) => (
              <motion.div key={d} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: i * 0.09, ease: [0.16,1,0.3,1] }}
                style={{ display: "flex", alignItems: "center", gap: "1.2rem", padding: "1.2rem 1.6rem", background: "var(--panel)", border: "1px solid rgba(29,140,248,0.1)", borderRadius: 6, transition: "all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(29,140,248,0.06)"; e.currentTarget.style.borderColor = "rgba(29,140,248,0.35)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--panel)"; e.currentTarget.style.borderColor = "rgba(29,140,248,0.1)"; e.currentTarget.style.transform = "none"; }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid var(--blue)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue)" }} />
                </div>
                <p style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--offwhite)" }}>{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="rule" />
    </section>
  );
}

/* ─────────────────────────────────────
   05 — WHO WE WORK WITH
───────────────────────────────────── */
const clients = [
  { icon: "🏪", title: "Local Service Businesses", desc: "Dentists, gyms, spas, clinics — we make them look world-class." },
  { icon: "🚀", title: "Growing Startups",          desc: "Fast-moving teams that need scalable digital foundations." },
  { icon: "🛒", title: "E-commerce Brands",         desc: "Conversion-first stores built to sell at every touchpoint." },
  { icon: "💡", title: "Entrepreneurs",             desc: "Solo founders ready to make their mark online." },
  { icon: "🔄", title: "Companies Modernizing",     desc: "Businesses replacing outdated platforms with systems built for today." },
];

function ClientsSection() {
  return (
    <section style={{ background: "var(--deep)", padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
          style={{ textAlign: "center", marginBottom: "5rem" }}>
          <Label>Who We Work With</Label>
          <h2 className="fd" style={{ fontSize: "clamp(3rem,6vw,5.5rem)", lineHeight: 1, color: "var(--white)" }}>
            WE WORK WITH<br /><span className="bt">BUILDERS.</span>
          </h2>
          <p style={{ maxWidth: 480, margin: "1.5rem auto 0", fontSize: "1rem", lineHeight: 1.8, color: "var(--silver)", fontWeight: 300 }}>
            Whether you're launching or levelling up — if you're serious about growth, we're the right team.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "1px", background: "rgba(29,140,248,0.1)", border: "1px solid rgba(29,140,248,0.1)", borderRadius: 8, overflow: "hidden" }} className="five-col">
          {clients.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: i * 0.08 }}
              style={{ background: "var(--navy)", padding: "2.5rem 1.8rem", textAlign: "center", transition: "background 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(29,140,248,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--navy)"}>
              <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>{c.icon}</div>
              <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.7rem", lineHeight: 1.3 }}>{c.title}</h3>
              <p style={{ fontSize: "0.8rem", lineHeight: 1.6, color: "var(--silver)", fontWeight: 300 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   06 — COMMITMENT
───────────────────────────────────── */
function CommitmentSection() {
  return (
    <section style={{ background: "var(--navy)", padding: "8rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: "-2rem", right: "-2rem", fontSize: "clamp(8rem,18vw,18rem)", lineHeight: 1, color: "rgba(29,140,248,0.03)", pointerEvents: "none", userSelect: "none", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.06em" }}>
        TRUST
      </div>
      <div className="rule" />
      <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: "5rem" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
          style={{ textAlign: "center", marginBottom: "5rem" }}>
          <Label>Our Commitment</Label>
          <h2 className="fd" style={{ fontSize: "clamp(3rem,6vw,5.5rem)", lineHeight: 1, color: "var(--white)" }}>
            THREE WORDS.<br /><span className="bt">ONE PROMISE.</span>
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }} className="three-col">
          {[
            { word: "Transparency", desc: "Clear communication, defined deliverables, no surprises. You always know exactly where your project stands.", n: "01" },
            { word: "Performance",  desc: "We measure our success by the real business results your digital system produces — not vanity metrics.", n: "02" },
            { word: "Reliability",  desc: "Every client partnership is built on trust and accountability. Your success online is our priority.", n: "03" },
          ].map((item, i) => (
            <motion.div key={item.word} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16,1,0.3,1] }}
              style={{ padding: "3rem 2.5rem", border: "1px solid rgba(29,140,248,0.12)", borderRadius: 8, background: "var(--panel)", position: "relative", overflow: "hidden", transition: "border-color 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(29,140,248,0.4)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(29,140,248,0.12)"}>
              <div style={{ position: "absolute", top: 0, left: "2rem", right: "2rem", height: 2, background: "linear-gradient(90deg,transparent,var(--blue),transparent)" }} />
              <div className="fd" style={{ fontSize: "5rem", lineHeight: 1, color: "rgba(29,140,248,0.08)", position: "absolute", top: "1rem", right: "1.5rem" }}>{item.n}</div>
              <h3 className="fd" style={{ fontSize: "2.8rem", color: "var(--blue)", marginBottom: "1.2rem", lineHeight: 1 }}>{item.word}</h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--silver)", fontWeight: 300 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   07 — CTA
───────────────────────────────────── */
function CTASection() {
  return (
    <section style={{ background: "var(--deep)", minHeight: "60vh", display: "flex", alignItems: "center", padding: "8rem 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(29,140,248,0.1) 0%,transparent 70%)", pointerEvents: "none", animation: "glow 5s ease-in-out infinite" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative" }}>
        <div style={{ border: "1px solid rgba(29,140,248,0.2)", borderRadius: 12, padding: "clamp(3rem,7vw,6rem)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          {[{t:0,l:0},{t:0,r:0},{b:0,l:0},{b:0,r:0}].map((c,i) => (
            <div key={i} style={{ position:"absolute", width:40, height:40, top:c.t, bottom:c.b, left:c.l, right:c.r,
              borderTop: c.t===0?"2px solid var(--blue)":undefined, borderBottom: c.b===0?"2px solid var(--blue)":undefined,
              borderLeft: c.l===0?"2px solid var(--blue)":undefined, borderRight: c.r===0?"2px solid var(--blue)":undefined }} />
          ))}

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: [0.16,1,0.3,1] }}>
            <Label>Let's Build Something Powerful</Label>
            <h2 className="fd" style={{ fontSize: "clamp(3rem,8vw,7.5rem)", lineHeight: 0.9, color: "var(--white)", marginBottom: "1.5rem" }}>
              READY TO ELEVATE<br /><span className="bt">YOUR DIGITAL<br />PRESENCE?</span>
            </h2>
            <p style={{ maxWidth: 500, margin: "0 auto 3rem", fontSize: "1rem", lineHeight: 1.8, color: "var(--silver)", fontWeight: 300 }}>
              If you're ready to implement systems designed for growth, AFXoRBIT is ready to build. Let's make something powerful together.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a href="https://afxorbit.com" target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="shimmer-btn"
                style={{ textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"0.7rem", padding:"1.05rem 2.3rem", borderRadius:4, fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--deep)" }}>
                Visit Website
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </motion.a>
              <motion.a href="mailto:contact@afxorbit.com"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                style={{ textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"0.7rem", padding:"1.05rem 2.3rem", borderRadius:4, fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--white)", border:"1px solid rgba(255,255,255,0.15)", background:"transparent", transition:"all 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="var(--blue)"; e.currentTarget.style.color="var(--blue)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; e.currentTarget.style.color="var(--white)"; }}>
                contact@afxorbit.com
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   Page root
───────────────────────────────────── */
export default function AboutPage() {
  return (
    <>
      <Styles />
      <Cursor />
      <main style={{ minHeight: "100vh", background: "var(--deep)",marginTop:"90px" }}>
        <CinematicHero />
        <MissionSection />
        <ApproachSection />
        <DifferentSection />
        <ClientsSection />
        <CommitmentSection />
        <CTASection />
      </main>
    </>
  );
}