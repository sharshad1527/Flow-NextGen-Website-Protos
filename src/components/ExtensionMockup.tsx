import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause,
  Check, 
  Settings, 
  LayoutGrid,
  UserCheck,
  RotateCcw,
  MessageSquare,
  BookOpen,
  Crown,
  Clock,
  Sparkles,
  Zap,
  Sliders,
  Cloud,
  ChevronDown,
  Trash2,
  HelpCircle,
  Upload,
  Image as ImageIcon,
  Layers,
  Palette,
  Video,
  List,
  Search,
  Grid
} from "lucide-react";
import "./ExtensionMockup.css";

interface ExtensionMockupProps {
  phase: number; // 0 = Setup/Launch, 1 = Processing, 2 = Completed/Gallery
}

function FlowLogo() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4V20" stroke="#FF6B00" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M18 4V20" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round"/>
      <path d="M6 12H18" stroke="url(#logo-grad)" strokeWidth="4.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="logo-grad" x1="6" y1="12" x2="18" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00"/>
          <stop offset="1" stopColor="#FFFFFF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ExtensionMockup({ phase }: ExtensionMockupProps) {
  const [activeTab, setActiveTab] = useState<"control" | "gallery" | "queue" | "settings">("control");
  
  // Control Tab internal states
  const [activeSubTab, setActiveSubTab] = useState<"image" | "video" | "frame" | "ingredient">("image");
  const [activePromptsTab, setActivePromptsTab] = useState<"batch" | "library">("batch");
  const [engineModel, setEngineModel] = useState("Nano Banana 2");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [promptText, setPromptText] = useState(
    "orange hoodie character dancing in cyberpunk street, high angle, neon lights, volumetric glows\nchibi explorer in deep jungle, pixel art style, vibrant foliage, morning sunbeams"
  );

  // Queue Tab internal states
  const [queueStatus, setQueueStatus] = useState<"running" | "paused">("paused");
  const [progressVal, setProgressVal] = useState(100);
  const [logs, setLogs] = useState<string[]>([
    "[07:27:10] Flow NextGen initialized.",
    "[07:27:11] Syncing active project workspace.",
    "[07:27:12] Detected prompt list: 1 item found.",
    "[07:27:13] ERROR: Nano Banana 2 API timeout on generation."
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Gallery Tab internal states
  const [galleryFilter, setGalleryFilter] = useState<"all" | "videos" | "images" | "generating">("all");
  const [resolutionFilter, setResolutionFilter] = useState<"all" | "1k" | "2k" | "4k">("all");
  const [gridStyle, setGridStyle] = useState<"4x4" | "9x9">("4x4");

  // Sync active tab to phase changes from scroll journey
  useEffect(() => {
    if (phase === 0) {
      setActiveTab("control");
    } else if (phase === 1) {
      setActiveTab("queue");
      setQueueStatus("running");
      setProgressVal(35);
    } else if (phase === 2) {
      setActiveTab("gallery");
      setQueueStatus("paused");
      setProgressVal(100);
    } else {
      // Default/gallery view for any other phase (e.g. phase=3)
      setActiveTab("gallery");
      setQueueStatus("paused");
      setProgressVal(100);
    }
  }, [phase]);

  // Queue simulation logic
  useEffect(() => {
    if (queueStatus !== "running") return;
    
    const interval = setInterval(() => {
      setProgressVal((prev) => {
        if (prev >= 100) {
          const now = new Date().toLocaleTimeString("en-US", { hour12: false });
          setLogs((l) => [
            ...l,
            `[${now}] Batch job compiled. Exported result to gallery.`
          ]);
          return 0;
        }
        return prev + Math.floor(Math.random() * 8 + 4);
      });
    }, 900);

    return () => clearInterval(interval);
  }, [queueStatus]);

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="extension-popup glass-panel font-jakarta">
      
      {/* ================= HEADER ================= */}
      <div className="ext-header">
        <div className="ext-brand">
          <div className="ext-logo-icon">
            <FlowLogo />
          </div>
          <div className="ext-title-group">
            <span className="ext-title">
              Flow<span className="accent-orange">NextGen</span>
            </span>
            <span className="ext-version">STABLE BUILD</span>
          </div>
        </div>

        <div className="ext-header-actions">
          <button className="header-icon-btn" aria-label="Messages">
            <MessageSquare size={13} />
          </button>
          <button className="header-icon-btn" aria-label="Documentation">
            <BookOpen size={13} />
          </button>
          <div className="vertical-divider" />
          
          {activeTab === "settings" ? (
            <div className="badge-pro glow-orange-soft">
              <Crown size={10} className="crown-icon" />
              <span>PRO</span>
            </div>
          ) : (
            <button className="badge-upgrade glow-orange">
              <Clock size={10} className="clock-icon" />
              <span>UPGRADE</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="ext-body">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CONTROL (Screen 5) */}
          {activeTab === "control" && (
            <motion.div
              key="control"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              className="tab-pane control-pane"
            >
              {/* Sub-tabs IMAGE/VIDEO/FRAME/INGREDIENT */}
              <div className="control-subtabs">
                <button 
                  className={`subtab-btn ${activeSubTab === "image" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("image")}
                >
                  <Palette size={11} />
                  <span>IMAGE</span>
                </button>
                <button 
                  className={`subtab-btn ${activeSubTab === "video" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("video")}
                >
                  <Video size={11} />
                  <span>VIDEO</span>
                </button>
                <button 
                  className={`subtab-btn ${activeSubTab === "frame" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("frame")}
                >
                  <ImageIcon size={11} />
                  <span>FRAME</span>
                </button>
                <button 
                  className={`subtab-btn ${activeSubTab === "ingredient" ? "active" : ""}`}
                  onClick={() => setActiveSubTab("ingredient")}
                >
                  <Layers size={11} />
                  <span>INGREDIENT</span>
                </button>
              </div>

              {/* Stepper Pipeline */}
              <div className="stepper-capsule">
                <div className="step-item active">
                  <div className="step-circle active">1</div>
                  <span className="step-label">PROMPTS</span>
                </div>
                <div className="step-line" />
                <div className="step-item">
                  <div className="step-circle">2</div>
                  <span className="step-label">REFERENCES</span>
                </div>
                <div className="step-line" />
                <div className="step-item">
                  <div className="step-circle">3</div>
                  <span className="step-label">LAUNCH</span>
                </div>
              </div>

              {/* Engine Model Row */}
              <div className="engine-model-card">
                <div className="engine-card-left">
                  <Sparkles size={13} className="accent-orange" />
                  <div className="engine-card-text">
                    <span className="engine-title">ENGINE MODEL</span>
                    <span className="engine-subtext">Model choice override for generation run</span>
                  </div>
                </div>
                <div className="dropdown-container">
                  <button 
                    className="engine-dropdown-trigger"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>{engineModel}</span>
                    <ChevronDown size={10} />
                  </button>
                  {isDropdownOpen && (
                    <div className="engine-dropdown-list">
                      <div className="dropdown-item" onClick={() => { setEngineModel("Nano Banana 2"); setIsDropdownOpen(false); }}>Nano Banana 2</div>
                      <div className="dropdown-item" onClick={() => { setEngineModel("Veo Video Pro"); setIsDropdownOpen(false); }}>Veo Video Pro</div>
                      <div className="dropdown-item" onClick={() => { setEngineModel("Imagen 3 Flash"); setIsDropdownOpen(false); }}>Imagen 3 Flash</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Batch / Character setup buttons */}
              <div className="batch-toggle-bar">
                <button 
                  className={`batch-toggle-btn ${activePromptsTab === "batch" ? "active" : ""}`}
                  onClick={() => setActivePromptsTab("batch")}
                >
                  BATCH PROMPT LIST
                </button>
                <button 
                  className={`batch-toggle-btn ${activePromptsTab === "library" ? "active" : ""}`}
                  onClick={() => setActivePromptsTab("library")}
                >
                  CHARACTER LIBRARY SETUP
                </button>
              </div>

              {/* Live Prompts Textarea container */}
              <div className="live-prompts-container">
                <div className="live-prompts-header">
                  <span className="live-lbl">LIVE PROMPTS (ONE PER LINE)</span>
                  <div className="header-buttons">
                    <button className="prompt-action-btn">Import List</button>
                    <button className="prompt-action-btn orange-border">Flow-NextGen</button>
                  </div>
                </div>
                <textarea 
                  className="prompts-textarea font-mono"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Enter prompts, one per line..."
                />
              </div>

              {/* Launch Automator CTA */}
              <button 
                className="launch-automator-btn glow-orange-pulse"
                onClick={() => {
                  setActiveTab("queue");
                  setQueueStatus("running");
                  setProgressVal(0);
                  setLogs(l => [...l, `[${new Date().toLocaleTimeString("en-US", { hour12: false })}] Automation process started manually.`]);
                }}
              >
                <Play size={11} fill="currentColor" />
                <span>LAUNCH AUTOMATOR</span>
              </button>

            </motion.div>
          )}

          {/* TAB 2: QUEUE (Screen 2) */}
          {activeTab === "queue" && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              className="tab-pane queue-pane"
            >
              {/* Task Ledger Queue Title block */}
              <div className="queue-title-row">
                <div className="q-title-left">
                  <div className="q-title-icon-box">
                    <List size={12} className="accent-orange" />
                  </div>
                  <div className="q-title-text-group">
                    <span className="q-main-title">TASK LEDGER QUEUE</span>
                    <span className="q-sub-title">FLOW COMPANION</span>
                  </div>
                </div>
                <div className={`paused-badge ${queueStatus === "paused" ? "active" : ""}`}>
                  <span className="paused-dot" />
                  <span>{queueStatus === "paused" ? "PAUSED" : "ACTIVE"}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-dashboard">
                <div className="stat-card">
                  <span className="stat-label">ACTIVE</span>
                  <div className="stat-value-group">
                    <span className="dot dot-orange pulse-orange-dot" />
                    <span className="stat-value">{queueStatus === "running" ? 1 : 0}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-label">AVG TIME</span>
                  <div className="stat-value-group">
                    <Clock size={10} className="stat-icon text-muted" />
                    <span className="stat-value text-muted">---</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-label">SUCCEEDED</span>
                  <div className="stat-value-group">
                    <span className="dot dot-green" />
                    <span className="stat-value success-text">{phase === 2 ? 4 : 2}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-label">FAILED</span>
                  <div className="stat-value-group">
                    <span className="dot dot-red" />
                    <span className="stat-value error-text">1</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="queue-control-action-bar">
                {queueStatus === "paused" ? (
                  <button 
                    className="resume-btn"
                    onClick={() => {
                      setQueueStatus("running");
                      setLogs(l => [...l, `[${new Date().toLocaleTimeString("en-US", { hour12: false })}] Queue resumed.`]);
                    }}
                  >
                    <Play size={10} fill="currentColor" />
                    <span>RESUME</span>
                  </button>
                ) : (
                  <button 
                    className="resume-btn pause-mode"
                    onClick={() => {
                      setQueueStatus("paused");
                      setLogs(l => [...l, `[${new Date().toLocaleTimeString("en-US", { hour12: false })}] Queue paused by user.`]);
                    }}
                  >
                    <Pause size={10} fill="currentColor" />
                    <span>PAUSE</span>
                  </button>
                )}
                
                <div className="inline-queue-links">
                  <button className="lnk-btn" onClick={() => setLogs(l => [...l, `[${new Date().toLocaleTimeString("en-US", { hour12: false })}] Retrying failed items.`])}>
                    <RotateCcw size={9} />
                    <span>Retry</span>
                  </button>
                  <button className="lnk-btn" onClick={() => setLogs(l => [...l, `[${new Date().toLocaleTimeString("en-US", { hour12: false })}] Pruned inactive tasks.`])}>
                    <Trash2 size={9} />
                    <span>Prune</span>
                  </button>
                  <button className="lnk-btn">
                    <Check size={9} />
                    <span>Clear Done</span>
                  </button>
                  <button className="lnk-btn">
                    <Trash2 size={9} />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Active list item */}
              <div className="queue-list-items-wrapper">
                <div className="queue-item-card">
                  <div className="q-item-left">
                    <div className="q-video-icon-wrapper">
                      <Video size={10} className="orange-icon" />
                    </div>
                    <div className="q-item-meta">
                      <span className="q-item-title font-mono">BATCH 07:27 PM</span>
                      <span className="q-item-desc">07:27 PM - {phase === 2 ? "1/1" : "0/1"} DONE</span>
                    </div>
                  </div>

                  <div className="q-item-right">
                    {phase === 2 ? (
                      <span className="status-pill-text succeeded">SUCCEEDED</span>
                    ) : queueStatus === "running" ? (
                      <div className="running-progress-container">
                        <span className="progress-percentage">{progressVal}%</span>
                        <div className="mini-progress-track">
                          <div className="mini-progress-fill" style={{ width: `${progressVal}%` }} />
                        </div>
                      </div>
                    ) : (
                      <span className="status-pill-text failed">FAILED</span>
                    )}
                    
                    <button className="q-item-action-icon">
                      <Trash2 size={10} />
                    </button>
                    <button className="q-item-action-icon">
                      <ChevronDown size={10} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Debug console section */}
              <div className="terminal-console-wrapper">
                <div className="terminal-console-header">
                  <div className="console-title font-mono">&gt;_ SCHEDULER DEBUG LOG</div>
                  <div className="console-filters">
                    <span className="c-filter active">All</span>
                    <span className="c-filter">Success</span>
                    <span className="c-filter">Alerts</span>
                  </div>
                </div>
                <div className="terminal-console-body font-mono">
                  {logs.map((log, index) => (
                    <div key={index} className="log-entry-line">{log}</div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 3: GALLERY (Screens 3 & 4) */}
          {activeTab === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              className="tab-pane gallery-pane"
            >
              {/* Studio Gallery Title header */}
              <div className="gallery-header-row">
                <div className="gallery-header-text">
                  <span className="g-title">STUDIO GALLERY</span>
                  <span className="g-subtitle">MANAGE YOUR GENERATED IMAGES AND VIDEOS</span>
                </div>
                <button className="g-help-btn">
                  <HelpCircle size={12} />
                </button>
              </div>

              {/* Subtabs IMPORT, SCENES, MATCHED, SCAN PROJECT */}
              <div className="gallery-top-action-bar">
                <div className="g-action-subtabs">
                  <button className="g-action-btn">
                    <Upload size={10} />
                    <span>IMPORT</span>
                  </button>
                  <button className="g-action-btn">
                    <LayoutGrid size={10} />
                    <span>SCENES</span>
                  </button>
                  <button className="g-action-btn">
                    <ImageIcon size={10} />
                    <span>MATCHED</span>
                  </button>
                </div>
                <button className="scan-project-btn" onClick={() => setLogs(l => [...l, `[${new Date().toLocaleTimeString("en-US", { hour12: false })}] Rescanned project directory. Found 4 generated media files.`])}>
                  <RotateCcw size={10} />
                  <span>SCAN PROJECT</span>
                </button>
              </div>

              {/* Media Categories filters */}
              <div className="media-categories-bar">
                <button 
                  className={`media-filter-btn ${galleryFilter === "all" ? "active" : ""}`}
                  onClick={() => setGalleryFilter("all")}
                >
                  ALL
                </button>
                <button 
                  className={`media-filter-btn ${galleryFilter === "videos" ? "active" : ""}`}
                  onClick={() => setGalleryFilter("videos")}
                >
                  VIDEOS
                </button>
                <button 
                  className={`media-filter-btn ${galleryFilter === "images" ? "active" : ""}`}
                  onClick={() => setGalleryFilter("images")}
                >
                  IMAGES
                </button>
                <button 
                  className={`media-filter-btn ${galleryFilter === "generating" ? "active" : ""}`}
                  onClick={() => setGalleryFilter("generating")}
                >
                  GENERATING
                </button>
              </div>

              {/* Toolbar filters: search, sort, resolution, layout */}
              <div className="gallery-toolbar-row">
                <div className="toolbar-search-box">
                  <Search size={10} className="search-icon" />
                  <input type="text" placeholder="Search prompts..." className="search-input" />
                </div>

                <div className="toolbar-sort-trigger">
                  <span>Newest First</span>
                  <ChevronDown size={8} />
                </div>

                <div className="toolbar-resolution-filter">
                  <button className={`res-btn ${resolutionFilter === "all" ? "active" : ""}`} onClick={() => setResolutionFilter("all")}>ALL</button>
                  <button className={`res-btn ${resolutionFilter === "1k" ? "active" : ""}`} onClick={() => setResolutionFilter("1k")}>1K</button>
                  <button className={`res-btn ${resolutionFilter === "2k" ? "active" : ""}`} onClick={() => setResolutionFilter("2k")}>2K</button>
                  <button className={`res-btn ${resolutionFilter === "4k" ? "active" : ""}`} onClick={() => setResolutionFilter("4k")}>4K</button>
                </div>

                <div className="grid-toggle-box">
                  <button className={`grid-btn ${gridStyle === "4x4" ? "active" : ""}`} onClick={() => setGridStyle("4x4")}>
                    <LayoutGrid size={11} />
                  </button>
                  <button className={`grid-btn ${gridStyle === "9x9" ? "active" : ""}`} onClick={() => setGridStyle("9x9")}>
                    <Grid size={11} />
                  </button>
                </div>
              </div>

              {/* Select All Checkbox bar */}
              <div className="select-all-bar">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Select All ({phase === 2 ? 4 : 2} items)</span>
                </label>
              </div>

              {/* Gallery Grid items */}
              <div className="gallery-media-grid">
                {/* Item 1: Samurai Video (16:9 6s) */}
                <div className="gallery-item-wrapper video-item">
                  <img src="/result_samurai.jpg" alt="Samurai Mockup" className="gallery-img" loading="lazy" />
                  <div className="media-play-overlay">
                    <Play size={16} fill="currentColor" className="play-icon-svg" />
                  </div>
                  <div className="badge-row-top">
                    <span className="aspect-badge">16:9</span>
                    <span className="duration-badge">6s</span>
                  </div>
                  <div className="tag-overlay-bottom">
                    <span>cyberpunk samurai street...</span>
                  </div>
                </div>

                {/* Item 2: Character 1 (1:1) */}
                <div className="gallery-item-wrapper">
                  <img src="/result_anime.jpg" alt="Anime Art Mockup" className="gallery-img" loading="lazy" />
                  <div className="badge-row-top">
                    <span className="aspect-badge">1:1</span>
                  </div>
                  <div className="tag-overlay-bottom">
                    <span>anime girl cherry blos...</span>
                  </div>
                </div>

                {/* Item 3: Character 2 (1:1) */}
                {(phase === 2 || galleryFilter !== "generating") && (
                  <div className="gallery-item-wrapper">
                    <img src="/result_city.jpg" alt="City Timelapse Mockup" className="gallery-img" loading="lazy" />
                    <div className="badge-row-top">
                      <span className="aspect-badge">1:1</span>
                    </div>
                    <div className="tag-overlay-bottom">
                      <span>futuristic city timela...</span>
                    </div>
                  </div>
                )}

                {/* Item 4: Character 3 (1:1) */}
                {(phase === 2 || galleryFilter !== "generating") && (
                  <div className="gallery-item-wrapper">
                    <img src="/result_space.jpg" alt="Astronaut Nebula Mockup" className="gallery-img" loading="lazy" />
                    <div className="badge-row-top">
                      <span className="aspect-badge">1:1</span>
                    </div>
                    <div className="tag-overlay-bottom">
                      <span>astronaut nebula spa...</span>
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* TAB 4: SETTINGS / CONFIG (Screen 1) */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              className="tab-pane settings-pane"
            >
              {/* Title & Badge */}
              <div className="settings-title-row">
                <div className="s-title-left">
                  <div className="s-title-icon-box">
                    <Sliders size={12} className="accent-orange" />
                  </div>
                  <div className="s-title-text-group">
                    <span className="s-main-title">CONFIGURATION PANEL</span>
                    <span className="s-sub-title">CONTROL CENTER & SYNC</span>
                  </div>
                </div>
                <div className="runtime-badge">
                  <Cloud size={10} className="cloud-icon" />
                  <span>RUNTIME</span>
                </div>
              </div>

              {/* Subtabs ACCOUNT/COMPILER/DOWNLOADS/SYSTEM */}
              <div className="settings-subtabs">
                <span className="s-subtab-item active">ACCOUNT</span>
                <span className="s-subtab-item">COMPILER</span>
                <span className="s-subtab-item">DOWNLOADS</span>
                <span className="s-subtab-item">SYSTEM</span>
              </div>

              {/* Active Account card panel */}
              <div className="settings-card-group">
                <div className="account-details-card">
                  <div className="account-avatar-wrapper">
                    <span className="avatar-letter">D</span>
                    <div className="avatar-glow-ring" />
                  </div>
                  <div className="account-text-details">
                    <div className="account-pro-pill-row">
                      <span className="acc-lbl">ACTIVE ACCOUNT</span>
                      <div className="pro-capsule-badge">PRO</div>
                    </div>
                    <span className="account-email font-mono">flow.user@flownextgen.io</span>
                  </div>
                </div>

                {/* Quota details card */}
                <div className="quota-details-card">
                  <div className="quota-lbl-col">
                    <div className="quota-tag font-mono">
                      <Sparkles size={11} className="orange-sparkle" />
                      <span>GENERATION QUOTA</span>
                    </div>
                    <span className="prompts-sub font-mono">REMAINING PROMPTS: UNLIMITED</span>
                  </div>
                  <div className="quota-val-col">
                    <span className="quota-val-title font-mono">Unlimited</span>
                    <span className="quota-val-sub font-mono">PRO PLAN ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Manage subscription btn */}
              <button className="manage-sub-btn">
                <UserCheck size={11} />
                <span>MANAGE SUBSCRIPTION</span>
              </button>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ================= FLOATING BOTTOM NAVIGATION BAR ================= */}
      <div className="ext-bottom-nav">
        <button 
          className={`nav-item ${activeTab === "control" ? "active" : ""}`}
          onClick={() => setActiveTab("control")}
          aria-label="Control Panel"
        >
          <Zap size={13} className="nav-icon" />
          {activeTab === "control" && <span className="nav-label">CONTROL</span>}
        </button>

        <button 
          className={`nav-item ${activeTab === "gallery" ? "active" : ""}`}
          onClick={() => setActiveTab("gallery")}
          aria-label="Gallery"
        >
          <LayoutGrid size={13} className="nav-icon" />
          {activeTab === "gallery" && <span className="nav-label">GALLERY</span>}
        </button>

        <button 
          className={`nav-item ${activeTab === "queue" ? "active" : ""}`}
          onClick={() => setActiveTab("queue")}
          aria-label="Queue"
        >
          <List size={13} className="nav-icon" />
          {activeTab === "queue" && <span className="nav-label">QUEUE</span>}
        </button>

        <button 
          className="nav-item disabled-media"
          onClick={() => setActiveTab("gallery")}
          aria-label="Media"
        >
          <Video size={13} className="nav-icon" />
        </button>

        <button 
          className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
          aria-label="Settings"
        >
          <Settings size={13} className="nav-icon" />
          {activeTab === "settings" && <span className="nav-label">SETTINGS</span>}
        </button>
      </div>

    </div>
  );
}
