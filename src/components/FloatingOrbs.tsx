import { motion } from "motion/react";
import "./FloatingOrbs.css";

export function FloatingOrbs() {
  return (
    <div className="bg-effects-container">
      {/* Architectural Grid */}
      <div className="bg-grid"></div>
      
      {/* Premium Ambient Glows - Massive Movement */}
      <motion.div 
        className="premium-glow glow-orange"
        animate={{ 
          x: [0, 150, -100, 50, 0],
          y: [0, -100, 150, -50, 0],
          scale: [1, 1.3, 0.8, 1.2, 1],
          opacity: [0.3, 0.6, 0.3, 0.5, 0.3]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="premium-glow glow-emerald"
        animate={{ 
          x: [0, -150, 100, -50, 0],
          y: [0, 150, -100, 80, 0],
          scale: [1, 0.8, 1.4, 0.9, 1],
          opacity: [0.2, 0.5, 0.2, 0.4, 0.2]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
