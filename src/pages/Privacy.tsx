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
        <p className="legal-date">Last updated: July 26, 2026</p>

        <section>
          <h2>1. Data Controller</h2>
          <p>Flow NextGen ("we", "us", or "our") operates the Flow NextGen Chrome extension and website. We are committed to protecting your privacy. For any data protection inquiries, contact us at <strong>support.flownextgen@gmail.com</strong>.</p>
        </section>

        <section>
          <h2>2. Chrome Extension Permissions & Justifications</h2>
          <p>Our Chrome extension requests specific permissions under Chrome's Manifest V3 to enable workflow automation on Google Labs Flow. We adhere strictly to data minimization principles; every permission is dedicated to a specific user-facing feature:</p>
          
          <h3>Core System Permissions</h3>
          <ul>
            <li><strong>Debugger (`debugger`):</strong> Highly sensitive. Used exclusively to attach the Chrome DevTools Protocol (CDP) to the active <code>labs.google.com</code> tab. This allows the extension's background worker to trace generation network requests, manage token cache states, and bypass service workers during critical session crashes to recover frozen queues. No user browsing outside of Google Labs Flow is ever captured or debugged.</li>
            <li><strong>Storage & Unlimited Storage (`storage`, `unlimitedStorage`):</strong> Enables the extension to save your preferences, queue configuration templates, generation logs, and output metadata locally. Unlimited storage is requested to prevent data loss when handling deep historical generation galleries.</li>
            <li><strong>Scripting (`scripting`) & Content Scripts:</strong> Used to inject the automation overlay panel and helper page hooks directly into the context of Google Labs Flow pages to coordinate button clicks and form inputs.</li>
            <li><strong>Cookies (`cookies`):</strong> Used to monitor and manage session state for <code>labs.google.com</code>. This helps clear corrupted local cached tokens that cause generation failures during queue orchestrations.</li>
            <li><strong>Browsing Data (`browsingData`):</strong> Restricts clearing of cache and local website state specifically for Google Labs domains to assist in session recovery cycles.</li>
            <li><strong>Downloads (`downloads`):</strong> Power the auto-download feature, saving completed generations directly to your browser's default downloads directory utilizing custom metadata-based filenames.</li>
            <li><strong>Tabs & Active Tab (`tabs`, `activeTab`):</strong> Used to track tab loading states and determine when a user is navigating Google Labs Flow tabs so automation scripting is safely initialized.</li>
            <li><strong>Side Panel (`sidePanel`):</strong> Provides a persistent sidepanel UI to monitor batch queues and review generation history side-by-side with the active creation canvas.</li>
            <li><strong>Alarms (`alarms`):</strong> Schedules recurring background worker wake-ups to check queue progress and retry failed generations.</li>
            <li><strong>Identity (`identity`):</strong> Used for optional extension configuration sync features across chrome profiles.</li>
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
          <h2>3. Account & Subscription Data</h2>
          <h3>Email & Authentication</h3>
          <p>You sign in using a passwordless one-time code emailed to you. Your email address and unique user identifier are stored in our secure database hosted by Supabase. This is processed solely to verify your membership credentials and tier limits.</p>

          <h3>Billing & Payment Data</h3>
          <p>We do not collect, process, or store financial credentials. All subscription purchases are conducted through our online reseller and Merchant of Record, Paddle.com. Credit card numbers, billing addresses, and payment details are processed directly by Paddle under their own privacy policy.</p>
        </section>

        <section>
          <h2>4. Google API Services Limited Use Disclosure</h2>
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
          <h2>5. GDPR and CCPA Disclosures</h2>
          <h3>European Union GDPR Rights</h3>
          <p>If you reside in the EEA/UK, under the General Data Protection Regulation you have the right to request access to, correction of, or erasure of your email data stored in Supabase. You are also entitled to object to data processing or withdraw your consent. All requests can be sent to our support email.</p>

          <h3>California CCPA Compliance</h3>
          <p>We do not "sell" or "share" personal information as defined by the California Consumer Privacy Act. We solely collect your email for account delivery and subscription status management (Service Provider model).</p>
        </section>

        <section>
          <h2>6. Data Security & Retention</h2>
          <p>We implement encryption in transit (HTTPS/TLS) for all web communications and rely on industry-standard hosting security provided by Supabase. Your email records are retained until you delete your account. Local extension data (diagnostics, templates, queue history) stays on your machine and is deleted when you uninstall the extension or clear browser storage.</p>
        </section>

        <section>
          <h2>7. Contact Support</h2>
          <p>For inquiries, deletion requests, or technical support, please contact us at:</p>
          <p><strong>support.flownextgen@gmail.com</strong></p>
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
