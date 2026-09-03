import { useRef, useMemo, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { FolderDown } from "lucide-react";
import { ExtensionMockup } from "./ExtensionMockup";
import "./ScrollJourney.css";

/* -------------------------------------------------------
   LOGO INTRO — recreates the animate logo.html animation
   using inline SVG + CSS animation driven by requestAnimationFrame
------------------------------------------------------- */
function LogoIntroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 320;
    const H = 320;
    canvas.width = W;
    canvas.height = H;

    const FPS = 30;
    const DURATION = 2; // 2 seconds
    const TOTAL_FRAMES = FPS * DURATION;

    function ease(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function easeOutBack(x: number) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    function drawFrame(frameIndex: number) {
      if (!ctx) return;
      const progress = (frameIndex % TOTAL_FRAMES) / TOTAL_FRAMES;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "rgba(10,10,10,0)";
      ctx.fillRect(0, 0, W, H);

      // Compute transforms matching the SVG animation
      let groupRot = 0;
      let l_tx = 0, l_ty = 0, l_sx = 1, l_sy = 1;
      let r_tx = 0, r_ty = 0, r_sx = 1, r_sy = 1;
      const m_tx = 0;
      let m_ty = 0, m_sx = 1, m_sy = 1, m_op = 1;
      let txt_op = 0, txt_s = 0.5, txt_y = 10;

      if (progress < 0.15) {
        // Phase 1: Float
        const float = Math.sin((progress * Math.PI * 2) / 0.15) * 2;
        l_ty = float; r_ty = float; m_ty = float;
      } else if (progress < 0.3) {
        // Phase 2: Spin & Merge into colorful beam
        const p = (progress - 0.15) / 0.15;
        const e = ease(p);
        groupRot = 90 * e;
        l_sy = r_sy = m_sy = 1 + 3 * e;
        l_sx = r_sx = m_sx = 1 - 0.5 * e;
        l_tx = 22.5 * e;
        r_tx = -22.5 * e;
      } else if (progress < 0.45) {
        // Phase 3: Burst open and Reveal Text
        const p = (progress - 0.3) / 0.15;
        const e = easeOutBack(p);
        groupRot = 90;
        l_sy = r_sy = 4; m_sy = 4 + 2 * e;
        l_sx = r_sx = 0.5; m_sx = 0.5 + 2 * e;
        l_tx = 22.5 - (50 * e);
        r_tx = -22.5 + (50 * e);
        m_op = 1 - p;
        txt_op = p;
        txt_s = 0.7 + 0.3 * e;
        txt_y = 10 * (1 - e);
      } else if (progress < 0.7) {
        // Phase 4: Hold and Pulse
        const p = (progress - 0.45) / 0.25;
        groupRot = 90;
        l_sy = r_sy = 4; l_sx = r_sx = 0.5;
        l_tx = -27.5 + Math.sin(p * Math.PI * 2) * 2;
        r_tx = 27.5 - Math.sin(p * Math.PI * 2) * 2;
        m_op = 0;
        txt_op = 1; txt_s = 1; txt_y = 0;
      } else if (progress < 0.85) {
        // Phase 5: Snap back into beam
        const p = (progress - 0.7) / 0.15;
        const e = ease(p);
        groupRot = 90;
        l_sy = r_sy = 4; l_sx = r_sx = 0.5;
        m_sy = 6 - 2 * e; m_sx = 2.5 - 2 * e;
        l_tx = -27.5 + (50 * e);
        r_tx = 27.5 - (50 * e);
        m_op = e;
        txt_op = 1 - e;
        txt_s = 1 - 0.2 * e;
        txt_y = -10 * e;
      } else {
        // Phase 6: Unspin back to logo
        const p = (progress - 0.85) / 0.15;
        const e = ease(p);
        groupRot = 90 * (1 - e);
        l_sy = r_sy = m_sy = 4 - 3 * e;
        l_sx = r_sx = m_sx = 0.5 + 0.5 * e;
        l_tx = 22.5 * (1 - e);
        r_tx = -22.5 * (1 - e);
      }

      // Scale canvas coords from 100-unit viewBox to 320px
      const S = W / 100;
      ctx.save();

      // Ambient glow
      const glow_op = txt_op * 0.2;
      if (glow_op > 0.01) {
        const gr = ctx.createRadialGradient(
          50 * S,
          50 * S,
          0,
          50 * S,
          50 * S,
          30 * S
        );
        gr.addColorStop(0, `rgba(229, 77, 0, ${glow_op})`);
        gr.addColorStop(1, "transparent");
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, W, H);
      }

      // --- Group rotation around center (50, 50) ---
      ctx.save();
      ctx.translate(50 * S, 50 * S);
      ctx.rotate((groupRot * Math.PI) / 180);
      ctx.translate(-50 * S, -50 * S);

      // Left piece (dark orange) — pivot at (27.5, 52.5)
      ctx.save();
      ctx.translate(27.5 * S, 52.5 * S);
      ctx.translate(l_tx * S, l_ty * S);
      ctx.scale(l_sx, l_sy);
      ctx.translate(-27.5 * S, -52.5 * S);
      ctx.fillStyle = "#E54D00";
      ctx.beginPath();
      ctx.moveTo(20 * S, 30 * S);
      ctx.lineTo(20 * S, 85 * S);
      ctx.lineTo(35 * S, 75 * S);
      ctx.lineTo(35 * S, 20 * S);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Right piece (light orange) — pivot at (72.5, 52.5)
      ctx.save();
      ctx.translate(72.5 * S, 52.5 * S);
      ctx.translate(r_tx * S, r_ty * S);
      ctx.scale(r_sx, r_sy);
      ctx.translate(-72.5 * S, -52.5 * S);
      ctx.fillStyle = "#FF8A00";
      ctx.beginPath();
      ctx.moveTo(65 * S, 30 * S);
      ctx.lineTo(65 * S, 85 * S);
      ctx.lineTo(80 * S, 75 * S);
      ctx.lineTo(80 * S, 20 * S);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Middle white piece — pivot at (50, 45)
      if (m_op > 0.01) {
        ctx.save();
        ctx.globalAlpha = m_op;
        ctx.translate(50 * S, 45 * S);
        ctx.translate(m_tx * S, m_ty * S);
        ctx.scale(m_sx, m_sy);
        ctx.translate(-50 * S, -45 * S);
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.moveTo(35 * S, 45 * S);
        ctx.lineTo(65 * S, 30 * S);
        ctx.lineTo(65 * S, 45 * S);
        ctx.lineTo(35 * S, 60 * S);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.restore(); // end group rotation

      // Text reveal
      if (txt_op > 0.01) {
        ctx.save();
        ctx.globalAlpha = txt_op;
        ctx.translate(50 * S, (50 + txt_y) * S);
        ctx.scale(txt_s, txt_s);
        ctx.translate(-50 * S, -50 * S);

        // "Flow" gradient text
        const tg = ctx.createLinearGradient(30 * S, 0, 70 * S, 0);
        tg.addColorStop(0, "#E54D00");
        tg.addColorStop(0.5, "#FF8A00");
        tg.addColorStop(1, "#FFFFFF");
        ctx.fillStyle = tg;
        ctx.font = `900 ${22 * S}px Outfit, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Flow", 50 * S, 48 * S);

        // "NEXTGEN" subtitle
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = `800 ${10 * S}px 'Plus Jakarta Sans', system-ui, sans-serif`;
        // Render with manual letter spacing
        const letters = "N E X T G E N";
        ctx.fillText(letters, 50 * S, 62 * S);

        ctx.restore();
      }

      ctx.restore();
    }

    function loop() {
      if (frameRef.current >= TOTAL_FRAMES) {
        // Hold the last frame — animation done, do not loop
        drawFrame(TOTAL_FRAMES - 1);
        return;
      }
      drawFrame(frameRef.current);
      frameRef.current++;
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

/* -------------------------------------------------------
   LOGO INTRO OVERLAY — plays automatically on mount,
   then bloom-dissolves into the scroll journey hero
------------------------------------------------------- */
function LogoIntroOverlay() {
  return (
    <motion.div
      className="logo-intro-overlay"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      {/* Orange radial bloom that expands as logo dissolves */}
      <motion.div
        className="logo-bloom-glow"
        initial={{ scale: 1, opacity: 0 }}
        exit={{
          scale: 3.5,
          opacity: [0, 0.8, 0],
          transition: { duration: 0.8, ease: "easeOut" },
        }}
      />
      {/* Existing canvas animation — reused exactly as-is */}
      <motion.div
        className="logo-canvas-wrap"
        exit={{
          scale: 1.2,
          opacity: 0,
          transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        }}
      >
        <LogoIntroCanvas />
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------
   PROMPT DATA — random prompts that get sucked into Flow UI
------------------------------------------------------- */
const PROMPTS = [
  "cyberpunk samurai walking in neon rain",
  "anime girl in cherry blossom forest",
  "futuristic city timelapse at dusk",
  "@character01 epic battle sequence",
  "dragon soaring above mountain peaks",
  "lo-fi study room at midnight",
  "astronaut floating in deep space",
  "style_cinematic.png + underwater world",
  "@hero_v2 stylized action intro",
  "morphing abstract geometry loop",
  "retro 80s synthwave landscape",
  "@villain_03 closeup dramatic look",
];

interface PromptPos {
  text: string;
  x: number;
  y: number;
  delay: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 90, damping: 18 } 
  }
} as const;

/* -------------------------------------------------------
   MAIN SCROLL JOURNEY COMPONENT
------------------------------------------------------- */
export function ScrollJourney() {
  const trackRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth <= 768 : false;
  });
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll progress across the full track
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Spring — tight enough to feel scroll-linked, smooth enough to look good
  const smooth = useSpring(scrollYProgress, { stiffness: 160, damping: 38 });

  // Reset scroll position on refresh
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      // Let the browser manage scroll restoration
    }
    window.scrollTo(0, 0);
  }, []);

  // Logo intro overlay — disabled blocking intro overlay for instant interaction
  const showIntro = false;

  // ---- SCENE TIMELINE (400vh — logo removed, 3 scenes) ----
  // 0.00–0.22  Scene 1: STATIC HERO 1 — hero text visible, Flow UI sits on the right tilt
  // 0.22–0.64  Scene 1.5: Flow UI slides center, flattens out, prompts sucked in
  // 0.64–1.00  Scene 2: Flow UI slides back to the right tilt, Hero 2 Results on left

  // HERO LEFT TEXT — immediately visible on load, fades out as Flow UI moves to center
  const heroLeftX       = useTransform(smooth, [0.22, 0.34], ["0%", "-8%"]);
  const heroLeftOpacity = useTransform(smooth, [0.22, 0.34], [1, 0]);

  // FLOW UI POSITION: Right (75%) -> Center (50%) -> Right (75%)
  // Shifted dynamically relative to static left: 0% in wrapper width
  const flowUIX = useTransform(
    smooth,
    [0.00, 0.22, 0.34, 0.64, 0.76, 1.00],
    isMobile
      ? ["50%", "50%", "50%", "50%", "50%", "50%"]
      : ["70%", "70%", "50%", "50%", "70%", "70%"]
  );

  const flowUIScale = useTransform(
    smooth,
    [0.00, 0.22, 0.34, 0.64, 0.76, 1.00],
    [1, 1, 1.08, 1.08, 0.98, 0.98]
  );

  // 3D Tilt rotation mapping for scroll depth
  const flowUIRotateY = useTransform(
    smooth,
    [0.00, 0.22, 0.34, 0.64, 0.76, 1.00],
    [-10, -10, 0, 0, 10, 10]
  );
  
  const flowUIRotateX = useTransform(
    smooth,
    [0.00, 0.22, 0.34, 0.64, 0.76, 1.00],
    [10, 10, 0, 0, 10, 10]
  );

  // BLACK-HOLE GLOW — visible when prompts are flying in (Scene 1.5)
  const glowOpacity = useTransform(smooth, [0.22, 0.34, 0.58, 0.64], [0, 1, 0.8, 0]);

  // PROMPT PARTICLES — appear in Scene 1.5 only
  const promptsOpacity = useTransform(smooth, [0.22, 0.28, 0.56, 0.62], [0, 1, 1, 0]);

  // RESULTS HERO — slides in from left during Scene 2
  const resultsX       = useTransform(smooth, [0.66, 0.80], ["-8%", "0%"]);
  const resultsOpacity = useTransform(smooth, [0.66, 0.80], [0, 1]);

  // Phase indicator states
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    return smooth.on("change", (v) => {
      if (v < 0.22) setPhase(0);       // Setup (Phase 0)
      else if (v < 0.64) setPhase(1);  // Running / Sucking (Phase 1)
      else setPhase(2);                // Completed (Phase 2)
    });
  }, [smooth]);

  // Randomized prompt positions (stable across renders)
  const promptPositions = useMemo<PromptPos[]>(() => {
    const positions: PromptPos[] = [];
    const safeZone = { cx: 50, cy: 50, rx: 22, ry: 22 }; // % — avoid Flow UI center

    PROMPTS.forEach((text, i) => {
      let x: number, y: number;
      let attempts = 0;
      // Place away from center
      do {
        const angle = (i / PROMPTS.length) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 28 + Math.random() * 18;
        x = 50 + Math.cos(angle) * radius;
        y = 50 + Math.sin(angle) * radius * 0.55;
        attempts++;
      } while (
        Math.abs(x - safeZone.cx) / safeZone.rx < 1 &&
        Math.abs(y - safeZone.cy) / safeZone.ry < 1 &&
        attempts < 20
      );

      positions.push({ text, x, y, delay: i * 0.08 });
    });
    return positions;
  }, []);

  // On mobile, render a simplified static view — no scroll animations, no mockup, no 3D transforms
  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {showIntro && <LogoIntroOverlay key="logo-intro" />}
        </AnimatePresence>
        <div className="scroll-journey scroll-journey-mobile">
          {/* ---- HERO SECTION ---- */}
          <section className="mobile-hero-section">
            <div className="hero-left mobile">
              <div className="hero-ambient-glow" />
              {/* No glass-panel wrapper — clean centered layout */}
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                Chrome Extension · Google Flow
              </div>
              <h1 className="hero-headline">
                <span className="title-row text-light-gradient">You Slept.</span>
                <span className="title-row text-light-gradient">Flow Ran.</span>
                <span className="title-row text-accent-gradient">278 Prompts.</span>
              </h1>
              <p className="hero-subtext">
                Every prompt you run manually is time you&apos;re not creating.
              </p>
              {/* ---- HIDDEN: SOCIAL PROOF UNTIL STORE REVIEWS ACCUMULATE ---- */}
              {/*
              <div className="hero-social-proof">
                <div className="stars-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={s <= 4 ? "var(--accent)" : "none"} stroke={s <= 4 ? "var(--accent)" : "rgba(255,255,255,0.15)"} strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="rating-text">4.8</span>
                <span className="rating-divider">·</span>
                <span className="rating-users">1,000+ users</span>
              </div>
              */}
              <div className="hero-cta-row">
                <a
                  href="https://chromewebstore.google.com/detail/flow-nextgen/jolnapkhihjecpgideikgpkhgfkbeagp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-primary shiny-button-lg"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.9rem 2rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FF6B00, #FF5100)',
                    color: '#fff',
                    textDecoration: 'none',
                    boxShadow: '0 8px 32px rgba(255, 107, 0, 0.35), 0 0 0 1px rgba(255, 107, 0, 0.3)',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Install Extension - Free
                </a>
                <a
                  href="https://chromewebstore.google.com/detail/flow-nextgen/jolnapkhihjecpgideikgpkhgfkbeagp/reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary review-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.7rem 1.2rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    textDecoration: 'none',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Leave a Review
                </a>
              </div>
              {/* Stat strip removed from hero — banned per taste-skill rule 4.7 */}
            </div>
          </section>

          {/* ---- RESULTS SECTION ---- */}
          <section className="mobile-results-section">
            <div className="results-hero static">
              <div className="results-ambient-glow" />
              <div className="results-text-frame glass-panel">
                <div className="results-tag">
                  <span className="results-tag-dot" />
                  Queue Complete · All Downloads Synced
                </div>
                <h2 className="results-headline">
                  <span className="title-row text-light-gradient">Done.</span>
                  <span className="title-row text-success-gradient">While You Slept.</span>
                </h2>
                <p className="results-subtext">
                  278 generations. Zero babysitting. Every file downloaded, sorted,
                  and named. This is what AI automation is supposed to feel like.
                </p>
                <div className="results-stats-grid">
                  <div className="result-stat-card highlight">
                    <span className="result-stat-value green">278</span>
                    <span className="result-stat-label">Assets generated</span>
                  </div>
                  <div className="result-stat-card">
                    <span className="result-stat-value orange">100%</span>
                    <span className="result-stat-label">Queue success</span>
                  </div>
                  <div className="result-stat-card">
                    <span className="result-stat-value">36.2s</span>
                    <span className="result-stat-label">Avg generation</span>
                  </div>
                  <div className="result-stat-card">
                    <span className="result-stat-value">0</span>
                    <span className="result-stat-label">Manual actions</span>
                  </div>
                </div>
                <div className="image-results-showcase">
                  <div className="showcase-header">
                    <span className="folder-label">OUTPUTS (Downloads/Flow-NextGen/)</span>
                  </div>
                  <div className="image-showcase-grid">
                    {[
                      { title: "Samurai", prompt: "cyberpunk samurai in neon Tokyo alley", src: "/result_samurai.jpg" },
                      { title: "Anime", prompt: "anime girl in cherry blossom forest", src: "/result_anime.jpg" },
                      { title: "Cityscape", prompt: "futuristic flying vehicles timelapse", src: "/result_city.jpg" },
                      { title: "Astronaut", prompt: "astronaut in colorful nebula space", src: "/result_space.jpg" }
                    ].map((img, idx) => (
                      <div key={idx} className="image-card glass-card">
                        <img src={img.src} alt={img.title} className="showcase-img" loading="lazy" />
                        <div className="image-card-overlay">
                          <span className="img-title">{img.title}</span>
                          <span className="img-prompt">{img.prompt}</span>
                          <button className="img-dl-btn" title="Download output" style={{ cursor: "pointer" }}>
                            <FolderDown size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ---- LOGO INTRO OVERLAY (fixed, above header) ---- */}
      <AnimatePresence>
        {showIntro && <LogoIntroOverlay key="logo-intro" />}
      </AnimatePresence>

      <div className="scroll-journey" ref={trackRef}>
        <div className="journey-stage">

          {/* ---- HERO LEFT TEXT ---- */}
          <motion.div
            className="hero-left"
            style={{ x: heroLeftX, opacity: heroLeftOpacity, translateY: "-50%" }}
            variants={containerVariants}
            initial="hidden"
            animate={!showIntro ? "visible" : "hidden"}
          >
            {/* Ambient orange volumetric flare background */}
            <div className="hero-ambient-glow" />

            <div 
              className="hero-text-frame glass-panel"
            >
              <motion.div className="hero-eyebrow" variants={itemVariants} style={{ opacity: 1 }}>
                <span className="hero-eyebrow-dot" />
                Chrome Extension · Google Flow
              </motion.div>

              <motion.h1 className="hero-headline" variants={itemVariants}>
                <span className="title-row text-light-gradient">You Slept.</span>
                <span className="title-row text-light-gradient">Flow Ran.</span>
                <span className="title-row text-accent-gradient">278 Prompts.</span>
              </motion.h1>

              <motion.p className="hero-subtext" variants={itemVariants}>
                Every prompt you run manually is time you're not creating.
                <strong> Flow NextGen takes over your entire queue</strong> while you sleep, work, or just live your life.
              </motion.p>

              {/* ---- HIDDEN: SOCIAL PROOF UNTIL STORE REVIEWS ACCUMULATE ---- */}
              {/*
              <motion.div className="hero-social-proof" variants={itemVariants}>
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                  <defs>
                    <linearGradient id="halfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="80%" stopColor="var(--accent)" />
                      <stop offset="80%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="stars-row">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={s <= 4 ? "var(--accent)" : s === 5 ? "url(#halfGrad)" : "none"} stroke={s <= 4 ? "var(--accent)" : "rgba(255,255,255,0.15)"} strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="rating-text">4.8</span>
                <span className="rating-divider">·</span>
                <span className="rating-users">1,000+ users</span>
              </motion.div>
              */}

              <motion.div className="hero-cta-row" variants={itemVariants}>
                <a
                  href="https://chromewebstore.google.com/detail/flow-nextgen/jolnapkhihjecpgideikgpkhgfkbeagp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-primary shiny-button-lg"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.9rem 2rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FF6B00, #FF5100)',
                    color: '#fff',
                    textDecoration: 'none',
                    boxShadow: '0 8px 32px rgba(255, 107, 0, 0.35), 0 0 0 1px rgba(255, 107, 0, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 0, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 107, 0, 0.35), 0 0 0 1px rgba(255, 107, 0, 0.3)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Install Extension - Free
                </a>
                <a
                  href="https://chromewebstore.google.com/detail/flow-nextgen/jolnapkhihjecpgideikgpkhgfkbeagp/reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-secondary review-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.7rem 1.2rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    textDecoration: 'none',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Leave a Review
                </a>
              </motion.div>

            </div>
          </motion.div>

          {/* ---- PROMPT PARTICLES ---- */}
          <motion.div
            className="prompt-particle-field"
            style={{ opacity: promptsOpacity }}
          >
            {promptPositions.map((pos, i) => (
              <PromptChip
                key={i}
                pos={pos}
                scrollProgress={smooth}
              />
            ))}
          </motion.div>

          {/* ---- FLOW UI WRAPPER (GPU horizontal position tracking) ---- */}
          <motion.div
            className="flow-ui-anchor-wrapper"
            style={{
              x: flowUIX,
            }}
          >
            <motion.div
              className="flow-ui-anchor"
              style={{
                translateX: "-50%",
                translateY: "-50%",
                scale: flowUIScale,
                rotateY: flowUIRotateY,
                rotateX: flowUIRotateX,
                transformPerspective: 1400,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Entrance wrapper slides in from offscreen right once overlay finishes */}
              <motion.div
                className="flow-ui-entrance-wrapper"
                initial={{ x: "100vw", opacity: 0 }}
                animate={!showIntro ? { x: 0, opacity: 1 } : { x: "100vw", opacity: 0 }}
                transition={{ type: "spring", stiffness: 70, damping: 17, mass: 1 }}
                style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}
              >
                {/* Black hole glow */}
                <motion.div
                  className="flow-ui-glow"
                  style={{ opacity: glowOpacity }}
                />

                <div className="flow-ui-shell">
                  <ExtensionMockup phase={phase} />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ---- RESULTS HERO (LEFT SIDE) ---- */}
          <motion.div
            className="results-hero"
            style={{ x: resultsX, opacity: resultsOpacity, translateY: "-50%" }}
          >
            {/* Ambient green volumetric flare background */}
            <div className="results-ambient-glow" />

            <div className="results-text-frame glass-panel">
              <div className="results-tag">
                <span className="results-tag-dot" />
                Queue Complete · All Downloads Synced
              </div>

              <h2 className="results-headline">
                <span className="title-row text-light-gradient">Done.</span>
                <span className="title-row text-success-gradient">While You Slept.</span>
              </h2>

              <p className="results-subtext">
                278 generations. Zero babysitting. Every file downloaded, sorted,
                and named. This is what AI automation is supposed to feel like.
              </p>

              <div className="results-stats-grid">
                <div className="result-stat-card highlight">
                  <span className="result-stat-value green">278</span>
                  <span className="result-stat-label">Assets generated</span>
                </div>
                <div className="result-stat-card">
                  <span className="result-stat-value orange">100%</span>
                  <span className="result-stat-label">Queue success</span>
                </div>
                <div className="result-stat-card">
                  <span className="result-stat-value">36.2s</span>
                  <span className="result-stat-label">Avg generation</span>
                </div>
                <div className="result-stat-card">
                  <span className="result-stat-value">0</span>
                  <span className="result-stat-label">Manual actions</span>
                </div>
              </div>

              {/* AI Image Grid Outputs Folder display */}
              <div className="image-results-showcase">
                <div className="showcase-header">
                  <span className="folder-label">OUTPUTS (Downloads/Flow-NextGen/)</span>

                </div>
                <div className="image-showcase-grid">
                  {[
                    { title: "Samurai", prompt: "cyberpunk samurai in neon Tokyo alley", src: "/result_samurai.jpg" },
                    { title: "Anime", prompt: "anime girl in cherry blossom forest", src: "/result_anime.jpg" },
                    { title: "Cityscape", prompt: "futuristic flying vehicles timelapse", src: "/result_city.jpg" },
                    { title: "Astronaut", prompt: "astronaut in colorful nebula space", src: "/result_space.jpg" }
                  ].map((img, idx) => (
                    <div key={idx} className="image-card glass-card">
                      <img src={img.src} alt={img.title} className="showcase-img" loading="lazy" />
                      <div className="image-card-overlay">
                        <span className="img-title">{img.title}</span>
                        <span className="img-prompt">{img.prompt}</span>
                        <button className="img-dl-btn" title="Download output" style={{ cursor: "pointer" }}>
                          <FolderDown size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ---- Phase Indicator ---- */}
          <div className="journey-phase-bar">
            {[0, 1, 2].map((p) => (
              <div key={p} className={`phase-dot ${phase === p ? "active" : ""}`} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------
   PROMPT CHIP — individual floating prompt that gets sucked
   toward the center of the Flow UI in a spiral
------------------------------------------------------- */
interface PromptChipProps {
  pos: PromptPos;
  scrollProgress: ReturnType<typeof useSpring>;
}

function PromptChip({ pos, scrollProgress }: PromptChipProps) {
  const startSuck = 0.25 + pos.delay * 0.12;
  const endSuck = 0.56 + pos.delay * 0.04;

  const suckProgress = useTransform(
    scrollProgress,
    [startSuck, endSuck],
    [0, 1]
  );
  
  const chipOpacity = useTransform(
    scrollProgress,
    [0.22, startSuck, endSuck - 0.06, endSuck + 0.02],
    [0, 1, 0.85, 0]
  );
  
  const chipScale = useTransform(suckProgress, [0, 0.7, 1], [1, 0.9, 0.25]);
  const chipRotate = useTransform(suckProgress, [0, 1], [0, 180 + Math.random() * 180]);

  // Polar coordinate spiral sucking math
  const r = Math.sqrt((pos.x - 50) ** 2 + (pos.y - 50) ** 2);
  const theta = Math.atan2(pos.y - 50, pos.x - 50);

  const chipX = useTransform(suckProgress, (t: number) => {
    const currentR = r * (1 - t);
    const currentTheta = theta + t * Math.PI * 3.4; // 1.7 full swirl turns
    return `calc(-50% + ${currentR * Math.cos(currentTheta)}vw)`;
  });

  const chipY = useTransform(suckProgress, (t: number) => {
    const currentR = r * (1 - t);
    const currentTheta = theta + t * Math.PI * 3.4;
    return `calc(-50% + ${currentR * Math.sin(currentTheta)}vh)`;
  });

  return (
    <motion.div
      className="prompt-chip"
      style={{
        x: chipX,
        y: chipY,
        opacity: chipOpacity,
        scale: chipScale,
        rotate: chipRotate,
      }}
    >
      {pos.text}
    </motion.div>
  );
}

