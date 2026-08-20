import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ListChecks, 
  TerminalSquare, 
  AlertTriangle, 
  RotateCcw,
  CheckCircle2,
  FolderDown,
  ChevronUp,
  ChevronDown,
  FileVideo,
  FileImage,
  RefreshCw,
  Users,
  Package
} from "lucide-react";
import "./Features.css";

interface PromptItem {
  id: string;
  text: string;
  type: "video" | "image";
}

const initialPrompts: PromptItem[] = [
  { id: "1", text: "A futuristic skyline at sunset, cyberpunk aesthetic", type: "video" },
  { id: "2", text: "Close-up portrait of a mechanical owl, neon glowing eyes", type: "image" },
  { id: "3", text: "Cinematic shot of a runner crossing a rainy bridge", type: "video" },
];

export function Features() {
  // Playground 1: Queue Reorder
  const [prompts, setPrompts] = useState<PromptItem[]>(initialPrompts);
  const movePrompt = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= prompts.length) return;
    const newPrompts = [...prompts];
    const temp = newPrompts[index];
    newPrompts[index] = newPrompts[nextIndex];
    newPrompts[nextIndex] = temp;
    setPrompts(newPrompts);
  };

  // Playground 2: Dual Mode Switch
  const [activeMode, setActiveMode] = useState<"api" | "dom">("api");
  const [typingText, setTypingText] = useState("");
  useEffect(() => {
    if (activeMode === "dom") {
      let i = 0;
      const fullText = "A dramatic overhead shot of a mechanical forest...";
      setTypingText("");
      const timer = setInterval(() => {
        setTypingText((prev) => prev + fullText.charAt(i));
        i++;
        if (i >= fullText.length) {
          setTimeout(() => { i = 0; setTypingText(""); }, 1500);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [activeMode]);

  // Playground 3: Self-Healing System
  const [healingState, setHealingState] = useState<"error" | "recovering" | "success">("error");
  const handleRecover = () => {
    setHealingState("recovering");
    setTimeout(() => {
      setHealingState("success");
    }, 2000);
  };

  // Playground 4: Zero-Click Downloads
  const [downloading, setDownloading] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([]);
  const startDownloads = () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadedFiles([]);
    
    const files = ["cyberpunk-skyline-2026.mp4", "neon-owl-portrait.png", "rainy-bridge-runner.mp4"];
    files.forEach((file, index) => {
      setTimeout(() => {
        setDownloadedFiles((prev) => [...prev, file]);
        if (index === files.length - 1) {
          setDownloading(false);
        }
      }, (index + 1) * 1200);
    });
  };

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="features-header">
          <h2>Engineered for <span className="gradient-text">Uninterrupted Scale</span></h2>
          <p>Click through the interactive demos to see how Flow NextGen automates bulk AI generation.</p>
        </div>
        
        <div className="bento-grid">
          {/* Tile 1: The Queue Engine */}
          <motion.div 
            className="bento-item bento-queue glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bento-visual">
              <div className="interactive-queue-container">
                <span className="visual-badge">Interactive Playground</span>
                <div className="interactive-queue-list">
                  {prompts.map((prompt, index) => (
                    <motion.div 
                      key={prompt.id} 
                      layout
                      className="interactive-queue-item glass-card"
                    >
                      <div className="prompt-type-icon">
                        {prompt.type === "video" ? <FileVideo size={12} className="accent-text" /> : <FileImage size={12} className="success-text" />}
                      </div>
                      <span className="prompt-text-flow">{prompt.text}</span>
                      <div className="reorder-actions">
                        <button onClick={() => movePrompt(index, "up")} disabled={index === 0} className="reorder-btn" aria-label="Move queue item up">
                          <ChevronUp size={14} />
                        </button>
                        <button onClick={() => movePrompt(index, "down")} disabled={index === prompts.length - 1} className="reorder-btn" aria-label="Move queue item down">
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bento-content">
              <h3><ListChecks size={20} className="accent-text" /> 100+ Bulk Prompt Queues</h3>
              <p>Queue hundreds of prompts in seconds. Paste your list, reorder on the fly, and let the background queue process them while you focus on creative work.</p>
            </div>
          </motion.div>

          {/* Tile 2: Dual Mode Switch */}
          <motion.div 
            className="bento-item bento-dual glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bento-visual centered-visual">
              <div className="interactive-mode-container">
                <span className="visual-badge">Interactive Playground</span>
                <div className="mode-toggle-bar glass-card">
                  <button 
                    onClick={() => setActiveMode("api")} 
                    className={`mode-btn ${activeMode === "api" ? "active" : ""}`}
                  >
                    API MODE
                  </button>
                  <button 
                    onClick={() => setActiveMode("dom")} 
                    className={`mode-btn ${activeMode === "dom" ? "active" : ""}`}
                  >
                    DOM SIMULATION
                  </button>
                </div>

                <div className="mode-simulation-screen glass-panel">
                  {activeMode === "api" ? (
                    <div className="api-stream-log">
                      <div className="log-line success"><span className="success-text">[POST]</span> /v1/video/generate ... 200 OK</div>
                      <div className="log-line"><span className="accent-text">[INFO]</span> Queue position #1 active</div>
                      <div className="log-line"><span className="success-text">[SUCCESS]</span> Download token received</div>
                      <div className="log-line success"><span className="success-text">[POST]</span> /v1/video/generate ... 200 OK</div>
                      <span className="cursor-blink">|</span>
                    </div>
                  ) : (
                    <div className="dom-simulator">
                      <div className="sim-field">
                        <div className="sim-field-label">Target Prompt Field</div>
                        <div className="sim-text-box">{typingText}<span className="cursor-blink">|</span></div>
                      </div>
                      <div className="sim-mouse-action">
                        <motion.div 
                          className="sim-pointer"
                          animate={{ scale: [1, 0.9, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                        <span>Simulating clicks & entries</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bento-content">
              <h3><TerminalSquare size={20} className="accent-text" /> Hybrid API + DOM Simulation</h3>
              <p>Generate at maximum speed via direct API calls. When rate limits or errors hit, the engine auto-fallsback to DOM simulation - no manual switching required.</p>
            </div>
          </motion.div>

          {/* Tile 3: The Recovery Loop */}
          <motion.div 
            className="bento-item bento-recovery glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bento-visual centered-visual">
              <div className="interactive-healing-container">
                <span className="visual-badge">Interactive Playground</span>
                
                <AnimatePresence mode="wait">
                  {healingState === "error" && (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="healing-status-card error glass-card"
                    >
                      <AlertTriangle size={32} className="alert-text pulse-animation" />
                      <div className="healing-info">
                        <h4>LIMIT REACHED</h4>
                        <p>Rate limits hit on generation target</p>
                      </div>
                      <button onClick={handleRecover} className="heal-action-btn">
                        <RotateCcw size={12} /> Auto-Recover
                      </button>
                    </motion.div>
                  )}

                  {healingState === "recovering" && (
                    <motion.div 
                      key="recovering"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="healing-status-card recovering glass-card"
                    >
                      <RefreshCw size={32} className="accent-text rotate-animation" />
                      <div className="healing-info">
                        <h4>RECOVERY ACTIVE</h4>
                        <p>Cooling down & falling back to DOM mode</p>
                      </div>
                    </motion.div>
                  )}

                  {healingState === "success" && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="healing-status-card success glass-card"
                    >
                      <CheckCircle2 size={32} className="success-text" />
                      <div className="healing-info">
                        <h4>QUEUE RESUMED</h4>
                        <p>Continuing prompt queue smoothly</p>
                      </div>
                      <button onClick={() => setHealingState("error")} className="heal-reset-btn">Reset</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="bento-content">
              <h3><AlertTriangle size={20} className="accent-text" /> Self-Healing Error Recovery</h3>
              <p>Never wake up to a broken queue. If a rate limit or network error hits, Flow pauses, cools down, switches submit modes, and resumes without losing your progress.</p>
            </div>
          </motion.div>

          {/* Tile 4: Smart Local Downloader */}
          <motion.div 
            className="bento-item bento-gallery glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bento-visual">
              <div className="interactive-download-container">
                <span className="visual-badge">Interactive Playground</span>
                
                <div className="downloader-header">
                  <button onClick={startDownloads} disabled={downloading} className="download-trigger-btn btn-glow">
                    {downloading ? "Downloading..." : "Simulate Auto-Download"}
                  </button>
                </div>

                <div className="download-tray">
                  <div className="tray-folder">
                    <FolderDown size={20} className="success-text" />
                    <span>Local Output Folder</span>
                  </div>
                  <div className="downloaded-items-list">
                    <AnimatePresence>
                      {downloadedFiles.map((file, idx) => (
                        <motion.div 
                          key={file}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="downloaded-file-item glass-card"
                        >
                          <span className="file-number">#{idx+1}</span>
                          <span className="file-name-text">{file}</span>
                          <CheckCircle2 size={12} className="success-text" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
            <div className="bento-content">
              <h3><FolderDown size={20} className="accent-text" /> Auto-Download & Clean Renaming</h3>
              <p>Eliminate download exhaustion. Finished media is downloaded instantly and renamed using custom naming templates - prefix, date, index, or slug - keeping your output directory perfectly structured.</p>
            </div>
          </motion.div>

          {/* Tile 5: Native Characters & Flow Packets */}
          <motion.div 
            className="bento-item bento-characters glass-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bento-visual centered-visual">
              <div className="interactive-mode-container">
                <span className="visual-badge">Character & Packet Engine</span>
                <div className="mode-simulation-screen glass-panel" style={{ minHeight: "130px", justifyContent: "center" }}>
                  <div className="downloaded-items-list" style={{ gap: "8px" }}>
                    <div className="downloaded-file-item glass-card" style={{ borderLeft: "3px solid var(--accent-color)" }}>
                      <Users size={14} className="accent-text" />
                      <span className="file-name-text">@maya Cyberpunk Navigator</span>
                      <span className="visual-badge" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>CHIP BOUND</span>
                    </div>
                    <div className="downloaded-file-item glass-card" style={{ borderLeft: "3px solid #10b981" }}>
                      <Package size={14} className="success-text" />
                      <span className="file-name-text">cyberpunk_story_suite.json</span>
                      <span className="visual-badge" style={{ fontSize: "0.65rem", padding: "2px 6px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>PACKET EXPORTED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bento-content">
              <h3><Users size={20} className="accent-text" /> Native Character Consistency & Flow Packets</h3>
              <p>Bind @handle definitions to Google Flow's native character chips with intelligent fallback. Export or import full prompt suites and character definitions with 1-click Flow Packets.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}