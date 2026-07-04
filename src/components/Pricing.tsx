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
            <h2>Simple, <span className="gradient-text">Transparent</span> Pricing</h2>
            <p>Choose the automation engine that fits your workflow.</p>
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
              <p>For casual creators testing the waters.</p>
            </div>
            
            <div className="divider"></div>

            <ul className="feature-list">
              <li><Check size={16} className="accent-text" /> DOM Simulation Mode</li>
              <li><Check size={16} className="accent-text" /> Limited Queue (Up to 10 prompts)</li>
              <li><Check size={16} className="accent-text" /> Basic Gallery Management</li>
              <li className="disabled-feature"><X size={16} /> API-First Generation</li>
              <li className="disabled-feature"><X size={16} /> Auto-Recovery Engine</li>
              <li className="disabled-feature"><X size={16} /> Unlimited Batching</li>
              <li className="disabled-feature"><X size={16} /> Priority Support</li>
            </ul>

            <button className="button-secondary full-width">Current Plan</button>
          </motion.div>

          {/* Pro Tier */}
          <motion.div 
            className="pricing-card pro-card glass-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="pro-badge">RECOMMENDED</div>
            <div className="tier-header">
              <h3>Pro</h3>
              <div className="price">
                <span className="amount">$9.99</span>
                <span className="period">/month</span>
              </div>
              <p>For power-users demanding full automation.</p>
            </div>
            
            <div className="divider"></div>

            <ul className="feature-list">
              <li><Check size={16} className="success-text" /> API-First Generation Mode</li>
              <li><Check size={16} className="success-text" /> Unlimited Batch Queue</li>
              <li><Check size={16} className="success-text" /> Auto-Recovery Engine</li>
              <li><Check size={16} className="success-text" /> Background Downloading</li>
              <li><Check size={16} className="success-text" /> Advanced Gallery & Metadata</li>
              <li><Check size={16} className="success-text" /> Scene Builder Access</li>
              <li><Check size={16} className="success-text" /> Priority Support</li>
            </ul>

            <button className="button-primary full-width btn-glow">Upgrade to Pro</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
