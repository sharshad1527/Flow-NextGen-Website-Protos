import { useRef, useMemo, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";
import { ArrowRight, Check, AlertTriangle } from "lucide-react";
import { ShinyButton } from "./ShinyButton";
import { TaskLedgerQueue } from "./TaskLedgerQueue";
import { Logo } from "./Logo";
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
      const progress = (frameIndex % TOTAL_FRAMES) / TOTAL_FRAMES;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "rgba(10,10,10,0)";
      ctx.fillRect(0, 0, W, H);

      // Compute transforms matching the SVG animation
      let groupRot = 0;
      let l_tx = 0, l_ty = 0, l_sx = 1, l_sy = 1;
      let r_tx = 0, r_ty = 0, r_sx = 1, r_sy = 1;
      let m_tx = 0, m_ty = 0, m_sx = 1, m_sy = 1, m_op = 1;
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
      style={{ width: 320, height: 320 }}
    />
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

/* -------------------------------------------------------
   MAIN SCROLL JOURNEY COMPONENT
------------------------------------------------------- */
export function ScrollJourney() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll progress across the full track
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Spring — tight enough to feel scroll-linked, smooth enough to look good
  const smooth = useSpring(scrollYProgress, { stiffness: 160, damping: 38 });

  // ---- SCENE TIMELINE ----
  // 0.00–0.22  Scene 0: Logo animation
  // 0.22–0.40  Scene 1: STATIC HERO — Flow UI at RIGHT, hero text at LEFT (user can pause here)
  // 0.40–0.72  Scene 2: Flow UI slides to CENTER, holds at center, prompts sucked in, queue fills
  // 0.72–1.00  Scene 3: Flow UI slides CENTER→LEFT, results hero slides in from RIGHT

  // LOGO — stays until 0.18, fades out by 0.26
  const logoOpacity = useTransform(smooth, [0, 0.18, 0.26], [1, 1, 0]);
  const logoScale   = useTransform(smooth, [0, 0.18, 0.26], [1, 1, 0.4]);

  // HERO LEFT TEXT
  // Fades in as logo fades (0.20), stays static through whole Scene 1 (until 0.40),
  // then fades out as Flow UI starts moving to center (0.40–0.50)
  const heroLeftX       = useTransform(smooth, [0.18, 0.28, 0.40, 0.50], ["-8%", "0%", "0%", "-10%"]);
  const heroLeftOpacity = useTransform(smooth, [0.18, 0.28, 0.42, 0.52], [0, 1, 1, 0]);

  // FLOW UI POSITION: RIGHT → (holds) → CENTER → LEFT
  // 0.20–0.22: fade in at right
  // 0.22–0.40: HOLDS at 72% — the static hero window
  // 0.40–0.52: slides right→center
  // 0.52–0.72: HOLDS at 50% — the wide center hold window
  // 0.72–0.88: slides center→left
  const flowUIX = useTransform(
    smooth,
    [0.20, 0.22, 0.40, 0.52, 0.72, 0.88],
    ["72%", "72%", "72%", "50%", "50%", "18%"]
  );
  const flowUIOpacity = useTransform(smooth, [0.18, 0.26, 0.90, 1.0], [0, 1, 1, 0.85]);
  const flowUIScale   = useTransform(smooth, [0.72, 0.88], [1, 0.83]);

  // BLACK-HOLE GLOW — visible when prompts are flying in (Scene 2)
  const glowOpacity = useTransform(smooth, [0.40, 0.50, 0.68, 0.72], [0, 1, 0.4, 0]);

  // PROMPT PARTICLES — appear in Scene 2 only
  const promptsOpacity = useTransform(smooth, [0.40, 0.46, 0.68, 0.74], [0, 1, 1, 0]);

  // RESULTS HERO — slides in from right during Scene 3
  const resultsX       = useTransform(smooth, [0.74, 0.88], ["8%", "0%"]);
  const resultsOpacity = useTransform(smooth, [0.74, 0.88], [0, 1]);

  // Phase indicator dots
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    return smooth.on("change", (v) => {
      if (v < 0.22) setPhase(0);       // Logo
      else if (v < 0.40) setPhase(1);  // Hero static
      else if (v < 0.72) setPhase(2);  // Prompts / center
      else setPhase(3);                // Results
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

  return (
    <div className="scroll-journey" ref={trackRef}>
      <div className="journey-stage">

        {/* ---- SCENE 0: Logo Intro ---- */}
        <motion.div
          className="logo-intro-layer"
          style={{ opacity: logoOpacity, scale: logoScale }}
        >
          <div className="logo-canvas-wrap">
            <LogoIntroCanvas />
          </div>
        </motion.div>

        {/* ---- HERO LEFT TEXT ---- */}
        <motion.div
          className="hero-left"
          style={{ x: heroLeftX, opacity: heroLeftOpacity }}
        >
          <div className="hero-eyebrow" style={{ opacity: 1 }}>
            <span className="hero-eyebrow-dot" />
            Chrome Extension · Google Flow
          </div>

          <h1 className="hero-headline">
            You Slept.<br />
            It Ran<br />
            <em>127 Prompts.</em>
          </h1>

          <p className="hero-subtext">
            Flow NextGen automates your entire Google Flow AI generation queue.
            <strong> Import prompts. Hit start. Walk away.</strong> No more
            babysitting. No more manual saves.
          </p>

          <div className="hero-cta-row">
            <ShinyButton>
              Install Free Extension <ArrowRight size={16} />
            </ShinyButton>
            <a href="#how-it-works" className="button-secondary glass-card">
              See how it works
            </a>
          </div>

          <div className="hero-stat-strip">
            <div className="hero-stat">
              <span className="hero-stat-num">100+</span>
              <span className="hero-stat-label">Prompts / run</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">0</span>
              <span className="hero-stat-label">Clicks needed</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">98%</span>
              <span className="hero-stat-label">Success rate</span>
            </div>
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
              phase={phase}
            />
          ))}
        </motion.div>

        {/* ---- FLOW UI (STICKY CENTER/LEFT) ---- */}
        <motion.div
          className="flow-ui-anchor"
          style={{
            left: flowUIX,
            translateX: "-50%",
            translateY: "-50%",
            opacity: flowUIOpacity,
            scale: flowUIScale,
          }}
        >
          {/* Black hole glow */}
          <motion.div
            className="flow-ui-glow"
            style={{ opacity: glowOpacity }}
          />

          <div className="flow-ui-shell glass-panel">
            {/* App Header */}
            <div className="mockup-app-header">
              <div className="mockup-app-logo">
                <Logo width={18} height={18} />
                <div className="app-title-group">
                  <span className="app-name">
                    Flow<span className="accent-text">NextGen</span>
                  </span>
                  <span className="app-version">BY HARSHAD V0.10.0</span>
                </div>
              </div>
              <span className="live-badge">
                <span className="live-dot" />
                LIVE
              </span>
            </div>

            {/* Queue screen */}
            <div
              style={{
                height: 330,
                background: "#0D0D0D",
                overflow: "hidden",
              }}
            >
              <AnimatedQueue scrollProgress={smooth} />
            </div>
          </div>
        </motion.div>

        {/* ---- RESULTS HERO (RIGHT) ---- */}
        <motion.div
          className="results-hero"
          style={{ x: resultsX, opacity: resultsOpacity }}
        >
          <div className="results-tag">
            <span className="results-tag-dot" />
            Session Complete
          </div>

          <h2 className="results-headline">
            Done.<br />
            <em>While</em><br />
            You Slept.
          </h2>

          <p className="results-subtext">
            Flow processed your entire queue overnight. Downloads sorted.
            Fails retried. You just woke up to a full folder.
          </p>

          <div className="results-stats-grid">
            <div className="result-stat-card highlight">
              <span className="result-stat-value green">127</span>
              <span className="result-stat-label">Generated</span>
            </div>
            <div className="result-stat-card">
              <span className="result-stat-value orange">98%</span>
              <span className="result-stat-label">Success rate</span>
            </div>
            <div className="result-stat-card">
              <span className="result-stat-value">18.4s</span>
              <span className="result-stat-label">Avg per task</span>
            </div>
            <div className="result-stat-card">
              <span className="result-stat-value">3</span>
              <span className="result-stat-label">Auto-retried</span>
            </div>
          </div>

          {/* Mini completed queue */}
          <div className="mini-queue-demo">
            {[
              { text: "cyberpunk samurai walking in neon...", time: "18.4s", ok: true },
              { text: "@character01 epic battle sequence", time: "21.2s", ok: true },
              { text: "anime girl cherry blossom forest", time: "16.8s", ok: true },
              { text: "style_cinematic.png + underwater...", time: "RETRY→OK", ok: true },
              { text: "retro 80s synthwave landscape", time: "FAIL", ok: false },
            ].map((job, i) => (
              <div className="mini-job-row" key={i}>
                <div className={`mini-job-icon ${job.ok ? "done" : "fail"}`}>
                  {job.ok ? <Check size={10} /> : <AlertTriangle size={10} />}
                </div>
                <span className="mini-job-text">{job.text}</span>
                <span className="mini-job-time">{job.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ---- Phase Indicator ---- */}
        <div className="journey-phase-bar">
          {[0, 1, 2, 3].map((p) => (
            <div key={p} className={`phase-dot ${phase === p ? "active" : ""}`} />
          ))}
        </div>

        {/* ---- Scroll Cue ---- */}
        <AnimatePresence>
          {phase === 0 && (
            <motion.div
              className="scroll-cue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="scroll-cue-label">Scroll</span>
              <div className="scroll-cue-arrow">
                <div className="scroll-cue-dot" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   PROMPT CHIP — individual floating prompt that gets sucked
   toward the center of the Flow UI as scroll progresses
------------------------------------------------------- */
interface PromptChipProps {
  pos: PromptPos;
  scrollProgress: ReturnType<typeof useSpring>;
  phase: number;
}

function PromptChip({ pos, scrollProgress }: PromptChipProps) {
  const suckProgress = useTransform(
    scrollProgress,
    [0.42 + pos.delay * 0.1, 0.58 + pos.delay * 0.04],
    [0, 1]
  );
  const chipOpacity = useTransform(
    scrollProgress,
    [0.38, 0.42 + pos.delay * 0.04, 0.58, 0.62],
    [0, 1, 0.8, 0]
  );
  const chipScale = useTransform(suckProgress, [0, 0.7, 1], [1, 0.95, 0.4]);

  // Position: lerp from random pos toward center (50%, 50%)
  const chipX = useTransform(suckProgress, [0, 1], [`${pos.x}%`, "50%"]);
  const chipY = useTransform(suckProgress, [0, 1], [`${pos.y}%`, "50%"]);

  return (
    <motion.div
      className="prompt-chip"
      style={{
        left: chipX,
        top: chipY,
        translateX: "-50%",
        translateY: "-50%",
        opacity: chipOpacity,
        scale: chipScale,
      }}
    >
      {pos.text}
    </motion.div>
  );
}

/* -------------------------------------------------------
   ANIMATED QUEUE — shows jobs filling in as user scrolls
------------------------------------------------------- */
interface AnimatedQueueProps {
  scrollProgress: ReturnType<typeof useSpring>;
}

function AnimatedQueue({ scrollProgress }: AnimatedQueueProps) {
  const [visibleJobs, setVisibleJobs] = useState(0);

  useEffect(() => {
    return scrollProgress.on("change", (v) => {
      if (v < 0.42) setVisibleJobs(0);
      else if (v < 0.48) setVisibleJobs(1);
      else if (v < 0.54) setVisibleJobs(2);
      else if (v < 0.60) setVisibleJobs(3);
      else if (v < 0.66) setVisibleJobs(4);
      else setVisibleJobs(5);
    });
  }, [scrollProgress]);

  const [jobStates, setJobStates] = useState([
    { id: "j01", type: "Text to Video", prompt: "cyberpunk samurai in neon rain...", status: "COMPLETE" as const, time: "18.4s", progress: 100 },
    { id: "j02", type: "Img to Video", prompt: "anime girl cherry blossom forest", status: "COMPLETE" as const, time: "16.8s", progress: 100 },
    { id: "j03", type: "Text to Video", prompt: "@character01 epic battle sequence", status: "RUNNING" as const, time: "", progress: 35 },
    { id: "j04", type: "Ingredients", prompt: "style_cinematic.png + underwater...", status: "PENDING" as const, time: "Queued", progress: 0 },
    { id: "j05", type: "Text to Video", prompt: "retro 80s synthwave landscape", status: "FAILED" as const, time: "RETRY 2/3", progress: 0 },
  ]);

  const [logs, setLogs] = useState<string[]>([
    "[23:25:01] Flow NextGen initialized.",
    "[23:25:02] Queue loaded: 5 tasks.",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setJobStates((prev) => {
        const next = prev.map((j) => ({ ...j }));
        const runningIdx = next.findIndex((j) => j.status === "RUNNING");
        if (runningIdx !== -1) {
          const job = next[runningIdx];
          const curr = (job.progress || 0) + Math.floor(Math.random() * 8 + 3);
          if (curr >= 100) {
            job.status = "COMPLETE";
            const elapsed = (14 + Math.random() * 6).toFixed(1);
            job.time = `${elapsed}s`;
            job.progress = 100;
            setLogs((l) => [
              ...l,
              `[23:28:${Math.floor(Math.random() * 50 + 10)}] Task [${job.id}] → COMPLETE in ${elapsed}s. Saved to Disk.`,
            ]);
            // Run next pending if any
            const pendingIdx = next.findIndex((j) => j.status === "PENDING");
            if (pendingIdx !== -1) {
              next[pendingIdx].status = "RUNNING";
              next[pendingIdx].progress = 0;
            }
          } else {
            job.progress = curr;
          }
          return next;
        } else {
          // Reset simulator to loop infinitely
          next[2].status = "RUNNING";
          next[2].progress = 20;
          next[2].time = "";
          next[3].status = "PENDING";
          next[3].progress = 0;
          next[3].time = "Queued";
          setLogs([
            "[23:25:01] Flow NextGen initialized.",
            "[23:25:02] Queue loaded: 5 tasks.",
          ]);
          return next;
        }
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const visibleSubset = jobStates.slice(0, visibleJobs);
  const activeCount = visibleSubset.filter(
    (j) => j.status === "RUNNING" || j.status === "PENDING"
  ).length;
  const succeededCount = visibleSubset.filter(
    (j) => j.status === "COMPLETE"
  ).length;
  const failedCount = visibleSubset.filter(
    (j) => j.status === "FAILED"
  ).length;

  return (
    <div className="task-ledger-queue">
      {/* Header */}
      <div className="queue-title-block">
        <div className="queue-title-left">
          <div className="queue-title-text-group">
            <h3 className="queue-main-header">TASK LEDGER QUEUE</h3>
            <span className="queue-subheader">FLOW COMPANION V0.10</span>
          </div>
        </div>
        <div className="queue-live-badge">
          <span className="queue-live-dot" />
          <span>LIVE</span>
        </div>
      </div>

      {/* Stats */}
      <div className="queue-metrics-dashboard">
        <div className="queue-metric-card stats-card">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">ACTIVE</span>
              <span className="stat-value">{activeCount} tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">AVG TIME</span>
              <span className="stat-value">18.4s</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">SUCCEEDED</span>
              <span className="stat-value success-text">{succeededCount}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">FAILED</span>
              <span className="stat-value error-text">{failedCount}</span>
            </div>
          </div>
        </div>
        <button className="queue-metric-card action-card active" disabled style={{ cursor: "default" }}>
          <span className="action-label">RUNNING</span>
        </button>
      </div>

      {/* Jobs list */}
      <div className="queue-jobs-list">
        <AnimatePresence>
          {visibleSubset.map((job) => {
            const isRunning = job.status === "RUNNING";
            const percent = job.progress || 0;
            const filled = Math.round(percent / 10);
            const bar = "▓".repeat(filled) + "░".repeat(10 - filled);
            const timeDisplay = isRunning ? `${bar} ${percent}%` : job.time;

            return (
              <motion.div
                key={job.id}
                className={`job-card-mockup ${job.status.toLowerCase()}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 22 }}
              >
                <div className="job-card-content">
                  <div className="job-left">
                    <div className={`status-icon-wrap ${job.status.toLowerCase()}`}>
                      {job.status === "COMPLETE" && <Check size={11} />}
                      {job.status === "FAILED" && <AlertTriangle size={11} />}
                      {isRunning && (
                        <span className="running-spinner" />
                      )}
                    </div>
                    <div className="job-details">
                      <div className="job-header">
                        <span className={`job-status-badge ${job.status.toLowerCase()}`}>
                          {job.status}
                        </span>
                        <span className="job-type">({job.type})</span>
                      </div>
                      <p className="job-prompt">{job.prompt}</p>
                    </div>
                  </div>
                  <div className="job-right">
                    <span className="job-status-time" style={{ fontFamily: isRunning ? "monospace" : "inherit" }}>
                      {timeDisplay}
                    </span>
                  </div>
                </div>
                <div className={`job-accent-bar ${job.status.toLowerCase()}`} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Log console */}
      <div className="queue-log-console">
        <div className="console-lines">
          {logs.slice(-3).map((log, index) => (
            <div key={index} className="console-line">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
