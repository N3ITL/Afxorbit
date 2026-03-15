'use client';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────
   Styles
───────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    :root {
      --blue:        #1d8cf8;
      --blue-bright: #45a8ff;
      --deep:        #ffffff;
      --navy:        #f6f9ff;
      --panel:       #eef4ff;
      --border:      rgba(29,140,248,0.14);
      --border-hot:  rgba(29,140,248,0.45);
      --silver:      #334155;
      --offwhite:    #1e293b;
      --white:       #0f172a;
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

    /* cursor */
    #faq-dot {
      position: fixed; top:0; left:0;
      width:10px; height:10px;
      background: var(--blue-bright);
      border-radius:50%;
      pointer-events:none; z-index:9999;
      mix-blend-mode: screen;
    }
    #faq-ring {
      position:fixed; top:0; left:0;
      width:36px; height:36px;
      border:1px solid rgba(69,168,255,0.4);
      border-radius:50%;
      pointer-events:none; z-index:9998;
      transition: transform 0.12s ease;
    }

    ::-webkit-scrollbar { width:2px; }
    ::-webkit-scrollbar-track { background: var(--deep); }
    ::-webkit-scrollbar-thumb { background: var(--blue); }

    .fd { font-family:'Bebas Neue',sans-serif; letter-spacing:0.06em; }
    .fi { font-family:'Instrument Serif',serif; }

    .bt {
      background: linear-gradient(120deg,#1d8cf8 0%,#8dcfff 50%,#1d8cf8 100%);
      -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    }

    /* noise */
    body::after {
      content:''; position:fixed; inset:0;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
      pointer-events:none; z-index:9990; opacity:0.5;
    }

    .rule { height:1px; background:linear-gradient(90deg,transparent,rgba(29,140,248,0.4),transparent); }

    @keyframes glow {
      0%,100% { opacity:0.45; transform:scale(1); }
      50%      { opacity:1;    transform:scale(1.05); }
    }
    @keyframes scanline {
      0%   { transform:translateY(-100%); }
      100% { transform:translateY(100vh); }
    }
    @keyframes shimmer {
      0%   { background-position:-200% center; }
      100% { background-position: 200% center; }
    }
    .shimmer-btn {
      background: linear-gradient(90deg,var(--blue) 0%,var(--blue-bright) 35%,var(--blue) 65%,var(--blue-bright) 100%);
      background-size:250% auto;
      animation:shimmer 3.5s linear infinite;
    }

    @media (max-width:768px) {
      .faq-layout { grid-template-columns: 1fr !important; }
      .faq-sticky { position: static !important; }
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
    const mv = e => {
      if (dot.current)  dot.current.style.transform  = `translate(${e.clientX-5}px,${e.clientY-5}px)`;
      if (ring.current) ring.current.style.transform = `translate(${e.clientX-18}px,${e.clientY-18}px)`;
    };
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, []);
  return (
    <>
      <div id="faq-dot"  ref={dot}  />
      <div id="faq-ring" ref={ring} />
    </>
  );
}

/* ─────────────────────────────────────
   Data
───────────────────────────────────── */
const faqs = [
  {
    q: "How long does a website project take?",
    a: "Most business websites are completed within 2 to 7 days depending on project scope and how quickly content and feedback are provided.",
    tag: "Timeline",
  },
  {
    q: "How much does a website cost?",
    a: "Website pricing depends on the features, design complexity, and functionality required. Each project is quoted individually based on your specific business needs.",
    tag: "Pricing",
  },
  {
    q: "Do you provide SEO services?",
    a: "Yes. AFXoRBIT offers on-page SEO, technical SEO, and local optimization strategies designed to improve search visibility and attract targeted, qualified traffic.",
    tag: "SEO",
  },
  {
    q: "Will my website be mobile-friendly?",
    a: "Yes. Every website we build is fully responsive and pixel-perfect on mobile devices, tablets, and desktops.",
    tag: "Design",
  },
  {
    q: "Can you redesign my existing website?",
    a: "Yes. We can redesign and rebuild existing websites to improve design quality, performance, SEO structure, and overall user experience.",
    tag: "Redesign",
  },
  {
    q: "Do you offer support after launch?",
    a: "Yes. We offer optional maintenance and optimization retainers to keep your website secure, updated, and performing at its best.",
    tag: "Support",
  },
  {
    q: "Do you build e-commerce websites?",
    a: "Yes. We develop conversion-focused e-commerce platforms with secure payment systems, fast load times, and an optimized buying experience.",
    tag: "E-commerce",
  },
  {
    q: "How do I start a project with AFXoRBIT?",
    a: "Simply reach out through our website or email contact@afxorbit.com. We'll discuss your project requirements and get you a clear plan and quote.",
    tag: "Get Started",
  },
];

/* ─────────────────────────────────────
   Hero
───────────────────────────────────── */
function Hero() {
  return (
    <section style={{ minHeight: "52vh", display: "flex", alignItems: "flex-end", position: "relative", overflow: "hidden", background: "var(--deep)", padding: "0 2rem 5rem" }}>
      {/* bg effects */}
      <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(29,140,248,0.09) 0%,transparent 65%)", animation: "glow 6s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(29,140,248,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(29,140,248,0.03) 1px,transparent 1px)", backgroundSize: "70px 70px", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left:0, right:0, height:"2px", background:"linear-gradient(90deg,transparent,rgba(29,140,248,0.15),transparent)", animation:"scanline 7s linear infinite", pointerEvents:"none" }} />
      <div style={{ position: "absolute", bottom:0, left:0, right:0, height:140, background:"linear-gradient(to top,var(--deep),transparent)", pointerEvents:"none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative" }}>
        {/* label */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.2, ease:[0.16,1,0.3,1] }}
          style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.8rem" }}>
          <div style={{ width:28, height:1, background:"var(--blue)" }} />
          <span style={{ fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.35em", textTransform:"uppercase", color:"var(--blue)" }}>FAQ</span>
        </motion.div>

        {/* headline */}
        {["FREQUENTLY", "ASKED", <span key="q" className="bt">QUESTIONS.</span>].map((word, i) => (
          <div key={i} style={{ overflow:"hidden" }}>
            <motion.div initial={{ y:130 }} animate={{ y:0 }} transition={{ duration:1.05, delay:0.3 + i*0.11, ease:[0.16,1,0.3,1] }}
              className="fd" style={{ fontSize:"clamp(4rem,12vw,11rem)", lineHeight:0.9, color:"var(--white)", marginBottom:"0.06em" }}>
              {word}
            </motion.div>
          </div>
        ))}

        {/* sub */}
        <motion.p initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.85, ease:[0.16,1,0.3,1] }}
          style={{ marginTop:"2rem", maxWidth:480, fontSize:"1rem", lineHeight:1.8, color:"var(--silver)", fontWeight:300 }}>
          Common questions about our process, timelines, pricing, and support — answered clearly.
        </motion.p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   Accordion item
───────────────────────────────────── */
function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity:0, y:28 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:0.15 }}
      transition={{ duration:0.65, delay:index*0.06, ease:[0.16,1,0.3,1] }}
      style={{
        border: `1px solid ${isOpen ? "var(--border-hot)" : "var(--border)"}`,
        borderRadius: 8,
        overflow: "hidden",
        background: isOpen ? "rgba(29,140,248,0.04)" : "var(--panel)",
        transition: "border-color 0.35s, background 0.35s",
      }}
    >
      {/* Top blue line when open */}
      <div style={{ height:2, background:"linear-gradient(90deg,transparent,var(--blue),transparent)", opacity: isOpen ? 1 : 0, transition:"opacity 0.35s" }} />

      {/* Question row */}
      <button
        onClick={onToggle}
        style={{ width:"100%", padding:"1.8rem 2rem", display:"flex", alignItems:"center", gap:"1.2rem", background:"none", border:"none", cursor:"none", textAlign:"left" }}
      >
        {/* Index number */}
        <span className="fd" style={{ fontSize:"1.4rem", lineHeight:1, color: isOpen ? "var(--blue)" : "rgba(29,140,248,0.25)", flexShrink:0, transition:"color 0.3s", minWidth:36 }}>
          {String(index + 1).padStart(2,"0")}
        </span>

        {/* Question text */}
        <span style={{ flex:1, fontSize:"1.05rem", fontWeight:600, color: isOpen ? "var(--white)" : "var(--offwhite)", lineHeight:1.35, transition:"color 0.3s" }}>
          {item.q}
        </span>

        {/* Tag pill */}
        <span style={{ fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"var(--blue)", border:"1px solid rgba(29,140,248,0.25)", borderRadius:100, padding:"0.25rem 0.7rem", flexShrink:0, display:"none" }} className="faq-tag">
          {item.tag}
        </span>

        {/* Toggle icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
          style={{ width:28, height:28, border:`1px solid ${isOpen ? "var(--blue)" : "rgba(29,140,248,0.25)"}`, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"border-color 0.3s" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="5" y1="0" x2="5" y2="10" stroke="var(--blue)" strokeWidth="1.5"/>
            <line x1="0" y1="5" x2="10" y2="5" stroke="var(--blue)" strokeWidth="1.5"/>
          </svg>
        </motion.div>
      </button>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height:0, opacity:0 }}
            animate={{ height:"auto", opacity:1 }}
            exit={{ height:0, opacity:0 }}
            transition={{ duration:0.4, ease:[0.16,1,0.3,1] }}
            style={{ overflow:"hidden" }}
          >
            <div style={{ padding:"0 2rem 2rem 4.8rem" }}>
              <div style={{ width:40, height:1, background:"rgba(29,140,248,0.3)", marginBottom:"1.2rem" }} />
              <p style={{ fontSize:"0.95rem", lineHeight:1.85, color:"var(--silver)", fontWeight:300 }}>
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────
   FAQ Section
───────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  const tags = [...new Set(faqs.map(f => f.tag))];
  const [activeTag, setActiveTag] = useState(null);
  const filtered = activeTag ? faqs.filter(f => f.tag === activeTag) : faqs;

  return (
    <section style={{ background:"var(--deep)", padding:"5rem 2rem 8rem" }}>
      <div className="rule" style={{ marginBottom:"5rem" }} />
      <div style={{ maxWidth:1200, margin:"0 auto" }}>

        {/* Tag filter */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.7 }}
          style={{ display:"flex", gap:"0.6rem", flexWrap:"wrap", marginBottom:"3.5rem" }}
        >
          <button
            onClick={() => setActiveTag(null)}
            style={{ padding:"0.45rem 1.1rem", borderRadius:100, fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", border:`1px solid ${!activeTag ? "var(--blue)" : "rgba(29,140,248,0.2)"}`, background: !activeTag ? "rgba(29,140,248,0.12)" : "transparent", color: !activeTag ? "var(--blue)" : "var(--silver)", cursor:"none", transition:"all 0.25s" }}
          >
            All
          </button>
          {tags.map(tag => (
            <button key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              style={{ padding:"0.45rem 1.1rem", borderRadius:100, fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", border:`1px solid ${activeTag===tag ? "var(--blue)" : "rgba(29,140,248,0.2)"}`, background: activeTag===tag ? "rgba(29,140,248,0.12)" : "transparent", color: activeTag===tag ? "var(--blue)" : "var(--silver)", cursor:"none", transition:"all 0.25s" }}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Layout: FAQ list + sticky sidebar */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"4rem", alignItems:"start" }} className="faq-layout">

          {/* Accordion list */}
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <AnimatePresence mode="wait">
              {filtered.map((item, i) => (
                <FAQItem
                  key={item.q}
                  item={item}
                  index={faqs.indexOf(item)}
                  isOpen={openIndex === faqs.indexOf(item)}
                  onToggle={() => toggle(faqs.indexOf(item))}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Sticky sidebar */}
          <div className="faq-sticky" style={{ position:"sticky", top:"7rem" }}>
            <motion.div
              initial={{ opacity:0, x:30 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, amount:0.3 }}
              transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
            >
              {/* Stats box */}
              <div style={{ border:"1px solid var(--border)", borderRadius:8, background:"var(--panel)", padding:"2rem", marginBottom:"1.5rem", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:"1.5rem", right:"1.5rem", height:2, background:"linear-gradient(90deg,transparent,var(--blue),transparent)" }} />
                <p style={{ fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--blue)", marginBottom:"1.5rem" }}>Quick Facts</p>
                {[["2–7", "Days avg. delivery"], ["50+", "Projects delivered"], ["24/7", "AI-powered support"]].map(([n, l]) => (
                  <div key={l} style={{ marginBottom:"1.2rem", paddingBottom:"1.2rem", borderBottom:"1px solid rgba(29,140,248,0.08)" }}>
                    <div className="fd" style={{ fontSize:"2.4rem", lineHeight:1, color:"var(--blue)" }}>{n}</div>
                    <div style={{ fontSize:"0.75rem", color:"var(--silver)", marginTop:"0.2rem", fontWeight:500 }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* CTA box */}
              <div style={{ border:"1px solid var(--border)", borderRadius:8, background:"var(--panel)", padding:"2rem", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, width:20, height:20, borderTop:"2px solid var(--blue)", borderLeft:"2px solid var(--blue)" }} />
                <div style={{ position:"absolute", bottom:0, right:0, width:20, height:20, borderBottom:"2px solid var(--blue)", borderRight:"2px solid var(--blue)" }} />
                <p style={{ fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--blue)", marginBottom:"1rem" }}>Still have questions?</p>
                <p style={{ fontSize:"0.9rem", lineHeight:1.7, color:"var(--silver)", fontWeight:300, marginBottom:"1.5rem" }}>
                  We're happy to walk you through anything before you commit.
                </p>
                <a href="mailto:contact@afxorbit.com"
                  style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.6rem", padding:"0.85rem 1rem", borderRadius:4, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--deep)", textDecoration:"none" }}
                  className="shimmer-btn"
                >
                  Email Us
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   Bottom CTA strip
───────────────────────────────────── */
function BottomCTA() {
  return (
    <section style={{ background:"var(--navy)", padding:"5rem 2rem" }}>
      <div className="rule" style={{ marginBottom:"5rem" }} />
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <motion.div
          initial={{ opacity:0, y:30 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, amount:0.3 }}
          transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
          style={{ border:"1px solid rgba(29,140,248,0.2)", borderRadius:12, padding:"clamp(3rem,6vw,5rem)", textAlign:"center", position:"relative", overflow:"hidden", background:"radial-gradient(ellipse at 50% 120%,rgba(29,140,248,0.08) 0%,transparent 65%)" }}
        >
          {[{t:0,l:0},{t:0,r:0},{b:0,l:0},{b:0,r:0}].map((c,i) => (
            <div key={i} style={{ position:"absolute", width:36, height:36, top:c.t, bottom:c.b, left:c.l, right:c.r,
              borderTop: c.t===0?"2px solid var(--blue)":undefined, borderBottom: c.b===0?"2px solid var(--blue)":undefined,
              borderLeft: c.l===0?"2px solid var(--blue)":undefined, borderRight: c.r===0?"2px solid var(--blue)":undefined }} />
          ))}

          <p style={{ fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.35em", textTransform:"uppercase", color:"var(--blue)", marginBottom:"1.2rem" }}>Ready to start?</p>
          <h2 className="fd" style={{ fontSize:"clamp(2.5rem,7vw,6rem)", lineHeight:0.92, color:"var(--white)", marginBottom:"1.2rem" }}>
            LET'S BUILD YOUR<br /><span className="bt">DIGITAL SYSTEM.</span>
          </h2>
          <p style={{ maxWidth:420, margin:"0 auto 2.5rem", fontSize:"0.95rem", lineHeight:1.8, color:"var(--silver)", fontWeight:300 }}>
            No long contracts, no fluff — just a clear plan and a fast execution.
          </p>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
            <a href="https://afxorbit.com" target="_blank" rel="noopener noreferrer"
              className="shimmer-btn"
              style={{ textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"0.7rem", padding:"1rem 2.2rem", borderRadius:4, fontSize:"0.74rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--deep)" }}>
              Get a Quote
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="mailto:contact@afxorbit.com"
              style={{ textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"0.7rem", padding:"1rem 2.2rem", borderRadius:4, fontSize:"0.74rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--white)", border:"1px solid rgba(255,255,255,0.15)", background:"transparent", transition:"all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="var(--blue)"; e.currentTarget.style.color="var(--blue)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; e.currentTarget.style.color="var(--white)"; }}>
              contact@afxorbit.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────
   Page
───────────────────────────────────── */
export default function FaqPage() {
  return (
    <>
      <Styles />
      <Cursor />
      <main style={{ minHeight:"100vh", background:"var(--deep)" ,marginTop:"100px"}}>
        <Hero />
        <FAQSection />
        <BottomCTA />
      </main>
    </>
  );
}
