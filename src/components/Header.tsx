import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import "./Header.css";

export function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const isActive = (path: string) => {
    if (path.startsWith('/')) return location.pathname === path;
    return false;
  };

  return (
    <div className={`header-wrapper ${isScrolled ? 'scrolled' : ''} ${!isVisible ? 'hidden-nav' : ''} ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <motion.header
        className={`dynamic-island ${isScrolled ? 'scrolled' : ''}`}
        animate={{
          y: isVisible ? 0 : -150,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.92,
          pointerEvents: isVisible ? "auto" : "none",
        }}
        initial={{ y: -150, opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.45, type: "spring", stiffness: 220, damping: 26 }}
      >
        <Link to="/" className="logo" aria-label="Flow NextGen, Home">
          <Logo width={20} height={20} />
          <span className="logo-text">Flow NextGen</span>
        </Link>

        <nav className="nav" aria-label="Main navigation">
          <a
            href="/#features"
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            Features
          </a>
          <Link
            to="/pricing"
            aria-current={isActive('/pricing') ? 'page' : undefined}
          >
            Pricing
          </Link>
          <a
            href="/#how-it-works"
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            How it Works
          </a>
          <a
            href="/#faq"
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            FAQ
          </a>
          <Link
            to="/guide"
            aria-current={isActive('/guide') ? 'page' : undefined}
          >
            Guide
          </Link>
          <a
            href="https://chromewebstore.google.com/detail/flow-nextgen/opobokhfcoacjegnhjmkncbabpdlgond/reviews"
            target="_blank"
            rel="noopener noreferrer"
          >
            Review
          </a>
        </nav>

        <div className="header-actions" style={{ gap: '0.5rem' }}>
          <a
            href="https://discord.gg/vk5wWWun9B"
            target="_blank"
            rel="noopener noreferrer"
            className="button-secondary discord-btn"
            aria-label="Discord (opens in new tab)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              textDecoration: 'none',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.205.073.073 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.369a.07.07 0 0 0-.032.054C1.483 8.073.72 11.68.998 15.235a.074.074 0 0 0 .028.056 19.9 19.9 0 0 0 4.08 2.249.231.231 0 0 0 .08-.026c.315-.43.596-.886.837-1.362a.072.072 0 0 0-.039-.1 13.12 13.12 0 0 1-1.276-.6.076.076 0 0 1-.014-.122l.255-.2a.073.073 0 0 1 .071-.013 18.938 18.938 0 0 0 9.564 0 .073.073 0 0 1 .071.013l.255.2a.076.076 0 0 1-.014.122 12.63 12.63 0 0 1-1.276.6.072.072 0 0 0-.039.1c.165.59.522 1.137.837 1.362a.073.073 0 0 0 .08.026 19.9 19.9 0 0 0 4.08-2.249.17.17 0 0 0 .028-.056c.329-4.088-.577-7.679-2.238-10.814a.066.066 0 0 0-.033-.05zM8.66 13.013c-.795 0-1.448-.728-1.448-1.62 0-.89.635-1.62 1.448-1.62.812 0 1.465.73 1.447 1.62 0 .892-.635 1.62-1.447 1.62zm6.678 0c-.795 0-1.447-.728-1.447-1.62 0-.89.634-1.62 1.447-1.62s1.465.73 1.447 1.62c0 .892-.634 1.62-1.447 1.62z"/>
            </svg>
            Discord
          </a>
          <button className="button-primary island-btn">Get Extension</button>
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </motion.header>

      {/* Mobile navigation menu */}
      <nav
        id="mobile-nav-menu"
        className="mobile-nav"
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
      >
        <a
          href="/#features"
          onClick={() => setMobileMenuOpen(false)}
          aria-current={location.pathname === '/' ? 'page' : undefined}
        >
          Features
        </a>
        <Link
          to="/pricing"
          onClick={() => setMobileMenuOpen(false)}
          aria-current={isActive('/pricing') ? 'page' : undefined}
        >
          Pricing
        </Link>
        <a
          href="/#how-it-works"
          onClick={() => setMobileMenuOpen(false)}
          aria-current={location.pathname === '/' ? 'page' : undefined}
        >
          How it Works
        </a>
        <a
          href="/#faq"
          onClick={() => setMobileMenuOpen(false)}
          aria-current={location.pathname === '/' ? 'page' : undefined}
        >
          FAQ
        </a>
        <Link
          to="/guide"
          onClick={() => setMobileMenuOpen(false)}
          aria-current={isActive('/guide') ? 'page' : undefined}
        >
          Guide
        </Link>
        <a
          href="https://chromewebstore.google.com/detail/flow-nextgen/opobokhfcoacjegnhjmkncbabpdlgond/reviews"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileMenuOpen(false)}
        >
          Review
        </a>
      </nav>
    </div>
  );
}
