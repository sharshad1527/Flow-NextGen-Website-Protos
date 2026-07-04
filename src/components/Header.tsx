import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import "./Header.css";

export function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <div className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <motion.header 
        className={`dynamic-island ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
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
