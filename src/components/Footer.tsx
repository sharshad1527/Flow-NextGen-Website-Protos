import { Link } from "react-router-dom";
import "./Footer.css";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">
                <Logo width={20} height={20} />
              </div>
              <span className="logo-text">Flow NextGen</span>
            </div>
            <p>Autopilot generation queue engine for modern creative teams.</p>
          </div>
          <div className="footer-links" role="navigation" aria-label="Footer navigation">
            <div className="link-group">
              <h4 id="footer-product">Product</h4>
              <a href="#features" aria-labelledby="footer-product">Features</a>
              <a href="/pricing" aria-labelledby="footer-product">Pricing</a>
            </div>
            <div className="link-group">
              <h4 id="footer-resources">Resources</h4>
              <a href="#how-it-works" aria-labelledby="footer-resources">How It Works</a>
              <Link to="/guide" aria-labelledby="footer-resources">Guide</Link>
              <a href="https://discord.gg/vk5wWWun9B" target="_blank" rel="noopener noreferrer" aria-labelledby="footer-resources">Discord Community</a>
            </div>
            <div className="link-group">
              <h4 id="footer-legal">Legal</h4>
              <Link to="/privacy" aria-labelledby="footer-legal">Privacy Policy</Link>
              <Link to="/terms" aria-labelledby="footer-legal">Terms of Service</Link>
              <Link to="/refund" aria-labelledby="footer-legal">Refund Policy</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Flow NextGen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
