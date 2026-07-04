import { motion } from "motion/react";
import type { ReactNode } from "react";
import "./ShinyButton.css";

interface ShinyButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ShinyButton({ children, className = "", onClick }: ShinyButtonProps) {
  return (
    <motion.button 
      className={`shiny-btn ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <span className="shiny-text">{children}</span>
      <div className="shiny-shimmer"></div>
      <div className="shiny-glow"></div>
    </motion.button>
  );
}
