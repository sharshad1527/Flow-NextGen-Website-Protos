import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import "./Header.css";

export function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  // Hidden during logo intro — show only after user scrolls past logo phase.
  // Logo ends at ~20% of the 400vh scroll track → about 0.20 * 400vh = 80vh.
  // Using 60 as a safe low threshold so the nav appears right as logo fades.
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
    // Logo fades out at ~26% of 400vh journey ≈ 1× viewport height of scroll
    setIsVisible(latest > window.innerHeight * 0.95);
  });

  return (
    <div className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <motion.header
        className={`dynamic-island ${isScrolled ? 'scrolled' : ''}`}
        animate={{
          y: isVisible ? 0 : -64,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.92,
          pointerEvents: isVisible ? "auto" : "none",
        }}
        initial={{ y: -64, opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.45, type: "spring", stiffness: 220, damping: 26 }}
      >
        <Link to="/" className="logo">
          <Logo width={20} height={20} />
          <span className="logo-text">Flow NextGen</span>
        </Link>

        <nav className="nav">
          <a href="/#features">Features</a>
          <Link to="/pricing">Pricing</Link>
          <a href="/#how-it-works">How it Works</a>
        </nav>

        <div className="header-actions">
          <button className="button-primary island-btn">Get Extension</button>
        </div>
      </motion.header>
    </div>
  );
}
