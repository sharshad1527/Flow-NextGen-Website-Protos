import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import "./Header.css";

export function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const t = setTimeout(() => {
      const currentScroll = window.scrollY;
      const totalTrackScroll = 3 * window.innerHeight;
      const p = currentScroll / totalTrackScroll;
      
      if (isHomePage && p >= 0.22 && p < 0.64) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }, 2200);
    return () => clearTimeout(t);
  }, [isHomePage]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
    if (isHomePage) {
      const totalTrackScroll = 3 * window.innerHeight;
      const p = latest / totalTrackScroll;
      if (p >= 0.22 && p < 0.64) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
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
