import { AnimatePresence, motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

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
    .cur { position: fixed; top: 0; left: 0; pointer-events: none; z-index: 11000; }
    .cur-dot  {
      width: 10px; height: 10px; border-radius: 50%;
      background: #ffffff;
      border: 2px solid #0A0F1E;
      box-shadow: 0 0 0 2px rgba(255,255,255,0.55), 0 3px 10px rgba(10,15,30,0.35);
    }
    .cur-ring {
      width: 38px; height: 38px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.92);
      box-shadow: 0 0 0 1.5px rgba(10,15,30,0.75), inset 0 0 0 1px rgba(10,15,30,0.35);
      transition: transform 0.12s ease;
    }
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
    <div className="cur" style={{ position: "fixed", zIndex: 11000 }}>
      <div ref={dot}  className="cur cur-dot"  style={{ position: "fixed", top: 0, left: 0 }} />
      <div ref={ring} className="cur cur-ring" style={{ position: "fixed", top: 0, left: 0 }} />
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   ANIMATED CANVAS BACKGROUND
   - Flowing mesh of connected particles
   - Mouse-reactive: nodes repel cursor
   - Subtle color breathing (blue hues)
   - Runs on requestAnimationFrame
───────────────────────────────────────────── */
function CanvasBg() {
  const canvasRef = useRef(null);
  const mouse     = useRef({ x: -9999, y: -9999 });
  const raf       = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = 0, H = 0, nodes = [];

    const NODE_COUNT  = 68;
    const CONNECT_DST = 160;
    const REPEL_DST   = 110;
    const REPEL_STR   = 2.2;
    const SPEED       = 0.38;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      // respawn on resize
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r:  1.5 + Math.random() * 2,
        hue: 210 + Math.random() * 30,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      // ── update nodes ──
      nodes.forEach(n => {
        // mouse repel
        const dx = n.x - mouse.current.x;
        const dy = n.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_DST) {
          const force = (REPEL_DST - dist) / REPEL_DST;
          n.vx += (dx / dist) * force * REPEL_STR * 0.04;
          n.vy += (dy / dist) * force * REPEL_STR * 0.04;
        }

        // gentle friction
        n.vx *= 0.985;
        n.vy *= 0.985;
        // subtle sine drift
        n.vx += Math.sin(t + n.phase) * 0.006;
        n.vy += Math.cos(t + n.phase * 1.3) * 0.006;

        n.x += n.vx;
        n.y += n.vy;

        // bounce
        if (n.x < 0)  { n.x = 0;  n.vx *= -1; }
        if (n.x > W)  { n.x = W;  n.vx *= -1; }
        if (n.y < 0)  { n.y = 0;  n.vy *= -1; }
        if (n.y > H)  { n.y = H;  n.vy *= -1; }
      });

      // ── draw edges ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DST) {
            const alpha = (1 - d / CONNECT_DST) * 0.55;
            // gradient edge
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `hsla(${a.hue},80%,58%,${alpha})`);
            grad.addColorStop(1, `hsla(${b.hue},75%,62%,${alpha * 0.5})`);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth   = (1 - d / CONNECT_DST) * 1.2;
            ctx.stroke();
          }
        }
      }

      // ── draw nodes ──
      nodes.forEach((n, i) => {
        const pulse = 0.6 + 0.4 * Math.sin(t * 2 + n.phase);
        // glow
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        glow.addColorStop(0, `hsla(${n.hue},85%,60%,${0.18 * pulse})`);
        glow.addColorStop(1, `hsla(${n.hue},80%,60%,0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        // core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue},90%,62%,${0.75 * pulse})`;
        ctx.fill();
      });

      raf.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        zIndex: 2, pointerEvents: "all",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   MORPHING BLOB ORBS (SVG filter + CSS anim)
───────────────────────────────────────────── */
function MorphBlobs() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
      {/* SVG filter for blob morphing */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="blob-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -7" result="blob" />
          </filter>
        </defs>
      </svg>

      {/* Container with gooey filter */}
      <div style={{ filter: "url(#blob-filter)", position: "absolute", inset: 0 }}>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="blob blob-5" />
      </div>

      <style>{`
        .blob {
          position: absolute;
          border-radius: 50%;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }
        .blob-1 {
          width: 520px; height: 520px;
          background: rgba(37,99,235,0.13);
          top: -12%; left: -8%;
          animation: blob-drift-1 11s infinite alternate ease-in-out;
        }
        .blob-2 {
          width: 400px; height: 420px;
          background: rgba(59,130,246,0.10);
          top: -5%; right: -5%;
          animation: blob-drift-2 14s infinite alternate ease-in-out;
        }
        .blob-3 {
          width: 340px; height: 360px;
          background: rgba(96,165,250,0.09);
          bottom: -8%; left: 30%;
          animation: blob-drift-3 9s infinite alternate ease-in-out;
        }
        .blob-4 {
          width: 260px; height: 280px;
          background: rgba(29,84,219,0.08);
          top: 40%; right: 8%;
          animation: blob-drift-4 12s infinite alternate ease-in-out;
        }
        .blob-5 {
          width: 200px; height: 200px;
          background: rgba(147,197,253,0.10);
          bottom: 10%; left: 6%;
          animation: blob-drift-1 8s infinite alternate-reverse ease-in-out;
        }

        @keyframes blob-drift-1 {
          0%   { transform: translate(0,0)    scale(1);    border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; }
          33%  { transform: translate(30px,-20px) scale(1.06); border-radius: 45% 55% 40% 60% / 60% 40% 55% 45%; }
          66%  { transform: translate(-20px,30px) scale(0.97); border-radius: 55% 45% 60% 40% / 45% 55% 50% 50%; }
          100% { transform: translate(15px,10px)  scale(1.03); border-radius: 40% 60% 50% 50% / 55% 45% 60% 40%; }
        }
        @keyframes blob-drift-2 {
          0%   { transform: translate(0,0)     scale(1);    border-radius: 55% 45% 60% 40% / 40% 60% 45% 55%; }
          50%  { transform: translate(-25px,20px) scale(1.08); border-radius: 40% 60% 45% 55% / 60% 40% 50% 50%; }
          100% { transform: translate(20px,-15px) scale(0.95); border-radius: 60% 40% 55% 45% / 50% 55% 40% 60%; }
        }
        @keyframes blob-drift-3 {
          0%   { transform: translate(0,0)    scale(1);    border-radius: 50% 50% 40% 60% / 60% 40% 55% 45%; }
          100% { transform: translate(-30px,-20px) scale(1.1); border-radius: 60% 40% 55% 45% / 45% 55% 40% 60%; }
        }
        @keyframes blob-drift-4 {
          0%   { transform: translate(0,0)    scale(1);   border-radius: 45% 55% 50% 50% / 55% 45% 60% 40%; }
          100% { transform: translate(-15px,25px) scale(1.06); border-radius: 60% 40% 45% 55% / 40% 60% 55% 45%; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED GRID LINES that scan across
───────────────────────────────────────────── */
function ScanGrid() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
      {/* Static blueprint grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(37,99,235,0.06) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(37,99,235,0.06) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />
      {/* Animated scan line horizontal */}
      <motion.div
        style={{ position: "absolute", left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.35) 30%, rgba(96,165,250,0.5) 50%, rgba(37,99,235,0.35) 70%, transparent 100%)" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      {/* Animated scan line vertical */}
      <motion.div
        style={{ position: "absolute", top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg, transparent 0%, rgba(37,99,235,0.25) 30%, rgba(96,165,250,0.4) 50%, rgba(37,99,235,0.25) 70%, transparent 100%)" }}
        animate={{ left: ["0%", "100%", "0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      {/* Corner accent — top left */}
      <div style={{ position: "absolute", top: 24, left: 24, width: 40, height: 40, borderTop: "2px solid rgba(37,99,235,0.3)", borderLeft: "2px solid rgba(37,99,235,0.3)" }} />
      <div style={{ position: "absolute", bottom: 24, right: 24, width: 40, height: 40, borderBottom: "2px solid rgba(37,99,235,0.3)", borderRight: "2px solid rgba(37,99,235,0.3)" }} />
    </div>
  );
}

/* ── Animated counter ── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = now => {
          const p = Math.min((now - start) / 1400, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Tag pill ── */
function TagPill({ children, delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "0.22rem 0.75rem", borderRadius: 100,
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(37,99,235,0.18)",
        backdropFilter: "blur(8px)",
        fontSize: "0.6rem", fontWeight: 700,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: "#1A56DB", fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
      }}
    >
      {children}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   MAIN HERO
───────────────────────────────────────────── */
function Hero({ onOpenContact }) {
  const words = ["TRUST", "LEADS", "GROWTH"];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % 3), 2800);
    return () => clearInterval(t);
  }, []);

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 60]);

  /* Card spring tilt */
  const mx = useSpring(0, { stiffness: 70, damping: 18 });
  const my = useSpring(0, { stiffness: 70, damping: 18 });
  const rotX = useTransform(my, [-0.5, 0.5], [5, -5]);
  const rotY = useTransform(mx, [-0.5, 0.5], [-6, 6]);

  const onMouseMove = e => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onMouseLeave = () => { mx.set(0); my.set(0); };

  return (
    <section
      ref={sectionRef}
      id="home"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        minHeight: "100svh",
        padding: "7rem 2rem 5rem",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        /* Warm directional gradient base */
        background: "linear-gradient(125deg, #f0f6ff 0%, #e8f0fe 28%, #dbeafe 55%, #eff6ff 78%, #f8faff 100%)",
      }}
    >
      {/* ── BG Layer 1: Morphing gooey blobs ── */}
      <MorphBlobs />

      {/* ── BG Layer 2: Blueprint grid + scan lines ── */}
      <ScanGrid />

      {/* ── BG Layer 3: Interactive particle mesh canvas ── */}
      <CanvasBg />

      {/* ── BG Layer 4: Radial vignette to keep text legible ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 70% at 30% 50%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 55%, transparent 100%)",
      }} />

      {/* ── Content ── */}
      <div style={{ maxWidth: 1320, margin: "0 auto", width: "100%", position: "relative", zIndex: 4 }}>
        <motion.div style={{ y: yContent }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "4rem", alignItems: "center" }}>

            {/* ─── LEFT ─── */}
            <div>
              {/* Top tag row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                style={{ display: "flex", alignItems: "center", gap: "0.55rem", flexWrap: "wrap", marginBottom: "2.2rem" }}
              >
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.3rem 0.9rem 0.3rem 0.55rem",
                  background: "rgba(255,255,255,0.75)", backdropFilter: "blur(10px)",
                  border: "1px solid rgba(34,197,94,0.25)", borderRadius: 100,
                  boxShadow: "0 2px 10px rgba(34,197,94,0.1)",
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.8)", animation: "hp 2s ease infinite" }} />
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#16a34a", fontFamily: "'DM Sans', sans-serif" }}>Available now</span>
                </div>
                <TagPill delay={0.1}>Web Design</TagPill>
                <TagPill delay={0.17}>SEO</TagPill>
                <TagPill delay={0.24}>AI Automation</TagPill>
              </motion.div>

              {/* ── Headline lines (clip reveal) ── */}
              {["WE BUILD", null, "THAT DRIVE"].map((line, i) => (
                <div key={i} style={{ overflow: "hidden" }}>
                  <motion.div
                    className="t-display"
                    initial={{ y: "105%" }} animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontSize: "clamp(3.6rem, 8.8vw, 8.5rem)",
                      lineHeight: 0.88, margin: 0,
                      ...(line === null
                        ? { color: "transparent", WebkitTextStroke: "2px #1A56DB" }
                        : { color: "#0A0F1E" }
                      ),
                    }}
                  >
                    {line === null ? "WEBSITES" : line}
                  </motion.div>
                </div>
              ))}

              {/* Cycling word */}
              <div style={{ height: "clamp(3.6rem, 8.8vw, 8.5rem)", overflow: "hidden" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={idx}
                    className="t-display"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.48, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      fontSize: "clamp(3.6rem, 8.8vw, 8.5rem)",
                      lineHeight: 0.88,
                      background: "linear-gradient(120deg, #1A56DB 0%, #2563EB 45%, #60A5FA 100%)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {words[idx]}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}
                style={{ maxWidth: 490, marginTop: "2rem", color: "#4A5A78", lineHeight: 1.85, fontSize: "1rem", fontWeight: 400, fontFamily: "'DM Sans', sans-serif" }}
              >
                Premium, conversion-focused web design for local businesses that want to look world-class and dominate their market.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.55 }}
                style={{ display: "flex", gap: "0.85rem", marginTop: "2.2rem", flexWrap: "wrap" }}
              >
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={onOpenContact}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.55rem",
                    padding: "0.95rem 2.2rem",
                    background: "linear-gradient(135deg, #1A56DB 0%, #2563EB 55%, #3B82F6 100%)",
                    color: "#fff", border: "none", borderRadius: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.86rem", fontWeight: 700, letterSpacing: "0.04em",
                    boxShadow: "0 8px 32px rgba(26,86,219,0.38), 0 2px 8px rgba(26,86,219,0.22)",
                    cursor: "none",
                  }}
                >
                  Start a Project
                  <motion.svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                    animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </motion.svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.55rem",
                    padding: "0.95rem 2.2rem",
                    background: "rgba(255,255,255,0.72)", backdropFilter: "blur(12px)",
                    color: "#0A0F1E", border: "1.5px solid rgba(10,15,30,0.14)", borderRadius: 8,
                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.86rem", fontWeight: 600, letterSpacing: "0.03em",
                    cursor: "none", boxShadow: "0 2px 12px rgba(10,15,30,0.07)",
                  }}
                >
                  View Our Work
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95, duration: 0.6 }}
                style={{ display: "flex", gap: "2.2rem", marginTop: "2.8rem", paddingTop: "2rem", borderTop: "1px solid rgba(10,15,30,0.08)", flexWrap: "wrap" }}
              >
                {[["50","+","Clients Served"],["3","×","Avg. Lead Growth"],["98","%","Satisfaction"]].map(([n, suf, l]) => (
                  <div key={l}>
                    <p className="t-display" style={{ fontSize: "2.4rem", lineHeight: 1, color: "#1A56DB" }}>
                      <Counter target={Number(n)} suffix={suf} />
                    </p>
                    <p style={{ fontSize: "0.65rem", fontWeight: 600, color: "#94A3B8", letterSpacing: "0.14em", marginTop: "0.22rem", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{l}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ─── RIGHT — 3D card ─── */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="hide-mobile"
              style={{ perspective: 900 }}
            >
              <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}>
                <div style={{
                  background: "rgba(255,255,255,0.82)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  borderRadius: 20,
                  overflow: "hidden",
                  boxShadow: "0 32px 80px rgba(10,15,30,0.16), 0 8px 24px rgba(37,99,235,0.08), inset 0 1px 0 rgba(255,255,255,1)",
                  position: "relative",
                }}>
                  {/* Top gradient bar */}
                  <div style={{ height: 4, background: "linear-gradient(90deg, #1A56DB 0%, #3B82F6 50%, #93C5FD 100%)" }} />

                  {/* Browser chrome */}
                  <div style={{ padding: "0.85rem 1rem", background: "rgba(248,250,255,0.9)", borderBottom: "1px solid rgba(10,15,30,0.07)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                    <div style={{ flex: 1, height: 20, background: "rgba(37,99,235,0.06)", borderRadius: 6, marginLeft: "0.3rem", border: "1px solid rgba(37,99,235,0.1)", display: "flex", alignItems: "center", padding: "0 0.6rem" }}>
                      <div style={{ height: 6, width: "45%", background: "rgba(37,99,235,0.15)", borderRadius: 3 }} />
                    </div>
                  </div>

                  {/* Mock site */}
                  <div style={{ padding: "1.2rem", background: "rgba(255,255,255,0.95)" }}>
                    {/* Nav mock */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(10,15,30,0.06)" }}>
                      <div style={{ height: 9, width: "22%", background: "#1A56DB", borderRadius: 4, opacity: 0.75 }} />
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {[32,26,30,36].map((w,i) => <div key={i} style={{ height: 6, width: w, background: "#EEF3FF", borderRadius: 3 }} />)}
                      </div>
                      <div style={{ height: 24, width: 66, background: "linear-gradient(90deg,#1A56DB,#3B82F6)", borderRadius: 5 }} />
                    </div>

                    {/* Hero block */}
                    <div style={{ background: "linear-gradient(135deg,#EEF5FF,#DBEAFE)", borderRadius: 10, padding: "1.2rem 1rem", marginBottom: "0.9rem", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: -15, right: -15, width: 80, height: 80, borderRadius: "50%", background: "rgba(37,99,235,0.08)" }} />
                      <div style={{ height: 12, width: "65%", background: "#1A56DB", borderRadius: 5, opacity: 0.7, marginBottom: "0.55rem" }} />
                      <div style={{ height: 7, width: "88%", background: "rgba(10,15,30,0.1)", borderRadius: 4, marginBottom: "0.4rem" }} />
                      <div style={{ height: 7, width: "72%", background: "rgba(10,15,30,0.07)", borderRadius: 4, marginBottom: "0.9rem" }} />
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <div style={{ height: 26, width: 76, background: "linear-gradient(90deg,#1A56DB,#3B82F6)", borderRadius: 5 }} />
                        <div style={{ height: 26, width: 66, border: "1.5px solid rgba(37,99,235,0.22)", borderRadius: 5 }} />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      {[["↑ 312%","Organic Traffic"],["↑ 89%","Conversions"],["4.9 ★","Avg. Rating"],["< 2s","Load Time"]].map(([v,l],i) => (
                        <motion.div key={l}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + i * 0.08 }}
                          style={{ background: "#F8FAFF", borderRadius: 8, padding: "0.75rem 0.8rem", border: "1px solid rgba(10,15,30,0.07)" }}
                        >
                          <p style={{ fontSize: "1rem", fontWeight: 800, color: "#1A56DB", fontFamily: "'DM Sans', sans-serif" }}>{v}</p>
                          <p style={{ fontSize: "0.58rem", color: "#94A3B8", fontWeight: 600, marginTop: "0.1rem", fontFamily: "'DM Sans', sans-serif" }}>{l}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Status bar */}
                  <div style={{ padding: "0.65rem 1rem", background: "rgba(248,250,255,0.9)", borderTop: "1px solid rgba(10,15,30,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px rgba(34,197,94,0.7)", animation: "hp 2s ease infinite" }} />
                      <span style={{ fontSize: "0.57rem", fontWeight: 700, color: "#16a34a", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Live</span>
                    </div>
                    <span style={{ fontSize: "0.58rem", color: "#94A3B8", fontFamily: "'DM Sans', sans-serif" }}>afxorbit.com</span>
                  </div>
                </div>
              </motion.div>

              {/* Card shadow glow */}
              <div style={{ position: "absolute", bottom: -24, left: "15%", right: "15%", height: 48, background: "radial-gradient(ellipse, rgba(37,99,235,0.22) 0%, transparent 70%)", filter: "blur(14px)", zIndex: -1, pointerEvents: "none" }} />
            </motion.div>

          </div>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .t-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.01em; }

        @keyframes hp {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.18); }
        }
        @media (max-width: 1024px) {
          .hero-grid   { grid-template-columns: 1fr !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ─── MARQUEE ─────────────────────────────────────────────────── */
const items = [
  { label: "Dental Studio",   icon: "🦷" },
  { label: "Prime Fitness",   icon: "💪" },
  { label: "Urban Law",       icon: "⚖️" },
  { label: "Glow Spa",        icon: "✨" },
  { label: "Luxe Dental",     icon: "🦷" },
  { label: "NorthFit",        icon: "🏋️" },
  { label: "Bella Spa",       icon: "🌸" },
  { label: "The Loft Clinic", icon: "🏥" },
];

function Marquee() {
  const doubled = [...items, ...items, ...items];

  return (
    <div style={{ position: "relative", overflow: "hidden", padding: "0" }}>

      {/* Background — rich blue-ink band */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, #0A0F1E 0%, #0f1a38 40%, #111d3a 60%, #0A0F1E 100%)",
      }} />

      {/* Subtle top & bottom blue glow lines */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.5), rgba(96,165,250,0.4), transparent)", zIndex: 2 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.3), rgba(96,165,250,0.3), transparent)", zIndex: 2 }} />

      {/* Left + right fade masks */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(90deg, #0A0F1E, transparent)", zIndex: 3, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, background: "linear-gradient(-90deg, #0A0F1E, transparent)", zIndex: 3, pointerEvents: "none" }} />

      {/* Track */}
      <div style={{ padding: "1.1rem 0", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-flex",
          gap: "0rem",
          whiteSpace: "nowrap",
          animation: "mq-scroll 32s linear infinite",
        }}>
          {doubled.map((item, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0 2.2rem",
                position: "relative",
              }}
            >
              {/* Divider line */}
              <span style={{
                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                width: 1, height: "55%",
                background: "rgba(37,99,235,0.25)",
              }} />

              {/* Emoji icon */}
              <span style={{ fontSize: "0.75rem", opacity: 0.55 }}>{item.icon}</span>

              {/* Label */}
              <span style={{
                fontSize: "0.62rem",
                fontWeight: 700,
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                fontFamily: "'DM Sans', sans-serif",
                transition: "color 0.2s",
              }}>
                {item.label}
              </span>

              {/* Blue diamond accent */}
              <span style={{
                fontSize: "0.32rem",
                color: "rgba(96,165,250,0.5)",
                letterSpacing: 0,
              }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes mq-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

/* ─── ABOUT ─────────────────────────────────────────────────── */

const POINTS = [
  { icon: "⚡", title: "Conversion-First Design", desc: "Every layout decision is built around turning visitors into paying clients." },
  { icon: "🚀", title: "Live in 3 Days", desc: "Fast turnaround without cutting corners — design, build, and launch at speed." },
  { icon: "📍", title: "Local SEO Dominance", desc: "Built to rank. Your business appears when nearby customers search for you." },
];

/* Animated number card */
function StatCard({ num, label, delay = 0, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: 0.5 }}
      style={{
        background: "#fff",
        border: "1px solid rgba(10,15,30,0.08)",
        borderRadius: 14,
        padding: "1.3rem 1.5rem",
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(10,15,30,0.06)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accent }} />
      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.6rem", lineHeight: 1, color: "#0A0F1E" }}>{num}</p>
      <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#94A3B8", marginTop: "0.3rem", fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
    </motion.div>
  );
}

function About() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const dotY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={sectionRef} id="about" style={{ position: "relative", overflow: "hidden", padding: "9rem 2rem" }}>

      {/* ── Rich layered background ── */}
      {/* Base gradient — warm blue-tinted white */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #f0f6ff 0%, #e8effd 30%, #EEF5FF 55%, #f5f8ff 80%, #ffffff 100%)" }} />

      {/* Diagonal stripe pattern */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.35,
        backgroundImage: "repeating-linear-gradient(135deg, rgba(37,99,235,0.04) 0px, rgba(37,99,235,0.04) 1px, transparent 1px, transparent 60px)",
      }} />

      {/* Large accent circle — top left */}
      <motion.div style={{
        position: "absolute", top: "-20%", left: "-12%",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle at 40% 40%, rgba(37,99,235,0.08) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)",
        pointerEvents: "none", y: bgY,
      }} />

      {/* Accent circle — bottom right */}
      <motion.div style={{
        position: "absolute", bottom: "-15%", right: "-10%",
        width: 550, height: 550, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Floating dots grid */}
      <motion.div style={{ position: "absolute", top: "10%", right: "8%", pointerEvents: "none", y: dotY }}>
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <div key={`${row}-${col}`} style={{
              position: "absolute",
              top: row * 28, left: col * 28,
              width: 3, height: 3, borderRadius: "50%",
              background: `rgba(37,99,235,${0.1 + (row + col) * 0.02})`,
            }} />
          ))
        )}
      </motion.div>

      {/* Corner bracket — bottom left */}
      <div style={{ position: "absolute", bottom: 32, left: 32, width: 36, height: 36, borderBottom: "2px solid rgba(37,99,235,0.2)", borderLeft: "2px solid rgba(37,99,235,0.2)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 32, right: 32, width: 36, height: 36, borderTop: "2px solid rgba(37,99,235,0.15)", borderRight: "2px solid rgba(37,99,235,0.15)", pointerEvents: "none" }} />

      {/* ── Content ── */}
      <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Section label */}
        <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: "0.6rem", animationDelay: "1s", marginBottom: "5rem" }}>
          <div style={{ width: 24, height: 1.5, background: "#2563EB" }} />
          <span style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#2563EB", fontFamily: "'DM Sans', sans-serif" }}>About Us</span>
        </motion.div>

        {/* ── Main grid ── */}
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

          {/* ─ LEFT — Visual column ─ */}
          <div style={{ position: "relative" }}>

            {/* Main feature card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              style={{ position: "relative" }}
            >
              {/* Blue gradient card */}
              <div style={{
                background: "linear-gradient(145deg, #1A56DB 0%, #1338BE 50%, #0f2d9e 100%)",
                borderRadius: 22, padding: "3rem 2.6rem",
                position: "relative", overflow: "hidden",
                boxShadow: "0 40px 90px rgba(26,86,219,0.32), 0 8px 24px rgba(26,86,219,0.2)",
              }}>
                {/* Background texture elements */}
                <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 40px)", borderRadius: 22 }} />

                {/* Ghost wordmark */}
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", color: "rgba(255,255,255,0.07)", lineHeight: 1, marginBottom: "1.6rem", letterSpacing: "0.06em", position: "relative" }}>AFXoRBIT</p>

                <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "1rem", lineHeight: 1.88, fontWeight: 400, position: "relative", fontFamily: "'DM Sans', sans-serif" }}>
                  We build websites that don't just look good — they generate real, measurable revenue for local businesses.
                </p>

                {/* Quote line */}
                <div style={{ margin: "1.6rem 0", paddingLeft: "1rem", borderLeft: "2px solid rgba(255,255,255,0.2)", position: "relative" }}>
                  <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", fontStyle: "italic", lineHeight: 1.7 }}>
                    "Every pixel has a purpose."
                  </p>
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: "0", marginTop: "1.8rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
                  {[["1+","Years"],["50+","Projects"],["100%","Dedicated"]].map(([n,l], i) => (
                    <div key={l} style={{ flex: 1, textAlign: i === 0 ? "left" : "center", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.1)" : "none", paddingLeft: i > 0 ? "1rem" : 0 }}>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", lineHeight: 1, color: "#fff" }}>{n}</p>
                      <p style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.42)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "0.25rem", fontFamily: "'DM Sans', sans-serif" }}>{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating satisfaction badge */}
            <motion.div
              animate={{ y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute", bottom: "-1.6rem", right: "-1.6rem",
                background: "#fff", borderRadius: 16, padding: "1rem 1.5rem",
                boxShadow: "0 16px 40px rgba(10,15,30,0.15), 0 4px 12px rgba(37,99,235,0.1)",
                border: "1px solid rgba(10,15,30,0.07)",
                display: "flex", alignItems: "center", gap: "0.9rem",
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#1A56DB,#3B82F6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "1.1rem" }}>⭐</span>
              </div>
              <div>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", lineHeight: 1, color: "#0A0F1E" }}>98%</p>
                <p style={{ fontSize: "0.58rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'DM Sans', sans-serif" }}>Satisfaction</p>
              </div>
            </motion.div>

            {/* Small floating accent card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
              animate={{ y: [0, -5, 0] }}
              style={{
                position: "absolute", top: "2rem", left: "-2rem",
                background: "linear-gradient(135deg, #EEF5FF, #DBEAFE)",
                borderRadius: 12, padding: "0.8rem 1.1rem",
                border: "1px solid rgba(37,99,235,0.15)",
                boxShadow: "0 8px 24px rgba(37,99,235,0.12)",
                display: "flex", alignItems: "center", gap: "0.6rem", animationDelay: "1s",
              }}
            >
              <span style={{ fontSize: "1rem" }}>🏆</span>
              <div>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0A0F1E", fontFamily: "'DM Sans', sans-serif" }}>Premium Quality</p>
                <p style={{ fontSize: "0.58rem", color: "#2563EB", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>World-class design</p>
              </div>
            </motion.div>
          </div>

          {/* ─ RIGHT — Text column ─ */}
          <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>

            {/* Headline */}
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.6rem, 5vw, 4.8rem)", lineHeight: 0.92, color: "#0A0F1E", marginBottom: "2rem" }}>
              DESIGN THAT<br />
              <span style={{ WebkitTextStroke: "2px #1A56DB", color: "transparent" }}>ACTUALLY</span><br />
              <span style={{ color: "#1A56DB" }}>WORKS</span>
            </h2>

            <p style={{ color: "#384060", lineHeight: 1.9, fontSize: "0.97rem", marginBottom: "1rem", fontFamily: "'DM Sans', sans-serif" }}>
              AFXoRBIT is a premium web design studio focused entirely on local businesses. We combine sharp design with conversion strategy — every pixel has a purpose.
            </p>
            <p style={{ color: "#7A88A8", lineHeight: 1.9, fontSize: "0.92rem", marginBottom: "2.5rem", fontFamily: "'DM Sans', sans-serif" }}>
              From dental clinics to law firms and fitness studios, we've helped local businesses triple their inbound leads within the first 90 days.
            </p>

            {/* Feature points */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
              {POINTS.map((pt, i) => (
                <motion.div
                  key={pt.title}
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "1rem",
                    padding: "1.1rem 1.2rem",
                    background: "#fff",
                    border: "1px solid rgba(10,15,30,0.08)",
                    borderRadius: 12,
                    boxShadow: "0 2px 12px rgba(10,15,30,0.05)",
                    transition: "box-shadow 0.25s, border-color 0.25s, transform 0.2s",
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  whileHover={{ y: -2, boxShadow: "0 8px 28px rgba(37,99,235,0.12)", borderColor: "rgba(37,99,235,0.2)" }}
                >
                  {/* Left accent */}
                  <div style={{ position: "absolute", left: 0, top: "1rem", bottom: "1rem", width: 3, borderRadius: "0 3px 3px 0", background: "linear-gradient(to bottom, #1A56DB, #3B82F6)" }} />

                  {/* Icon bubble */}
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg, #EEF5FF, #DBEAFE)", border: "1px solid rgba(37,99,235,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>
                    {pt.icon}
                  </div>

                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0A0F1E", marginBottom: "0.2rem", fontFamily: "'DM Sans', sans-serif" }}>{pt.title}</p>
                    <p style={{ fontSize: "0.82rem", color: "#7A88A8", lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{pt.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
              <a
                href="#contact"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.95rem 2.2rem",
                  background: "linear-gradient(135deg, #1A56DB, #2563EB)",
                  color: "#fff", textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.04em",
                  borderRadius: 8,
                  boxShadow: "0 8px 28px rgba(26,86,219,0.32)",
                  transition: "box-shadow 0.25s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 14px 40px rgba(26,86,219,0.42)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(26,86,219,0.32)"; e.currentTarget.style.transform = "none"; }}
              >
                Book a Free Call →
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ display: "flex" }}>
                  {["#1A56DB","#2563EB","#3B82F6"].map((c,i) => (
                    <div key={c} style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0, boxShadow: "0 2px 6px rgba(10,15,30,0.15)" }} />
                  ))}
                </div>
                <p style={{ fontSize: "0.78rem", color: "#7A88A8", fontFamily: "'DM Sans', sans-serif" }}>Trusted by <strong style={{ color: "#0A0F1E" }}>50+ businesses</strong></p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 4rem !important; }
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
  {
    name: "Sparkle Cleaning Co.",
    cat: "Home Services · Cleaning",
    result: "+220% bookings",
    accent: "#2563EB",
    image: "/Sparkle Cleaning Co..png",
    timeline: "3 DAYS ",
    scope: "Full website redesign, local SEO setup, booking funnel",
    details: "Built a modern, conversion-first website focused on fast quote requests and trust-building service pages.",
    outcomes: ["+220% booking requests", "42% lower bounce rate", "Top 3 local ranking for core keywords"],
  },
  {
    name: "RapidFlow Plumbing",
    cat: "Home Services · Plumbing",
    result: "+310% service calls",
    accent: "#1A56DB",
    image: "/RapidFlow Plumbing.png",
    timeline: "2 DAYS",
    scope: "Lead-gen landing pages, emergency call flow, speed optimization",
    details: "We designed clear emergency CTAs and mobile-first contact flows to convert high-intent traffic quickly.",
    outcomes: ["+310% service calls", "2.1s average page load", "63% increase in mobile conversions"],
  },
  {
    name: "Outdoor Landscaping",
    cat: "Outdoor · Landscaping",
    result: "+240% appointments",
    accent: "#3B82F6",
    image: "/Outdoor · Landscaping.png",
    timeline: "3 DAYS",
    scope: "Portfolio showcase, seasonal service pages, appointment forms",
    details: "Created a visual-first site that highlights project quality while driving quote requests from local homeowners.",
    outcomes: ["+240% appointments", "3x more quote form submissions", "61% increase in time on site"],
  },
  {
    name: "Elite HVAC Solutions",
    cat: "Home Services · HVAC",
    result: "+260% service requests",
    accent: "#1D4ED8",
    image: "/Elite HVAC Solutions.png",
    timeline: "3 DAYS",
    scope: "Service architecture, maintenance plan pages, trust and review UX",
    details: "Repositioned the brand with a premium design and clearer service structure for residential and commercial leads.",
    outcomes: ["+260% service requests", "48% increase in returning visitors", "Higher close-rate from web leads"],
  },
];

function Work() {
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    if (!activeProject) return;
    const onEsc = (e) => {
      if (e.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [activeProject]);

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
              className="card"
              onClick={() => setActiveProject(p)}
              style={{ overflow: "hidden", cursor: "none" }}>

              <div style={{ height: 200, position: "relative", borderBottom: "1px solid var(--border)", overflow: "hidden", background: "var(--surface-2)" }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{ position: "absolute", top: "0.7rem", right: "0.7rem", background: "var(--ink)", color: "#fff", padding: "0.22rem 0.65rem", borderRadius: 20, fontSize: "0.57rem", fontWeight: 700, letterSpacing: "0.12em" }}>LIVE</div>
              </div>

              <div style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--blue)", marginBottom: "0.35rem" }}>{p.cat}</p>
                <p style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--ink)", marginBottom: "0.8rem" }}>{p.name}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "var(--blue-lt)", border: "1px solid var(--blue-lt2)", borderRadius: 100, padding: "0.28rem 0.8rem" }}>
                  <span style={{ color: "#22c55e", fontSize: "0.6rem" }}>▲</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--blue)" }}>{p.result}</span>
                </div>
                <p style={{ marginTop: "0.8rem", fontSize: "0.7rem", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Click to view full case study
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProject(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(3,5,15,0.75)",
              backdropFilter: "blur(4px)",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.2rem",
            }}
          >
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(980px, 100%)",
                maxHeight: "90vh",
                overflowY: "auto",
                background: "var(--surface)",
                borderRadius: 14,
                border: "1px solid var(--border)",
                boxShadow: "0 28px 80px rgba(10,15,30,0.38)",
              }}
            >
              <div style={{ padding: "1rem 1rem 0.4rem", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setActiveProject(null)}
                  style={{
                    border: "1px solid var(--border-2)",
                    background: "var(--surface-2)",
                    color: "var(--ink)",
                    borderRadius: 8,
                    padding: "0.35rem 0.7rem",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    cursor: "none",
                  }}
                >
                  Close
                </button>
              </div>

              <div style={{ padding: "0 1rem 1rem" }}>
                <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", marginBottom: "1.2rem" }}>
                  <img
                    src={activeProject.image}
                    alt={activeProject.name}
                    style={{ width: "100%", maxHeight: "420px", objectFit: "cover", display: "block" }}
                  />
                </div>

                <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: activeProject.accent, marginBottom: "0.5rem" }}>
                  {activeProject.cat}
                </p>
                <h3 className="t-display" style={{ fontSize: "clamp(2rem, 4.2vw, 3.4rem)", lineHeight: 0.95, color: "var(--ink)", marginBottom: "1rem" }}>
                  {activeProject.name}
                </h3>
                <p style={{ color: "var(--ink-3)", lineHeight: 1.8, fontSize: "0.94rem", marginBottom: "1rem" }}>
                  {activeProject.details}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1rem" }} className="work-modal-grid">
                  <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.8rem" }}>
                    <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.25rem" }}>
                      Timeline
                    </p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--ink)" }}>{activeProject.timeline}</p>
                  </div>
                  <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.8rem" }}>
                    <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.25rem" }}>
                      Headline Result
                    </p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--blue)" }}>{activeProject.result}</p>
                  </div>
                </div>

                <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "0.9rem", marginBottom: "1rem" }}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.3rem" }}>
                    Project Scope
                  </p>
                  <p style={{ color: "var(--ink-2)", fontSize: "0.88rem", lineHeight: 1.75 }}>
                    {activeProject.scope}
                  </p>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "0.2rem" }}>
                  {activeProject.outcomes.map((item) => (
                    <span key={item} style={{ background: "var(--blue-lt)", border: "1px solid var(--blue-lt2)", borderRadius: 100, padding: "0.35rem 0.75rem", fontSize: "0.75rem", fontWeight: 700, color: "var(--blue)" }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 680px) { .work-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 680px) { .work-modal-grid { grid-template-columns: 1fr !important; } }
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
function CTA({ onOpenContact }) {
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
              <button onClick={onOpenContact} style={{ padding: "1rem 2.4rem", background: "#fff", color: "var(--blue)", fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", fontWeight: 700, letterSpacing: "0.04em", border: "none", borderRadius: 6, cursor: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.14)", transition: "transform 0.2s" }}>
                Book Free Call →
              </button>
              <button onClick={onOpenContact} style={{ padding: "1rem 2.4rem", background: "transparent", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", fontWeight: 700, letterSpacing: "0.04em", border: "1.5px solid rgba(255,255,255,0.32)", borderRadius: 6, cursor: "none" }}>
                Contact Us
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
function ContactFormModal({ open, onClose }) {
  const [result, setResult] = useState("");
  const closeTimerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);
    formData.append("access_key", "f1600954-2b28-4513-b7f7-f20990ffeff0");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setResult("We received your information. This popup will close in 3 seconds.");
        event.target.reset();
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        closeTimerRef.current = setTimeout(() => {
          setResult("");
          onClose();
        }, 3000);
      } else {
        setResult("Could not submit. Please try again.");
      }
    } catch {
      setResult("Network error. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(3,5,15,0.74)",
            backdropFilter: "blur(5px)",
            zIndex: 10500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(620px, 100%)",
              borderRadius: 16,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              boxShadow: "0 30px 80px rgba(10,15,30,0.36)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "1.2rem 1.25rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--blue)" }}>Get In Touch</p>
                <h3 className="t-display" style={{ fontSize: "2.1rem", lineHeight: 0.9, color: "var(--ink)", marginTop: "0.25rem" }}>START YOUR PROJECT</h3>
              </div>
              <button onClick={onClose} style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--ink)", borderRadius: 8, padding: "0.35rem 0.7rem", fontSize: "0.72rem", fontWeight: 700, cursor: "none" }}>
                Close
              </button>
            </div>

            <form onSubmit={onSubmit} style={{ padding: "1.25rem", display: "grid", gap: "0.85rem" }}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--ink)", borderRadius: 10, padding: "0.85rem 0.95rem", fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--ink)", borderRadius: 10, padding: "0.85rem 0.95rem", fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
              />
              <input
                type="text"
                name="subject"
                placeholder="Project Type (optional)"
                style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--ink)", borderRadius: 10, padding: "0.85rem 0.95rem", fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif", outline: "none" }}
              />
              <textarea
                name="message"
                placeholder="Tell us about your project..."
                required
                rows={5}
                style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--ink)", borderRadius: 10, padding: "0.85rem 0.95rem", fontSize: "0.92rem", fontFamily: "'DM Sans', sans-serif", outline: "none", resize: "vertical" }}
              />
              <button
                type="submit"
                style={{ marginTop: "0.2rem", padding: "0.9rem 1.2rem", border: "none", borderRadius: 9, background: "linear-gradient(135deg, var(--blue), var(--blue-3))", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.06em", cursor: "none" }}
              >
                Send Message →
              </button>
              {result && <span style={{ fontSize: "0.8rem", color: "var(--ink-3)", fontWeight: 600 }}>{result}</span>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HomeContent() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <GlobalStyles />
      <Cursor />
      <Hero onOpenContact={() => setContactOpen(true)} />
      <Marquee />
      <About />
      <Services />
      <Work />
      <Process />
      <Pricing />
      <Testimonials />
      <CTA onOpenContact={() => setContactOpen(true)} />
      <ContactFormModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
