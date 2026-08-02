import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import "./Legal.css";

export function Privacy() {
  return (
    <div className="legal-page">
      <SEO
        title="Privacy Policy"
        description="Flow NextGen privacy policy: how we collect, use, and protect your data when using our Chrome extension."
        canonicalPath="/privacy"
      />
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="legal-date">Last updated: August 2, 2026</p>

        <section>
          <h2>1. Information We Collect</h2>
          <p><strong>Account Information:</strong> When you sign in to Flow NextGen, we collect your email address via our authentication provider (Supabase). This is used to identify your account, sync your subscription tier, and manage your Pro access.</p>
          <p><strong>Usage Data:</strong> We store your queue settings, prompt history, download preferences, and usage counters (e.g., prompts used per day) locally in your browser and synced to your account to enforce fair-use quotas and provide the Pro features you paid for.</p>
          <p><strong>Payment Information:</strong> We do <strong>not</strong> collect, process, or store credit card numbers, billing addresses, or any financial credentials. All subscription purchases are conducted through our Merchant of Record, Dodo Payments (dodopayments.com).</p>
        </section>

        <section>
          <h2>2. Chrome Extension Permissions & Justifications</h2>
          <p>Our Chrome extension requests specific permissions under Chrome's Manifest V3 to enable workflow automation on Google Labs Flow. We adhere strictly to data minimization principles; every permission is dedicated to a specific user-facing feature:</p>
          
          <h3>Core System Permissions</h3>
          <ul>
            <li><strong>Debugger (<code>debugger</code>):</strong> Highly sensitive. Used exclusively to attach the Chrome DevTools Protocol (CDP) to the active <code>labs.google.com</code> tab. This allows the extension's background worker to trace generation network requests, manage token cache states, and bypass service workers during critical session crashes to recover frozen queues. No user browsing outside of Google Labs Flow is ever captured or debugged.</li>
            <li><strong>Storage & Unlimited Storage (<code>storage</code>, <code>unlimitedStorage</code>):</strong> Enables the extension to save your preferences, queue configuration templates, generation logs, and output metadata locally. Unlimited storage is requested to prevent data loss when handling deep historical generation galleries.</li>
            <li><strong>Scripting (<code>scripting</code>) & Content Scripts:</strong> Used to inject the automation overlay panel and helper page hooks directly into the context of Google Labs Flow pages to coordinate button clicks and form inputs.</li>
            <li><strong>Cookies (<code>cookies</code>):</strong> Used to monitor and manage session state for <code>labs.google.com</code>. This helps clear corrupted local cached tokens that cause generation failures during queue orchestrations.</li>
            <li><strong>Browsing Data (<code>browsingData</code>):</strong> Restricts clearing of cache and local website state specifically for Google Labs domains to assist in session recovery cycles.</li>
            <li><strong>Downloads (<code>downloads</code>):</strong> Power the auto-download feature, saving completed generations directly to your browser's default downloads directory utilizing custom metadata-based filenames.</li>
            <li><strong>Tabs & Active Tab (<code>tabs</code>, <code>activeTab</code>):</strong> Used to track tab loading states and determine when a user is navigating Google Labs Flow tabs so automation scripting is safely initialized.</li>
            <li><strong>Side Panel (<code>sidePanel</code>):</strong> Provides a persistent sidepanel UI to monitor batch queues and review generation history side-by-side with the active creation canvas.</li>
            <li><strong>Alarms (<code>alarms</code>):</strong> Schedules recurring background worker wake-ups to check queue progress and retry failed generations.</li>
            <li><strong>Identity (<code>identity</code>):</strong> Used for optional extension configuration sync features across chrome profiles.</li>
          </ul>

          <h3>Host Permissions & Domains Accessed</h3>
          <p>We declare and limit host access to the following domains:</p>
          <ul>
            <li><code>https://labs.google/*</code> and subdomains: To run automation control scripts and read generation UI states.</li>
            <li><code>https://aisandbox-pa.googleapis.com/*</code>: Google's backend API endpoints for generating and retrieving assets.</li>
            <li><code>https://*.supabase.co/*</code>: Secure communication with our user subscription and log-in infrastructure.</li>
          </ul>
        </section>

        <section>
          <h2>3. How Payment Data Is Handled</h2>
          <p>All subscription purchases and payment processing are handled by <strong>Dodo Payments</strong> (dodopayments.com), our online reseller and Merchant of Record. When you subscribe, your payment details are provided directly to Dodo Payments, which processes them under its own privacy policy. We never see or store your full card number, CVV, or billing address.</p>
          <p>Dodo Payments' privacy policy applies to the payment data you provide them: <a href="https://dodopayments.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://dodopayments.com/legal/privacy-policy</a></p>
        </section>

        <section>
          <h2>4. How We Use Your Information</h2>
          <ul>
            <li>To provide, maintain, and improve the Flow NextGen extension and website</li>
            <li>To authenticate your account and sync your Free/Pro tier status</li>
            <li>To enforce fair-use quotas (e.g., 30 prompts per 6-hour window on Free)</li>
            <li>To communicate with you about your subscription, billing, or support requests</li>
          </ul>
        </section>

        <section>
          <h2>5. Google API Services Limited Use Disclosure</h2>
          <p>Flow NextGen's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>, including the Limited Use requirements:</p>
          <div className="legal-highlight">
            <ul>
              <li><strong>User-Facing Features:</strong> Data access is strictly limited to providing and improving the core prompt automation, queue management, and media export controls visible in the user interface.</li>
              <li><strong>No Data Transfers:</strong> We do not sell, rent, or transfer user data to third parties, advertising networks, or analytics brokers. Transfers only occur for security compliance, legal mandates, or business acquisitions.</li>
              <li><strong>Advertising Prohibition:</strong> Your user data is never used, transferred, or analyzed to serve advertisements, profile demographics, or target promotional materials.</li>
              <li><strong>Human Reading Ban:</strong> No human supervisor reads or monitors your prompts, cookies, or page content except in rare cases where you grant explicit consent for debugging support, or under strict security investigations.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>6. Data Sharing</h2>
          <p>We do not sell your personal data. We share data only with the service providers required to operate the product:</p>
          <ul>
            <li><strong>Supabase</strong> — account authentication, profile storage, and subscription state</li>
            <li><strong>Dodo Payments</strong> — payment processing, subscription billing, refunds (as Merchant of Record)</li>
          </ul>
        </section>

        <section>
          <h2>7. Data Retention & Deletion</h2>
          <p>We retain your account data while your account is active. You may request deletion of your account and associated data at any time by contacting us at <strong>flownextgen-support@googlegroups.com</strong>. Payment records are retained by Dodo Payments as required by applicable tax and financial regulations.</p>
        </section>

        <section>
          <h2>8. Your Rights</h2>
          <p>Depending on your jurisdiction (including GDPR in the EEA/UK), you may have rights to access, correct, export, or delete your personal data. To exercise these rights, contact us at <strong>flownextgen-support@googlegroups.com</strong>.</p>
        </section>

        <section>
          <h2>9. Contact</h2>
          <p>For privacy questions, contact us at <strong>flownextgen-support@googlegroups.com</strong>.</p>
        </section>

        <div className="legal-nav-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/refund">Refund Policy</Link>
        </div>
      </div>
    </div>
  );
}
