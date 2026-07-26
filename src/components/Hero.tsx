import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { 
  ArrowRight, Sparkles, LayoutGrid, Settings, HelpCircle, List, Zap
} from "lucide-react";
import { ShinyButton } from "./ShinyButton";
import { ExtensionMockup } from "./ExtensionMockup";
import "./Hero.css";

type TabType = "control" | "gallery" | "queue" | "settings";

interface Hotspot {
  x: string;
  y: string;
  title: string;
  text: string;
  align?: "left" | "right";
}

const hotspotsData: Record<TabType, Hotspot[]> = {
  control: [
    { x: "50%", y: "15%", title: "Automation Engine", text: "Choose between Image, Video, Frame, or recipe-based multi-stage generation chains." },
    { x: "50%", y: "30%", title: "Structured Steps", text: "Configure bulk prompts, seeds, and character references without touch coordinates." },
    { x: "74%", y: "45%", title: "Model Override", text: "Instantly swap base models across target generation platforms directly in-extension." },
    { x: "50%", y: "65%", title: "Prompt & Characters", text: "Inject dynamic variables and character profiles to keep visual assets on-brand." }
  ],
  gallery: [
    { x: "50%", y: "10%", title: "Studio Gallery", text: "Search and manage all generated visual assets in one localized workspace." },
    { x: "28%", y: "24%", title: "Format Filters", text: "Filter by Videos, Images, or currently Generating tasks." },
    { x: "50%", y: "35%", title: "Instant Search", text: "Search prompts, tags, or IDs with instant DOM indexing." },
    { x: "74%", y: "62%", title: "Grid Previews", text: "Hover to play video drafts or see aspect ratios (16:9, 1:1) in high resolution." }
  ],
  queue: [
    { x: "25%", y: "18%", title: "Live Analytics", text: "Monitor generation throughput, execution times, and status counts live." },
    { x: "75%", y: "30%", title: "Global Pause", text: "Pause and edit pending prompts on the fly without breaking your execution flow.", align: "left" },
    { x: "50%", y: "42%", title: "Queue Actions", text: "One-click retry for failed tasks, clean error logs, or export execution histories." },
    { x: "50%", y: "64%", title: "Granular Status", text: "Track real-time progress, rate-limit cooldown timers, and auto-retry sequences." }
  ],
  settings: [
    { x: "50%", y: "22%", title: "Config Hub", text: "Fine-tune download paths, DOM delays, error recovery thresholds, and API keys." },
    { x: "50%", y: "42%", title: "Active Subscription", text: "Unlock unlimited parallel queues, custom renaming templates, and priority generation speeds." },
    { x: "50%", y: "70%", title: "Subscription Manager", text: "Direct portal to manage invoices, billing history, and active license keys." }
  ]
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 18
    }
  }
};

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>("queue");
  const [hoveredHotspot, setHoveredHotspot] = useState<{ tab: TabType; index: number } | null>(null);

  // Mouse Parallax values
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);

  // Spring physics for smooth lag
  const springRotateX = useSpring(rotateXVal, { stiffness: 100, damping: 20 });
  const springRotateY = useSpring(rotateYVal, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Map coordinates to range [-10, 10] degrees
      const xDeg = ((clientY / height) - 0.5) * -20;
      const yDeg = ((clientX / width) - 0.5) * 20;

      rotateXVal.set(xDeg);
      rotateYVal.set(yDeg);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rotateXVal, rotateYVal]);

  // Scroll Parallax for Mockup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleMockup = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const activePhase = activeTab === "control" ? 0 : activeTab === "queue" ? 1 : activeTab === "gallery" ? 2 : 3;

  return (
    <section className="hero centered-hero" ref={containerRef}>
      <div className="container hero-container-centered">
        
        {/* CENTERED TEXT */}
        <motion.div 
          className="hero-content-centered"
          style={{ y: textY, opacity: textOpacity }}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero-title-centered" variants={childVariants}>
            Stop Babysitting AI.. Run 100+ Prompts in the Background.. <span className="gradient-text">While You Sleep.</span>
          </motion.h1>
          <motion.p className="hero-description-centered" variants={childVariants}>
            Listen, stop wasting hours copy-pasting prompts, and clicking "Save As" like a robot.. Flow NextGen runs your entire Queue in the background, handles the Errors, and gets files sorted automatically.
          </motion.p>
          <motion.div className="hero-actions-centered" variants={childVariants}>
            <ShinyButton>
              Install Free Extension <ArrowRight size={18} />
            </ShinyButton>
            <a href="#how-it-works" className="button-secondary glass-card">
              See how it works
            </a>
          </motion.div>
        </motion.div>
        
        {/* CENTERED 3D MOCKUP WITH PARALLAX */}
        <div className="hero-showcase-centered-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Sparkles Badge elegantly placed above the mockup window */}
          <div className="badge glass-card" style={{ marginBottom: "2rem", background: "rgba(22, 22, 22, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "0.45rem 1rem" }}>
            <Sparkles size={14} className="accent-text" />
            <span>Stop babysitting generation queues</span>
          </div>
          <motion.div 
            className="hero-visual-centered"
            style={{ 
              rotateX: springRotateX,
              rotateY: springRotateY, 
              scale: scaleMockup,
              transformStyle: "preserve-3d",
              perspective: 1200 
            }}
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring", stiffness: 50, damping: 15 }}
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              style={{ willChange: "transform", width: "100%", position: "relative" }}
            >
              <div className="mockup-window hero-centered-mockup" style={{ minHeight: "480px", position: "relative" }}>
                <ExtensionMockup phase={activePhase} />
                
                {/* Interactive Hotspots Overlaid on the Mockup */}
                {hotspotsData[activeTab].map((hotspot, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      position: "absolute", 
                      top: hotspot.y, 
                      left: hotspot.x,
                      transform: "translate(-50%, -50%)",
                      zIndex: 10,
                      cursor: "pointer"
                    }}
                    onMouseEnter={() => setHoveredHotspot({ tab: activeTab, index: idx })}
                    onMouseLeave={() => setHoveredHotspot(null)}
                  >
                    <motion.div
                      className="hotspot-pulse"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "rgba(255, 107, 0, 0.45)",
                        border: "2px solid #FF6B00",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <HelpCircle size={9} style={{ color: "#FFF" }} />
                    </motion.div>

                    {/* Hotspot Tooltip */}
                    <AnimatePresence>
                      {hoveredHotspot?.tab === activeTab && hoveredHotspot?.index === idx && (
                        <motion.div
                          className="hotspot-tooltip glass-card"
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: -8, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          style={{
                            position: "absolute",
                            bottom: "100%",
                            left: hotspot.align === "left" ? "auto" : "50%",
                            right: hotspot.align === "left" ? "0" : "auto",
                            transform: hotspot.align === "left" ? "translateX(20%)" : "translateX(-50%)",
                            width: "180px",
                            padding: "0.6rem",
                            borderRadius: "8px",
                            background: "rgba(13, 13, 13, 0.95)",
                            border: "1px solid rgba(255, 107, 0, 0.3)",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
                            zIndex: 100,
                            pointerEvents: "none"
                          }}
                        >
                          <h4 style={{ margin: "0 0 0.2rem 0", color: "#FF6B00", fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {hotspot.title}
                          </h4>
                          <p style={{ margin: 0, color: "#CCCCCC", fontSize: "0.65rem", lineHeight: "1.3" }}>
                            {hotspot.text}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Bottom Nav Tab Controller linked directly to activePhase */}
              <div className="bottom-nav-container" style={{ position: "relative", bottom: "0", margin: "1.5rem 0 0.5rem" }}>
                <div className="bottom-nav glass-card" style={{ background: "rgba(22, 22, 22, 0.8)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "0.4rem 1.2rem", borderRadius: "100px", display: "flex", gap: "1.25rem", justifyContent: "center" }}>
                  <button 
                    className={`nav-btn ${activeTab === "control" ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTab("control"); }}
                    title="Control Center"
                  >
                    <div className={activeTab === "control" ? "active-icon-wrap" : ""}>
                      <Zap size={16} className={activeTab === "control" ? "accent-text" : ""} />
                    </div>
                  </button>
                  <button 
                    className={`nav-btn ${activeTab === "gallery" ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTab("gallery"); }}
                    title="Studio Gallery"
                  >
                    <div className={activeTab === "gallery" ? "active-icon-wrap" : ""}>
                      <LayoutGrid size={16} className={activeTab === "gallery" ? "accent-text" : ""} />
                    </div>
                  </button>
                  <button 
                    className={`nav-btn ${activeTab === "queue" ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTab("queue"); }}
                    title="Task Ledger Queue"
                  >
                    <div className={activeTab === "queue" ? "active-icon-wrap" : ""}>
                      <List size={16} className={activeTab === "queue" ? "accent-text" : ""} />
                    </div>
                  </button>
                  <button 
                    className={`nav-btn ${activeTab === "settings" ? "active" : ""}`}
                    onClick={(e) => { e.stopPropagation(); setActiveTab("settings"); }}
                    title="Configuration Panel"
                  >
                    <div className={activeTab === "settings" ? "active-icon-wrap" : ""}>
                      <Settings size={16} className={activeTab === "settings" ? "accent-text" : ""} />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
