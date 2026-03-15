'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const markReady = () => setReady(true);

    if (document.readyState === "complete") {
      requestAnimationFrame(markReady);
    } else {
      window.addEventListener("load", markReady, { once: true });
    }

    const fallback = setTimeout(markReady, 1200);
    return () => {
      window.removeEventListener("load", markReady);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {!ready && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "radial-gradient(circle at 20% 20%, rgba(37,99,235,0.08), transparent 35%), #f8faff",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
              pointerEvents: "none",
            }}
          >
            <div className="preloader-orb">
              <div className="preloader-core" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="preloader-wordmark"
              aria-label="AFXoRBIT loading"
            >
              AFX<span>o</span>RBIT
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ opacity: ready ? 1 : 0.35, transition: "opacity 0.2s ease" }}>
        {children}
      </div>
    </>
  );
}
