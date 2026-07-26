import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ListChecks, Settings, Play, DownloadCloud } from "lucide-react";
import "./HowItWorks.css";

interface StepItem {
  id: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  colorClass: string;
  detailsList: string[];
}

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps: StepItem[] = [
    {
      id: 1,
      icon: <ListChecks size={24} />,
      title: "1. Upload Your Prompt Sheet",
      subtitle: "Import Sheets & Dynamic Variables",
      description: "Paste your raw prompts or drag in a CSV/Excel sheet. Inject dynamic variables like {keyword} or {subject} to auto-generate hundreds of unique prompt permutations instantly.",
      colorClass: "accent-text",
      detailsList: [
        "Instant CSV & Excel file upload",
        "Multi-variable dynamic replacement",
        "Raw copy-paste plain text parsing",
      ]
    },
    {
      id: 2,
      icon: <Settings size={24} />,
      title: "2. Set Your Output Specifications",
      subtitle: "Lock seeds, models, and modes",
      description: "Specify your desired models, lock strict character seeds to ensure visual continuity across your series, and choose between API acceleration or humanized DOM simulation.",
      colorClass: "accent-text",
      detailsList: [
        "Cross-platform seed locking",
        "API speed vs. DOM stealth toggle",
        "Aspect ratio & upscale presets",
      ]
    },
    {
      id: 3,
      icon: <Play size={24} />,
      title: "3. Run on Total Autopilot",
      subtitle: "Background Automation Engine",
      description: "Hit start and let the extension do the rest. It logs in, handles rate limit cooldowns, rotates proxy details, and processes the queue in a background tab while you work elsewhere.",
      colorClass: "accent-text",
      detailsList: [
        "Humanized mouse/key simulation",
        "Active proxy-rotation security",
        "Tab-independent background work",
      ]
    },
    {
      id: 4,
      icon: <DownloadCloud size={24} />,
      title: "4. Auto-Download & Rename Output",
      subtitle: "Zero Manual File Management",
      description: "Every generated image or video downloads automatically as it finishes. Files are instantly renamed using your prompt variables and formulas for perfectly organized output.",
      colorClass: "success-text",
      detailsList: [
        "Zero-click background downloading",
        "Keyword-based smart renaming",
        "Time-stamped folder structures",
      ]
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="hiw-header">
          <h2>How it <span className="gradient-text">Works</span></h2>
          <p>Four steps to total bulk automation.</p>
        </div>

        <div className="hiw-drawer-container">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <motion.div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`step-drawer-card glass-card ${isActive ? "active" : ""}`}
                layout
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <div className="drawer-header-row">
                  <div className="drawer-index-badge">{step.id}</div>
                  <div className={`drawer-icon ${isActive ? step.colorClass : ""}`}>
                    {step.icon}
                  </div>
                  <div className="drawer-title-group">
                    <h4>{step.title}</h4>
                    {!isActive && <span className="drawer-collapsed-sub">{step.subtitle}</span>}
                  </div>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="drawer-expanded-content"
                    >
                      <div className="drawer-divider"></div>
                      <p className="drawer-desc">{step.description}</p>
                      
                      <div className="drawer-details-box">
                        <span className="details-header">Included Features:</span>
                        <ul className="drawer-features-list">
                          {step.detailsList.map((item, i) => (
                            <li key={i}>
                              <span className="dot-bullet"></span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
