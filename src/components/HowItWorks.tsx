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
      title: "1. Load Bulk Prompts",
      subtitle: "Import Spreadsheets & Variables",
      description: "Import your prompt sheet directly. Inject dynamic variables and formulas to generate hundreds of highly-targeted variations with a single paste.",
      colorClass: "accent-text",
      detailsList: [
        "One-click CSV & Excel import",
        "Dynamic variable injection ({keyword})",
        "Bulk text copy-paste parsing",
      ]
    },
    {
      id: 2,
      icon: <Settings size={24} />,
      title: "2. Define Your Output Rules",
      subtitle: "Select Models & Modes",
      description: "Select your preferred generation models, enforce strict character seeds for absolute visual consistency, and choose API mode or human-like DOM simulation.",
      colorClass: "accent-text",
      detailsList: [
        "Cross-model override toggles",
        "Hybrid API & DOM mode triggers",
        "Strict character seed locking",
      ]
    },
    {
      id: 3,
      icon: <Play size={24} />,
      title: "3. Run on Autopilot",
      subtitle: "Background Automation Engine",
      description: "Hit start and switch tabs. The background extension logs in, processes the queue, handles site re-authentications, and manages rate limits entirely hands-free.",
      colorClass: "accent-text",
      detailsList: [
        "Humanized click & typing delays",
        "Auto-recovery for 429 rate limits",
        "Tab-independent background execution",
      ]
    },
    {
      id: 4,
      icon: <DownloadCloud size={24} />,
      title: "4. Auto-Download & Clean Renaming",
      subtitle: "Zero Manual File Management",
      description: "Generated videos and images are auto-downloaded to your computer on completion, automatically renamed based on prompt metadata so you never have messy folder names.",
      colorClass: "success-text",
      detailsList: [
        "Zero-click background download routing",
        "Custom naming formulas (using prompt vars)",
        "Clean format tags and index organization",
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
