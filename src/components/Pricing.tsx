import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import "./Pricing.css";

export function Pricing() {
  return (
    <div className="pricing-page-container">
      <div className="container">
        <div className="pricing-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Buy Back Your <span className="gradient-text">Creative Hours</span></h2>
            <p>Simple, transparent plans to stop babysitting generation queues.</p>
          </motion.div>
        </div>

        <div className="pricing-grid">
          {/* Free Tier */}
          <motion.div 
            className="pricing-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="tier-header">
              <h3>Free</h3>
              <div className="price">
                <span className="amount">$0</span>
                <span className="period">/forever</span>
              </div>
              <p>Test the waters and try background automation.</p>
            </div>
            
            <div className="divider"></div>

            <ul className="feature-list">
              <li><Check size={16} className="accent-text" /> DOM Simulation Mode</li>
              <li><Check size={16} className="accent-text" /> 30 prompts per 6 hours</li>
              <li><Check size={16} className="accent-text" /> Basic Gallery</li>
              <li className="disabled-feature"><X size={16} /> API-First Generation</li>
              <li className="disabled-feature"><X size={16} /> Auto-Download & Smart Naming</li>
              <li className="disabled-feature"><X size={16} /> Unlimited Queue</li>
              <li className="disabled-feature"><X size={16} /> 4K Upscale & Downloads</li>
            </ul>

            <button className="button-secondary full-width">Get Started Free</button>
          </motion.div>

          {/* Pro Tier */}
          <motion.div 
            className="pricing-card pro-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="pro-badge">POPULAR</div>
            <div className="tier-header">
              <h3>Pro</h3>
              <div className="price">
                <span className="amount">$9.99</span>
                <span className="period">/month</span>
              </div>
              <p>For power creators and agencies scaling production.</p>
            </div>
            
            <div className="divider"></div>

            <ul className="feature-list">
              <li><Check size={16} className="success-text" /> API Mode + DOM auto-fallback</li>
              <li><Check size={16} className="success-text" /> Unlimited Queue</li>
              <li><Check size={16} className="success-text" /> Auto-Download & Smart Naming</li>
              <li><Check size={16} className="success-text" /> 2K/4K Upscale & Downloads</li>
              <li><Check size={16} className="success-text" /> Advanced Gallery & Metadata</li>
              <li><Check size={16} className="success-text" /> Scene Builder access</li>
              <li><Check size={16} className="success-text" /> Priority Developer Support</li>
            </ul>

            <button className="button-primary full-width btn-glow">Unlock Autopilot Generation</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
