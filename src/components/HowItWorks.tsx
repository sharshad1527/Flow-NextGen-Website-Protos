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
      title: "1. Paste Your Prompts",
      subtitle: "Plain Text or Scene Builder",
      description: "Open the side panel on any Google Flow page. Paste your prompts, define @handle character rules, or import a 1-click Flow Packet. The engine auto-detects each block as a separate generation task.",
      colorClass: "accent-text",
      detailsList: [
        "Plain text paste or 1-click Flow Packet import",
        "@handle character syntax support",
        "Engine model selector per mode"
      ]
    },
    {
      id: 2,
      icon: <Settings size={24} />,
      title: "2. Configure Mode & Settings",
      subtitle: "Choose your generation parameters",
      description: "Select your generation mode (Image, Video, Frame, or Ingredients), pick the AI model, set aspect ratio, number of outputs per prompt, and choose your submit path - API-first for speed or DOM simulation for reliability.",
      colorClass: "accent-text",
      detailsList: [
        "4 generation modes: Image, Video, Frame, Ingredients",
        "Model selection: Veo 3.1, Omni Flash, Nano Banana Pro",
        "API-first or DOM simulation submit path"
      ]
    },
    {
      id: 3,
      icon: <Play size={24} />,
      title: "3. Run on Total Autopilot",
      subtitle: "Hands-Free Queue Processing",
      description: "Hit launch and walk away. The extension submits each prompt, handles rate limits, retries failures with intelligent recovery, and processes the entire queue in the background - while you work on something else.",
      colorClass: "accent-text",
      detailsList: [
        "Background queue - independent of your active tab",
        "Automatic retry with self-healing recovery",
        "50+ classified failure types with tiered responses"
      ]
    },
    {
      id: 4,
      icon: <DownloadCloud size={24} />,
      title: "4. Auto-Download & Rename Output",
      subtitle: "Zero Manual File Management",
      description: "Every generated image or video downloads automatically as it finishes. Files are named using your custom template - prefix, date, index, or slug - and organized into timestamped folders.",
      colorClass: "success-text",
      detailsList: [
        "Zero-click background downloading",
        "Custom naming templates: prefix, date, index, slug, random",
        "Organized folder structures with auto-numbering"
      ]
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="hiw-header">
          <h2>How it <span className="gradient-text">Works</span></h2>
          <p>Four steps to hands-free bulk generation.</p>
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
