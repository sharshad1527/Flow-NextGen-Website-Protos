import { Link } from "react-router-dom";
import "./Legal.css";

export function Privacy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="legal-date">Last updated: July 26, 2026</p>

        <section>
          <h2>What This Covers</h2>
          <p>Flow NextGen is a Chrome extension for Google Labs Flow. It automates prompt submission, batch scheduling, and media downloads. This policy covers what information the extension collects, why, and where it goes.</p>
        </section>

        <section>
          <h2>Information We Collect</h2>

          <h3>Email address</h3>
          <p>You sign in with your email via a one-time code — no password. Your email is stored in Supabase (our backend) and in your browser's local extension storage so the extension recognizes you when you return. Used for authentication, subscription management, and transactional emails.</p>

          <h3>Extension settings</h3>
          <p>Every setting you configure — prompt templates, model selection, aspect ratio, queue configuration — is saved locally in your browser's extension storage. Nothing is sent anywhere else.</p>

          <h3>Queue and generation history</h3>
          <p>When you queue a batch, the extension stores your prompts, generation mode, model choice, and output references locally. This allows the queue to survive browser restarts. Binary image data is removed before storage, and long strings are truncated.</p>

          <h3>Authentication (Two Separate Systems)</h3>
          <p><strong>Flow NextGen account (Supabase).</strong> When you sign in via the one-time code, Supabase issues a session token stored locally. Sent back only to Supabase when checking your subscription or profile.</p>
          <p><strong>Your Google account (labs.google.com).</strong> The extension does not collect, store, or transmit your Google login credentials. When you submit prompts, the extension reads the active Google session from the Flow page you already have open — the same way any page script would. Requests go directly from your browser to Google's servers.</p>

          <h3>Google Flow cookies</h3>
          <p>The extension reads certain Google authentication cookies from the Flow page (SID, HSID, and related session cookies). This is done exclusively during session recovery — when Flow's auth goes stale, we clear problematic cookies while preserving valid ones. Cookies are not stored or transmitted anywhere.</p>

          <h3>Flow page content (DOM)</h3>
          <p>The extension reads specific elements from the Flow page: model names from dropdown menus, error messages, button labels, and the project ID from the page URL. Content from other websites or browser tabs is never accessed.</p>

          <h3>Diagnostic data</h3>
          <p>The extension keeps a record of recent diagnostic events and debugger traces in local storage for troubleshooting. Capped at a limited number of entries. Never sent to any external server. The extension does not use analytics SDKs, telemetry services, or error reporting tools.</p>
        </section>

        <section>
          <h2>Information We Share With Third Parties</h2>

          <h3>Google (Flow APIs)</h3>
          <p>When you submit a generation task, the extension sends your prompt, project ID, and generation settings to Google's Flow API using your existing Google session. Google also receives standard reCAPTCHA tokens for fraud prevention.</p>

          <h3>Supabase</h3>
          <p>We use Supabase for authentication and subscription management. Your email, user identifier, subscription tier, and daily usage count are stored there. Your actual prompts are not sent to Supabase.</p>

          <h3>Paddle</h3>
          <p>Payments are processed entirely by Paddle. When you upgrade to Pro, a server-side function creates a transaction with Paddle — your email and user identifier are passed for order tracking. The extension itself never handles, sees, or stores your payment card details.</p>

          <div className="legal-highlight">
            <p><strong>Limited Use Disclosure:</strong> Flow NextGen's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
          </div>
        </section>

        <section>
          <h2>Information We Do Not Collect</h2>
          <ul>
            <li><span className="icon-x">&#10007;</span> Browsing history from sites other than labs.google.com</li>
            <li><span className="icon-x">&#10007;</span> Credit card numbers or payment details</li>
            <li><span className="icon-x">&#10007;</span> Contacts, bookmarks, or passwords</li>
            <li><span className="icon-x">&#10007;</span> Location data</li>
            <li><span className="icon-x">&#10007;</span> Usage statistics or analytics</li>
            <li><span className="icon-x">&#10007;</span> Error reports or crash logs</li>
            <li><span className="icon-x">&#10007;</span> Communications or messages</li>
            <li><span className="icon-x">&#10007;</span> Health information</li>
          </ul>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>Your account information stays in Supabase until you delete your account. Extension data stays in your browser's local storage until you uninstall. Queue history and diagnostic records are automatically pruned.</p>
          <p>If you cancel your Pro subscription, your account reverts to the free tier. No data is deleted unless you request it.</p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to access, correct, delete, or export the information we hold about you. Contact us at the email below. We will respond within 30 days.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p><strong>bhandarigaurav@gmail.com</strong></p>
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
