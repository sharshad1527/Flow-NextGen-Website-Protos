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
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="/pricing">Pricing</a>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <a href="#how-it-works">How It Works</a>
            </div>
            <div className="link-group">
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/refund">Refund Policy</Link>
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
