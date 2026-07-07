import { useEffect, useState, useRef } from "react";
import { 
  Play, 
  Pause,
  Check, 
  Settings, 
  FolderDown, 
  Activity, 
  Compass,
  LayoutGrid,
  UserCheck,
  RotateCcw
} from "lucide-react";
import "./ExtensionMockup.css";

interface ExtensionMockupProps {
  phase: number; // 0 = Setup/Launch, 1 = Processing, 2 = Completed/Gallery
}

export function ExtensionMockup({ phase }: ExtensionMockupProps) {
  const [activeTab, setActiveTab] = useState<"launch" | "queue" | "gallery" | "config">("launch");
  const [isEngineActive, setIsEngineActive] = useState(true);
  const [progressVal, setProgressVal] = useState(35);
  const [logs, setLogs] = useState<string[]>([
    "[20:20:01] Flow NextGen initialized.",
    "[20:20:02] Synced with active Google Flow session.",
    "[20:20:03] Detected prompt list: 5 items found."
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Sync active tab to phase changes
  useEffect(() => {
    if (phase === 0) {
      setActiveTab("launch");
    } else if (phase === 1) {
      setActiveTab("queue");
    } else if (phase === 2) {
      setActiveTab("gallery");
    }
  }, [phase]);

  // Simulate active queue processing in Phase 1
  useEffect(() => {
    if (phase !== 1) return;
    
    const interval = setInterval(() => {
      setProgressVal((prev) => {
        const next = prev + Math.floor(Math.random() * 8 + 3);
        if (next >= 100) {
          const now = new Date().toLocaleTimeString("en-US", { hour12: false });
          setLogs((l) => [
            ...l,
            `[${now}] Job compiled successfully. Saved to Downloads/`
          ]);
          return 12;
        }
        return next;
      });
    }, 850);

    return () => clearInterval(interval);
  }, [phase]);

  // Auto-scroll logs
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="extension-popup glass-panel">
      {/* Top Header */}
      <div className="ext-header">
        <div className="ext-brand">
          <div className="ext-logo-icon">
            <span className="logo-dot-orange" />
            <span className="logo-dot-green" />
          </div>
          <div className="ext-title-group">
            <span className="ext-title">Flow<span className="accent-orange">NextGen</span></span>
            <span className="ext-version">v0.10.0</span>
          </div>
        </div>

        <div className="ext-toggle-area">
          <span className={`status-pill ${isEngineActive ? "active" : "inactive"}`}>
            {isEngineActive ? "CONNECTED" : "OFFLINE"}
          </span>
          <button 
            className={`ext-toggle-btn ${isEngineActive ? "on" : "off"}`}
            onClick={() => setIsEngineActive(!isEngineActive)}
            style={{ cursor: "pointer" }}
          >
            <span className="toggle-slider" />
          </button>
        </div>
      </div>

      {/* Tabs matching screenshots */}
      <div className="ext-tabs">
        <button 
          className={`tab-item ${activeTab === "launch" ? "active" : ""}`}
          onClick={() => setActiveTab("launch")}
        >
          <Compass size={12} />
          <span>Launch</span>
        </button>
        <button 
          className={`tab-item ${activeTab === "queue" ? "active" : ""}`}
          onClick={() => setActiveTab("queue")}
        >
          <Activity size={12} />
          <span>Queue</span>
        </button>
        <button 
          className={`tab-item ${activeTab === "gallery" ? "active" : ""}`}
          onClick={() => setActiveTab("gallery")}
        >
          <LayoutGrid size={12} />
          <span>Gallery</span>
        </button>
        <button 
          className={`tab-item ${activeTab === "config" ? "active" : ""}`}
          onClick={() => setActiveTab("config")}
        >
          <Settings size={12} />
          <span>Config</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="ext-body">
        
        {/* TAB 1: LAUNCH (Recreates Screen 5) */}
        {activeTab === "launch" && (
          <div className="tab-pane launch-pane">
            <div className="pane-title">LAUNCHER & CONFIG</div>
            <div className="launch-grid">
              <div className="launch-card-btn active">
                <span className="card-btn-title">IMAGE</span>
                <span className="card-btn-sub">Active Mode</span>
              </div>
              <div className="launch-card-btn">
                <span className="card-btn-title">PROMPTS</span>
                <span className="card-btn-sub">Batch List</span>
              </div>
              <div className="launch-card-btn">
                <span className="card-btn-title">CONTROL</span>
                <span className="card-btn-sub">Frame Ref</span>
              </div>
              <div className="launch-card-btn">
                <span className="card-btn-title">INGREDIENTS</span>
                <span className="card-btn-sub">Library Setup</span>
              </div>
            </div>
            
            <div className="launch-settings-box glass-card">
              <span className="box-section-lbl">AUTOMATION READY</span>
              <div className="bullet-row">
                <span className="bullet-dot" />
                <span>Google Flow Hook active</span>
              </div>
              <div className="bullet-row">
                <span className="bullet-dot" />
                <span>Veo AI model selected</span>
              </div>
            </div>

            <button className="launch-cta-btn pulse-orange-glow">
              <Play size={14} fill="currentColor" />
              <span>LAUNCH AUTOMATOR</span>
            </button>
          </div>
        )}

        {/* TAB 2: QUEUE (Recreates Screen 2) */}
        {activeTab === "queue" && (
          <div className="tab-pane queue-pane">
            <div className="pane-title">TASK LEDGER QUEUE</div>
            
            {/* Status bar */}
            <div className="queue-status-dashboard">
              <div className="q-stat">
                <span className="q-val monospace-accent">1</span>
                <span className="q-lbl">ACTIVE</span>
              </div>
              <div className="q-stat">
                <span className="q-val success-text">{phase === 2 ? 4 : 2}</span>
                <span className="q-lbl">SUCCEEDED</span>
              </div>
              <div className="q-stat">
                <span className="q-val">0</span>
                <span className="q-lbl">FAILED</span>
              </div>
              <div className="q-stat">
                <span className="q-val">18.4s</span>
                <span className="q-lbl">AVG TIME</span>
              </div>
            </div>

            {/* Sub-tabs header */}
            <div className="queue-sub-tabs">
              <span className="sub-tab-item active">QUEUE LIST</span>
              <span className="sub-tab-item">BATCH 07:27 PM</span>
            </div>

            {/* List of jobs */}
            <div className="active-tasks-list">
              <div className="task-row done">
                <div className="task-left">
                  <span className="check-badge done"><Check size={8} /></span>
                  <span className="task-desc">cyberpunk samurai in neonTokyo...</span>
                </div>
                <span className="task-time text-muted">18.4s</span>
              </div>
              <div className="task-row done">
                <div className="task-left">
                  <span className="check-badge done"><Check size={8} /></span>
                  <span className="task-desc">anime girl in cherry blossom...</span>
                </div>
                <span className="task-time text-muted">16.8s</span>
              </div>
              
              {phase === 2 ? (
                <>
                  <div className="task-row done">
                    <div className="task-left">
                      <span className="check-badge done"><Check size={8} /></span>
                      <span className="task-desc">futuristic city timelapse...</span>
                    </div>
                    <span className="task-time text-muted">19.2s</span>
                  </div>
                  <div className="task-row done">
                    <div className="task-left">
                      <span className="check-badge done"><Check size={8} /></span>
                      <span className="task-desc">astronaut in nebula space...</span>
                    </div>
                    <span className="task-time text-muted">17.5s</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="task-row running">
                    <div className="task-left">
                      <span className="running-spinner-mini" />
                      <span className="task-desc">futuristic city timelapse...</span>
                    </div>
                    <span className="task-time monospace-accent">{progressVal}%</span>
                  </div>
                  <div className="task-row pending">
                    <div className="task-left">
                      <span className="check-badge pending" />
                      <span className="task-desc text-muted">astronaut floating in deep...</span>
                    </div>
                    <span className="task-time text-muted">Queued</span>
                  </div>
                </>
              )}
            </div>

            {/* Interactive Pause/Resume btn */}
            <div className="queue-controls-row">
              <button className="q-control-btn glass-card">
                <Pause size={10} />
                <span>PAUSE</span>
              </button>
              <button className="q-control-btn glass-card">
                <RotateCcw size={10} />
                <span>RETRY FAIL</span>
              </button>
            </div>
            
            {/* Logs console */}
            <div className="log-console-wrap">
              <div className="log-console-header">SYSTEM ENGINE LOGS</div>
              <div className="log-console-body">
                {logs.map((log, i) => (
                  <div key={i} className="log-line">{log}</div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GALLERY (Recreates Screen 3 & 4) */}
        {activeTab === "gallery" && (
          <div className="tab-pane gallery-pane">
            <div className="pane-title">STUDIO GALLERY</div>
            <p className="pane-desc">Manage your generated images and videos.</p>
            
            {/* Filter buttons */}
            <div className="gallery-filters">
              <span className="g-filter active">ALL</span>
              <span className="g-filter">VIDEOS</span>
              <span className="g-filter">IMAGES</span>
              <span className="g-filter">GENERATING</span>
            </div>

            {/* Select action bar */}
            <div className="select-action-bar">
              <span className="select-label">Select All ({phase === 2 ? 4 : 2} files)</span>
              <button className="g-dl-all-btn">
                <FolderDown size={11} />
                <span>Zip Selected</span>
              </button>
            </div>

            {/* Small image thumbnails */}
            <div className="gallery-grid-thumbnails">
              {phase === 2 ? (
                <>
                  <div className="thumb-item"><img src="/result_samurai.jpg" alt="Samurai" /></div>
                  <div className="thumb-item"><img src="/result_anime.jpg" alt="Anime" /></div>
                  <div className="thumb-item"><img src="/result_city.jpg" alt="City" /></div>
                  <div className="thumb-item"><img src="/result_space.jpg" alt="Space" /></div>
                </>
              ) : (
                <>
                  <div className="thumb-item"><img src="/result_samurai.jpg" alt="Samurai" /></div>
                  <div className="thumb-item"><img src="/result_anime.jpg" alt="Anime" /></div>
                  <div className="thumb-item empty-thumb"><span className="running-spinner-mini" /></div>
                  <div className="thumb-item empty-thumb text-muted">?</div>
                </>
              )}
            </div>

            <button className="gallery-action-btn pulse-emerald-glow">
              <FolderDown size={14} />
              <span>DOWNLOAD BATCH ZIP</span>
            </button>
          </div>
        )}

        {/* TAB 4: CONFIG / SETTINGS (Recreates Screen 1) */}
        {activeTab === "config" && (
          <div className="tab-pane config-pane">
            <div className="pane-title">CONFIGURATION PANEL</div>
            <p className="pane-desc">Control center & synchronization settings.</p>

            <div className="config-card glass-card">
              <div className="config-row-group">
                <span className="config-lbl">ACTIVE ACCOUNT</span>
                <span className="config-val-text highlight-orange">harshad.flow.pro@gmail.com</span>
              </div>
              <div className="config-row-group">
                <span className="config-lbl">GENERATION QUOTA</span>
                <span className="config-val-text success-text">UNLIMITED (PRO PLAN)</span>
              </div>
            </div>

            <button className="config-action-btn glass-card">
              <UserCheck size={12} />
              <span>MANAGE SUBSCRIPTION</span>
            </button>

            <div className="settings-cogs-list">
              <div className="cog-row">
                <span>Auto Sync Outputs</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="cog-row">
                <span>Inject Custom UI overlay</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="cog-row">
                <span>Auto-Retry Failed generations</span>
                <input type="checkbox" defaultChecked />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="ext-footer">
        <span className="footer-left">Flow Companion v0.10.0</span>
        <span className="footer-right success-text">
          <span className="live-dot-pulse" />
          Active Sync
        </span>
      </div>
    </div>
  );
}
