import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

    :root {
      --ink:       #0A0F1E;
      --ink-2:     #1C2540;
      --ink-3:     #384060;
      --muted:     #7A88A8;
      --muted-2:   #A8B4CC;
      --border:    rgba(10,15,30,0.08);
      --border-2:  rgba(10,15,30,0.14);
      --blue:      #1A56DB;
      --blue-2:    #2563EB;
      --blue-3:    #3B82F6;
      --blue-lt:   rgba(37,99,235,0.08);
      --blue-lt2:  rgba(37,99,235,0.14);
      --page:      #F8FAFF;
      --surface:   #FFFFFF;
      --surface-2: #F2F6FF;
      --surface-3: #E8EFFF;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--page);
      color: var(--ink);
      overflow-x: hidden;
      cursor: none;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Custom cursor ── */
    .cur { position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999; }
    .cur-dot  { width: 8px; height: 8px; border-radius: 50%; background: var(--blue); }
    .cur-ring { width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid rgba(37,99,235,0.35); transition: transform 0.12s ease; }
    @media (max-width: 768px) { .cur { display: none; } body { cursor: auto; } }

    /* ── Typography ── */
    .t-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.01em; }
    .t-serif   { font-family: 'Instrument Serif', serif; }
    .t-body    { font-family: 'DM Sans', sans-serif; }

    /* ── Marquee ── */
    @keyframes marquee { to { transform: translateX(-50%); } }
    .mq-track { display: inline-flex; gap: 3rem; white-space: nowrap; animation: marquee 28s linear infinite; }

    /* ── Animations ── */
    @keyframes floatY  { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-10px)} }
    @keyframes rotateZ { to { transform: rotate(360deg); } }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes pulse   { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
    @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0.3} }

    /* ── Buttons ── */
    .btn-primary {
      display: inline-flex; align-items: center; gap: 0.55rem;
      padding: 0.9rem 2.1rem;
      background: var(--blue);
      color: #fff;
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.83rem;
      letter-spacing: 0.04em;
      border: none; border-radius: 4px;
      cursor: none; position: relative; overflow: hidden;
      box-shadow: 0 12px 32px rgba(26,86,219,0.3), 0 2px 8px rgba(26,86,219,0.2);
      transition: box-shadow 0.3s, transform 0.2s;
    }
    .btn-primary::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
      background-size: 200% auto;
      opacity: 0; transition: opacity 0.3s;
    }
    .btn-primary:hover::before { opacity: 1; animation: shimmer 1.2s linear infinite; }
    .btn-primary:hover { box-shadow: 0 20px 48px rgba(26,86,219,0.38), 0 4px 12px rgba(26,86,219,0.25); transform: translateY(-1px); }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 0.55rem;
      padding: 0.9rem 2.1rem;
      background: transparent;
      color: var(--ink);
      font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.83rem;
      letter-spacing: 0.04em;
      border: 1.5px solid var(--border-2); border-radius: 4px;
      cursor: none;
      transition: border-color 0.25s, background 0.25s;
    }
    .btn-ghost:hover { border-color: var(--blue-3); background: var(--blue-lt); color: var(--blue); }

    /* ── Card ── */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s;
    }
    .card:hover {
      box-shadow: 0 16px 48px rgba(10,15,30,0.1);
      transform: translateY(-3px);
      border-color: var(--blue-lt2);
    }

    /* ── Section label ── */
    .s-label {
      display: inline-flex; align-items: center; gap: 0.6rem;
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.28em;
      text-transform: uppercase; color: var(--blue);
    }
    .s-label::before { content:''; display:block; width:22px; height:1.5px; background:var(--blue); }

    /* ── Divider ── */
    .divider { width: 100%; height: 1px; background: var(--border); }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--page); }
    ::-webkit-scrollbar-thumb { background: var(--blue-lt2); border-radius: 4px; }

    /* ── Responsive helpers ── */
    @media (max-width: 900px) { .hide-mobile { display: none !important; } }
    @media (min-width: 901px) { .hide-desktop { display: none !important; } }
  `}</style>
);

/* ─── CURSOR ─────────────────────────────────────────────────── */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const move = e => {
      if (dot.current)  dot.current.style.transform  = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      if (ring.current) ring.current.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div className="cur" style={{ position: "fixed", zIndex: 9999 }}>
      <div ref={dot}  className="cur cur-dot"  style={{ position: "fixed", top: 0, left: 0 }} />
      <div ref={ring} className="cur cur-ring" style={{ position: "fixed", top: 0, left: 0 }} />
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────── */
function Hero() {
  const words = ["TRUST", "LEADS", "GROWTH"];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % 3), 2600);
    return () => clearInterval(t);
  }, []);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={ref} id="home" style={{
      minHeight: "100svh",
      background: "var(--surface)",
      padding: "7rem 2rem 5rem",
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center",
    }}>
      {/* Background texture — fine grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "72px 72px", pointerEvents: "none" }} />

      {/* Gradient wash — top right */}
      <motion.div style={{ position: "absolute", top: "-15%", right: "-10%", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 65%)", pointerEvents: "none", y }} />
      {/* Gradient wash — bottom left */}
      <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Floating geometry */}
      <motion.div
        style={{ position: "absolute", top: "18%", right: "7%", width: 72, height: 72, border: "1.5px solid rgba(37,99,235,0.15)", borderRadius: 12, pointerEvents: "none" }}
        animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ position: "absolute", top: "42%", right: "16%", width: 10, height: 10, borderRadius: "50%", background: "var(--blue-3)", opacity: 0.4, pointerEvents: "none" }}
        animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        style={{ position: "absolute", bottom: "22%", right: "5%", width: 44, height: 44, border: "1.5px solid rgba(37,99,235,0.12)", transform: "rotate(45deg)", pointerEvents: "none" }}
        animate={{ y: [0, -8, 0], rotate: ["45deg", "51deg", "45deg"] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", position: "relative" }}>
        {/* Layout: left content + right card */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr min(420px, 40%)", gap: "4rem", alignItems: "center" }}
          className="hero-grid">

          {/* LEFT */}
          <div>
            {/* Available chip */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", padding: "0.35rem 1rem 0.35rem 0.55rem", background: "var(--blue-lt)", border: "1px solid var(--blue-lt2)", borderRadius: 100, marginBottom: "2rem" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.7)", animation: "pulse 2s ease infinite" }} />
              <span style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--blue)" }}>Available for new projects</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="t-display"
              style={{ fontSize: "clamp(4rem, 9.5vw, 9rem)", lineHeight: 0.9, color: "var(--ink)", marginBottom: "0.1rem" }}>
              WE BUILD<br />
              <span style={{ WebkitTextStroke: "2px var(--blue)", color: "transparent" }}>WEBSITES</span><br />
              THAT DRIVE
            </motion.h1>

            {/* Cycling word */}
            <AnimatePresence mode="wait">
              <motion.div key={idx}
                initial={{ y: 40, opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -40, opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                className="t-display"
                style={{ fontSize: "clamp(4rem, 9.5vw, 9rem)", lineHeight: 0.9, color: "var(--blue)" }}>
                {words[idx]}
              </motion.div>
            </AnimatePresence>

            {/* Sub */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              style={{ maxWidth: 500, marginTop: "2rem", color: "var(--ink-3)", lineHeight: 1.85, fontSize: "1rem", fontWeight: 400 }}>
              Premium, conversion-focused web design for local businesses that want to look world-class and dominate their market.
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              style={{ display: "flex", gap: "0.9rem", marginTop: "2.2rem", flexWrap: "wrap" }}>
              <button className="btn-primary">Start a Project →</button>
              <button className="btn-ghost">View Our Work</button>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
              style={{ display: "flex", gap: "2.5rem", marginTop: "2.8rem", paddingTop: "2rem", borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
              {[["40+", "Clients Served"], ["3×", "Avg. Lead Growth"], ["98%", "Satisfaction"]].map(([n, l]) => (
                <div key={l}>
                  <p className="t-display" style={{ fontSize: "2.2rem", lineHeight: 1, color: "var(--blue)" }}>{n}</p>
                  <p style={{ fontSize: "0.67rem", fontWeight: 600, color: "var(--muted)", letterSpacing: "0.12em", marginTop: "0.2rem", textTransform: "uppercase" }}>{l}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — hero card */}
          <motion.div initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="hide-mobile">
            <div className="card" style={{ padding: "1.8rem", borderRadius: 16, overflow: "hidden", position: "relative", boxShadow: "0 24px 64px rgba(10,15,30,0.1)" }}>
              {/* Blue accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--blue) 0%, var(--blue-3) 100%)", borderRadius: "16px 16px 0 0" }} />

              {/* Mock browser */}
              <div style={{ background: "var(--surface-2)", borderRadius: 10, overflow: "hidden", marginBottom: "1.2rem", border: "1px solid var(--border)" }}>
                <div style={{ padding: "0.55rem 0.8rem", background: "var(--surface)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                  <div style={{ flex: 1, height: 18, background: "var(--surface-2)", borderRadius: 4, marginLeft: "0.4rem" }} />
                </div>
                <div style={{ padding: "1.2rem", height: 155, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  <div style={{ height: 11, width: "55%", background: "var(--blue-lt2)", borderRadius: 4 }} />
                  <div style={{ height: 7, width: "88%", background: "var(--surface-3)", borderRadius: 4 }} />
                  <div style={{ height: 7, width: "72%", background: "var(--surface-3)", borderRadius: 4 }} />
                  <div style={{ height: 30, width: "42%", background: "linear-gradient(90deg,var(--blue),var(--blue-3))", borderRadius: 5, marginTop: "0.5rem" }} />
                </div>
              </div>

              {/* Metric grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
                {[["↑ 312%","Organic Traffic"],["↑ 89%","Conversions"],["4.9 ★","Avg. Rating"],["<2s","Load Time"]].map(([v,l]) => (
                  <div key={l} style={{ background: "var(--surface-2)", borderRadius: 9, padding: "0.85rem", border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "1rem", fontWeight: 800, color: "var(--blue)" }}>{v}</p>
                    <p style={{ fontSize: "0.63rem", color: "var(--muted)", fontWeight: 600, marginTop: "0.15rem" }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── MARQUEE ─────────────────────────────────────────────────── */
function Marquee() {
  const items = ["Dental Studio","Prime Fitness","Urban Law","Glow Spa","Luxe Dental","NorthFit","Bella Spa","The Loft Clinic"];
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "var(--ink)", overflow: "hidden", padding: "1rem 0", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="mq-track">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: "1.5rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
            {item}
            <span style={{ color: "rgba(59,130,246,0.5)", fontSize: "0.45rem" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── ABOUT ─────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" style={{ background: "var(--page)", padding: "8rem 2rem", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Top label */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ marginBottom: "4rem" }}>
          <span className="s-label">About Us</span>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="about-grid">

          {/* VISUAL */}
          <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ position: "relative" }}>
            {/* Main blue card */}
            <div style={{ background: "linear-gradient(145deg, var(--blue) 0%, #1338BE 100%)", borderRadius: 20, padding: "2.8rem", position: "relative", overflow: "hidden", boxShadow: "0 32px 80px rgba(26,86,219,0.28)" }}>
              <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
              <p className="t-display" style={{ fontSize: "3.5rem", color: "rgba(255,255,255,0.12)", lineHeight: 1, marginBottom: "1.4rem" }}>AFXoRBIT</p>
              <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "1rem", lineHeight: 1.85, fontWeight: 400 }}>
                We build websites that don't just look good — they generate real, measurable revenue for local businesses.
              </p>
              <div style={{ display: "flex", gap: "2rem", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                {[["5+","Years"],["40+","Clients"],["100%","Dedicated"]].map(([n,l]) => (
                  <div key={l}>
                    <p style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>{n}</p>
                    <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", bottom: "-1.4rem", right: "-1.4rem", background: "var(--surface)", borderRadius: 14, padding: "1rem 1.4rem", boxShadow: "0 12px 36px rgba(10,15,30,0.14)", border: "1px solid var(--border-2)" }}>
              <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--blue)" }}>98%</p>
              <p style={{ fontSize: "0.58rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Client Satisfaction</p>
            </motion.div>
          </motion.div>

          {/* TEXT */}
          <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="t-display" style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", lineHeight: 0.95, color: "var(--ink)", marginBottom: "1.6rem" }}>
              DESIGN THAT<br />
              <span style={{ WebkitTextStroke: "1.5px var(--blue)", color: "transparent" }}>ACTUALLY WORKS</span>
            </h2>
            <p style={{ color: "var(--ink-3)", lineHeight: 1.9, fontSize: "0.97rem", marginBottom: "1.1rem" }}>
              AFXoRBIT is a premium web design studio focused entirely on local businesses. We combine sharp design with conversion strategy — every pixel has a purpose.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.9, fontSize: "0.92rem", marginBottom: "2rem" }}>
              From dental clinics to law firms and fitness studios, we've helped dozens of local businesses triple their inbound leads within the first 90 days.
            </p>
            {["Conversion-first design philosophy","Fast turnaround — live in 14 days","Built for local SEO dominance"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.85rem" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--blue-lt)", border: "1px solid var(--blue-lt2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "var(--blue)", fontSize: "0.6rem", fontWeight: 800 }}>✓</span>
                </div>
                <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--ink-2)" }}>{item}</p>
              </div>
            ))}
            <div style={{ marginTop: "2rem" }}>
              <button className="btn-primary">Book a Free Call →</button>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── SERVICES ─────────────────────────────────────────────── */
const SERVICES = [
  { icon: "⬡", num: "01", name: "Website Design",         desc: "Bespoke, mobile-first sites built to reflect your brand and convert visitors into clients." },
  { icon: "◈", num: "02", name: "Landing Pages",           desc: "High-converting single pages engineered around one clear, profitable action." },
  { icon: "◎", num: "03", name: "SEO & Local Search",      desc: "On-page optimization and local SEO so your business ranks when customers search." },
  { icon: "⟳", num: "04", name: "Business Automations",    desc: "Smart forms, CRM integrations, and follow-up flows that close leads automatically." },
  { icon: "⚡", num: "05", name: "AI Chat System",          desc: "24/7 AI assistant that captures leads, answers questions, and books calls — hands-free." },
  { icon: "◌", num: "06", name: "Ongoing Support",         desc: "Monthly retainers for edits, updates, and growth — we stay in your corner." },
];

function Services() {
  return (
    <section id="services" style={{ background: "var(--surface)", padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <span className="s-label" style={{ marginBottom: "0.8rem", display: "inline-flex" }}>What We Do</span>
            <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.95, color: "var(--ink)", marginTop: "0.6rem" }}>
              EVERYTHING<br />
              <span style={{ WebkitTextStroke: "1.5px var(--blue)", color: "transparent" }}>YOUR BRAND</span><br />
              NEEDS
            </h2>
          </div>
          <p style={{ maxWidth: 300, color: "var(--muted)", lineHeight: 1.8, fontSize: "0.9rem", fontWeight: 400 }}>
            Six carefully designed services that work together to grow your business from first click to loyal customer.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--border)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)" }} className="svc-grid">
          {SERVICES.map((s, i) => (
            <motion.div key={s.name}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              style={{ background: "var(--surface)", padding: "2rem", position: "relative", transition: "background 0.25s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--surface)"}
            >
              {/* Number */}
              <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", color: "var(--muted-2)", marginBottom: "1.2rem" }}>{s.num}</p>
              {/* Icon */}
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--blue-lt)", border: "1px solid var(--blue-lt2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", color: "var(--blue)", marginBottom: "1.1rem" }}>
                {s.icon}
              </div>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--ink)", marginBottom: "0.55rem" }}>{s.name}</p>
              <p style={{ color: "var(--ink-3)", fontSize: "0.84rem", lineHeight: 1.75 }}>{s.desc}</p>

              {/* Hover accent line */}
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: "linear-gradient(90deg, var(--blue), var(--blue-3))", opacity: 0, transition: "opacity 0.25s" }}
                className="svc-line" />
            </motion.div>
          ))}
        </div>

        <style>{`
          @media (max-width: 900px) { .svc-grid { grid-template-columns: 1fr 1fr !important; } }
          @media (max-width: 560px) { .svc-grid { grid-template-columns: 1fr !important; } }
          .svc-grid > div:hover .svc-line { opacity: 1 !important; }
        `}</style>
      </div>
    </section>
  );
}

/* ─── WORK ──────────────────────────────────────────────────── */
const PROJECTS = [
  { name: "Luxe Dental Studio", cat: "Healthcare · Dental",   result: "+280% bookings",       accent: "#2563EB" },
  { name: "Prime Fitness Co.",  cat: "Wellness · Fitness",    result: "+190% memberships",    accent: "#1A56DB" },
  { name: "Urban Law Group",    cat: "Legal · Professional",  result: "+340% consultations",  accent: "#3B82F6" },
  { name: "Glow Aesthetics",    cat: "Beauty · Spa",          result: "+210% appointments",   accent: "#1D4ED8" },
];

function Work() {
  return (
    <section id="work" style={{ background: "var(--page)", padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3.5rem", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <span className="s-label" style={{ marginBottom: "0.8rem", display: "inline-flex" }}>Our Work</span>
            <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.95, color: "var(--ink)", marginTop: "0.6rem" }}>
              FEATURED<br />
              <span style={{ color: "var(--blue)" }}>PROJECTS</span>
            </h2>
          </div>
          <button className="btn-ghost">View All Projects →</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }} className="work-grid">
          {PROJECTS.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="card" style={{ overflow: "hidden", cursor: "none" }}>

              {/* Mock screen */}
              <div style={{ height: 200, background: `linear-gradient(135deg, ${p.accent}12, ${p.accent}22)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: "70%", height: "62%", background: "rgba(255,255,255,0.9)", borderRadius: 8, boxShadow: "0 4px 24px rgba(10,15,30,0.12)", padding: "0.8rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ height: 8, width: "50%", background: p.accent, borderRadius: 4, opacity: 0.8 }} />
                  <div style={{ height: 6, width: "85%", background: "#e2e8f0", borderRadius: 4 }} />
                  <div style={{ height: 6, width: "68%", background: "#e2e8f0", borderRadius: 4 }} />
                  <div style={{ height: 24, width: "40%", background: p.accent, borderRadius: 4, marginTop: "0.35rem" }} />
                </div>
                <div style={{ position: "absolute", top: "0.7rem", right: "0.7rem", background: "var(--ink)", color: "#fff", padding: "0.22rem 0.65rem", borderRadius: 20, fontSize: "0.57rem", fontWeight: 700, letterSpacing: "0.12em" }}>LIVE</div>
              </div>

              <div style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--blue)", marginBottom: "0.35rem" }}>{p.cat}</p>
                <p style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--ink)", marginBottom: "0.8rem" }}>{p.name}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--blue-lt)", border: "1px solid var(--blue-lt2)", borderRadius: 100, padding: "0.28rem 0.8rem" }}>
                  <span style={{ color: "#22c55e", fontSize: "0.6rem" }}>▲</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--blue)" }}>{p.result}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 680px) { .work-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

/* ─── PROCESS ──────────────────────────────────────────────── */
function Process() {
  const steps = [
    { num: "01", title: "Discovery Call",   desc: "We understand your business, goals, and target audience in a free 30-minute strategy session." },
    { num: "02", title: "Design & Build",   desc: "Custom design mockups delivered within 3 days. Full build completed in 14 days or less." },
    { num: "03", title: "Launch & Optimize",desc: "Go live with full SEO setup, speed optimization, and analytics tracking from day one." },
    { num: "04", title: "Grow Together",    desc: "Ongoing support, monthly updates, and conversion tracking to keep performance climbing." },
  ];
  return (
    <section style={{ background: "var(--surface)", padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }} className="proc-grid">

          {/* Left label + headline */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="s-label" style={{ marginBottom: "1rem", display: "inline-flex" }}>How It Works</span>
            <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 0.95, color: "var(--ink)", marginTop: "0.7rem", marginBottom: "2rem" }}>
              FROM IDEA<br />TO LIVE IN<br />
              <span style={{ color: "var(--blue)" }}>7 DAYS</span>
            </h2>
            <p style={{ color: "var(--ink-3)", lineHeight: 1.85, fontSize: "0.95rem", maxWidth: 380 }}>
              Our proven process gets you online fast — without sacrificing quality. Clear timelines, no guesswork.
            </p>
          </motion.div>

          {/* Right steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ display: "flex", gap: "1.4rem", paddingBottom: i < steps.length - 1 ? "2rem" : 0, position: "relative" }}>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", left: "1rem", top: "2.4rem", bottom: 0, width: 1, background: "linear-gradient(to bottom, var(--blue-lt2), transparent)" }} />
                )}
                {/* Number bubble */}
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--blue-lt)", border: "1px solid var(--blue-lt2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span className="t-display" style={{ fontSize: "0.75rem", color: "var(--blue)", lineHeight: 1 }}>{s.num}</span>
                </div>
                <div style={{ paddingTop: "0.3rem" }}>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--ink)", marginBottom: "0.4rem" }}>{s.title}</p>
                  <p style={{ color: "var(--muted)", fontSize: "0.86rem", lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .proc-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }
      `}</style>
    </section>
  );
}

/* ─── PRICING ──────────────────────────────────────────────── */
const PLANS = [
  {
    name: "Starter", price: "$500", period: "one-time",
    desc: "Strong online presence for businesses starting their digital journey.",
    features: ["5-page website","Mobile responsive design","Basic SEO setup","Contact form + map","2 revision rounds","Delivered in 2 days"],
    featured: false,
  },
  {
    name: "Growth", price: "$900", period: "one-time",
    desc: "Our most popular package for businesses ready to convert visitors.",
    features: ["Up to 8 pages","Advanced SEO + local optimization","Lead capture & forms","Google Analytics setup","Speed optimization","5 revision rounds","Delivered in 7 days"],
    featured: true,
  },
  {
    name: "Premium", price: "$1,500+", period: "custom scope",
    desc: "Full-scale brand presence with automation and ongoing support.",
    features: ["Up to 10 pages","Custom animations","CRM + automation flows","Monthly support retainer","Unlimited revisions","Priority 24hr response","Delivered in 21 days"],
    featured: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" style={{ background: "var(--page)", padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="s-label" style={{ justifyContent: "center", marginBottom: "1rem", display: "inline-flex" }}>Pricing</span>
          <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 0.95, color: "var(--ink)", marginTop: "0.6rem", marginBottom: "1rem" }}>
            PACKAGES BUILT<br />
            <span style={{ color: "var(--blue)" }}>FOR GROWTH</span>
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: 440, margin: "0 auto", lineHeight: 1.8, fontSize: "0.92rem" }}>
            No hidden fees, no surprises. Pick the plan that fits and we'll handle everything else.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", alignItems: "start" }} className="price-grid">
          {PLANS.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{
                borderRadius: 14,
                border: p.featured ? "1.5px solid var(--blue)" : "1px solid var(--border-2)",
                boxShadow: p.featured ? "0 24px 64px rgba(26,86,219,0.18)" : "0 2px 16px rgba(10,15,30,0.06)",
                background: p.featured ? "linear-gradient(145deg, var(--blue) 0%, #1338BE 100%)" : "var(--surface)",
                transform: p.featured ? "scale(1.04)" : "scale(1)",
                position: "relative", overflow: "hidden",
              }}>

              {p.featured && (
                <div style={{ textAlign: "center", padding: "0.45rem", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  ⭐ Most Popular
                </div>
              )}

              <div style={{ padding: "2rem" }}>
                <p style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: p.featured ? "rgba(255,255,255,0.65)" : "var(--blue)", marginBottom: "0.5rem" }}>{p.name}</p>
                <p className="t-display" style={{ fontSize: "3.2rem", lineHeight: 1, color: p.featured ? "#fff" : "var(--ink)", marginBottom: "0.3rem" }}>{p.price}</p>
                <p style={{ fontSize: "0.68rem", color: p.featured ? "rgba(255,255,255,0.45)" : "var(--muted)", fontWeight: 600, letterSpacing: "0.1em", marginBottom: "1rem" }}>{p.period}</p>
                <p style={{ fontSize: "0.85rem", color: p.featured ? "rgba(255,255,255,0.72)" : "var(--ink-3)", lineHeight: 1.75, marginBottom: "1.5rem" }}>{p.desc}</p>

                <div style={{ borderTop: `1px solid ${p.featured ? "rgba(255,255,255,0.12)" : "var(--border)"}`, paddingTop: "1.3rem", marginBottom: "1.7rem" }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.65rem" }}>
                      <div style={{ width: 17, height: 17, borderRadius: "50%", background: p.featured ? "rgba(255,255,255,0.15)" : "var(--blue-lt)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: p.featured ? "#fff" : "var(--blue)", fontSize: "0.52rem", fontWeight: 800 }}>✓</span>
                      </div>
                      <p style={{ fontSize: "0.83rem", color: p.featured ? "rgba(255,255,255,0.82)" : "var(--ink-2)", fontWeight: 500 }}>{f}</p>
                    </div>
                  ))}
                </div>

                <button style={{
                  width: "100%", padding: "0.88rem",
                  background: p.featured ? "#fff" : "var(--blue)",
                  color: p.featured ? "var(--blue)" : "#fff",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.05em",
                  border: "none", borderRadius: 7, cursor: "none",
                  boxShadow: p.featured ? "none" : "0 8px 24px rgba(26,86,219,0.25)",
                  transition: "opacity 0.2s, transform 0.2s",
                }}>
                  Get Started →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .price-grid { grid-template-columns: 1fr !important; max-width: 420px; margin: 0 auto; } }
      `}</style>
    </section>
  );
}

/* ─── TESTIMONIALS ─────────────────────────────────────────── */
const TESTIMONIALS = [
  { name: "Dr. Sarah Kim", role: "Luxe Dental Studio", text: "Our new site went live and within 6 weeks we had to hire another receptionist. The leads didn't stop coming.", rating: 5 },
  { name: "Marcus J.",     role: "Prime Fitness Co.", text: "AFXoRBIT completely transformed our online presence. Membership signups tripled in the first 2 months. Incredible ROI.", rating: 5 },
  { name: "Elena V.",      role: "Urban Law Group",   text: "Finally a website that actually brings in consultations. Professional, fast, and the results speak for themselves.", rating: 5 },
];

function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{ background: "var(--surface)", padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="testi-grid">

          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="s-label" style={{ marginBottom: "1rem", display: "inline-flex" }}>Testimonials</span>
            <h2 className="t-display" style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 0.95, color: "var(--ink)", marginTop: "0.7rem", marginBottom: "2rem" }}>
              WHAT OUR<br />
              <span style={{ color: "var(--blue)" }}>CLIENTS SAY</span>
            </h2>
            {/* Dots */}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 28 : 8, height: 8, borderRadius: 4, background: i === active ? "var(--blue)" : "var(--border-2)", border: "none", cursor: "none", transition: "all 0.35s" }} />
              ))}
            </div>
          </motion.div>

          {/* Right — card */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="card"
                style={{ padding: "2.5rem", position: "relative" }}>
                {/* Quote mark */}
                <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontSize: "5rem", lineHeight: 1, color: "var(--blue-lt2)", fontFamily: "Georgia, serif", userSelect: "none" }}>"</div>

                <div style={{ display: "flex", gap: "0.22rem", marginBottom: "1.4rem" }}>
                  {[...Array(TESTIMONIALS[active].rating)].map((_, j) => <span key={j} style={{ color: "#F59E0B", fontSize: "0.9rem" }}>★</span>)}
                </div>
                <p className="t-serif" style={{ color: "var(--ink-2)", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: "1.6rem", fontStyle: "italic" }}>
                  "{TESTIMONIALS[active].text}"
                </p>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.1rem", display: "flex", alignItems: "center", gap: "0.9rem" }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, var(--blue), var(--blue-3))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.85rem" }}>{TESTIMONIALS[active].name[0]}</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--ink)" }}>{TESTIMONIALS[active].name}</p>
                    <p style={{ fontSize: "0.7rem", color: "var(--blue)", fontWeight: 600 }}>{TESTIMONIALS[active].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .testi-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }
      `}</style>
    </section>
  );
}

/* ─── CTA ───────────────────────────────────────────────────── */
function CTA() {
  return (
    <section id="contact" style={{ background: "var(--page)", padding: "8rem 2rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: "linear-gradient(145deg, var(--blue) 0%, #1338BE 100%)", borderRadius: 24, padding: "5rem 3.5rem", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "0 40px 100px rgba(26,86,219,0.3)" }}>

          {/* Orbs */}
          <div style={{ position: "absolute", top: -70, right: -70, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -50, left: -50, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          {/* Grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", borderRadius: 24 }} />

          <div style={{ position: "relative" }}>
            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 1rem", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, marginBottom: "1.8rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "pulse 2s ease infinite" }} />
              <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.8)" }}>Limited spots available</span>
            </div>

            <h2 className="t-display" style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", lineHeight: 0.9, color: "#fff", marginBottom: "1.2rem" }}>
              LET'S BUILD<br />SOMETHING<br />EXTRAORDINARY
            </h2>
            <p style={{ color: "rgba(255,255,255,0.68)", maxWidth: 480, margin: "0 auto 2.5rem", lineHeight: 1.85, fontSize: "0.97rem" }}>
              Book a free 30-minute discovery call. We'll map out exactly how to turn your website into your #1 lead generator.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button style={{ padding: "1rem 2.4rem", background: "#fff", color: "var(--blue)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", fontWeight: 700, letterSpacing: "0.04em", border: "none", borderRadius: 6, cursor: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.14)", transition: "transform 0.2s" }}>
                Book Free Call →
              </button>
              <button style={{ padding: "1rem 2.4rem", background: "transparent", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", fontWeight: 700, letterSpacing: "0.04em", border: "1.5px solid rgba(255,255,255,0.32)", borderRadius: 6, cursor: "none" }}>
                View Portfolio
              </button>
            </div>

            {/* Trust row */}
            <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2.5rem", flexWrap: "wrap" }}>
              {["No commitment required","Response within 24 hours","100% free consultation"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem" }}>✓</span>
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── ROOT ──────────────────────────────────────────────────── */
export default function HomeContent() {
  return (
    <>
      <GlobalStyles />
      <Cursor />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Work />
      <Process />
      <Pricing />
      <Testimonials />
      <CTA />
    </>
  );
}