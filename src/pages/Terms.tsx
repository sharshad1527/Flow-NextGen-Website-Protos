import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import "./Legal.css";

export function Terms() {
  return (
    <div className="legal-page">
      <SEO
        title="Terms of Service"
        description="Flow NextGen terms of service — conditions for using our Chrome extension and subscription service."
        canonicalPath="/terms"
      />
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="legal-date">Last updated: July 26, 2026</p>

        <section>
          <h2>1. What This Is</h2>
          <p>Flow NextGen is a Chrome extension that automates Google Labs Flow. It queues prompts, manages batches, auto-downloads media, and keeps your characters consistent across sessions. By installing the extension, you agree to these terms.</p>
        </section>

        <section>
          <h2>2. Two Separate Accounts</h2>
          <p>Flow NextGen uses two completely separate authentication systems:</p>
          <ul>
            <li><strong>Flow NextGen account (Supabase):</strong> Sign in with your email via a one-time code. Used for subscription management and free-tier tracking.</li>
            <li><strong>Your Google account:</strong> The extension works with whatever Google account you're already signed into on labs.google.com. Your Google credentials never touch our servers.</li>
          </ul>
        </section>

        <section>
          <h2>3. Free vs Pro</h2>
          <ul>
            <li><strong>Free:</strong> Core automation features with a daily usage limit (30 prompts/day).</li>
            <li><strong>Pro:</strong> Unlimited usage, priority queue, and advanced features. Requires subscription.</li>
          </ul>
          <p>The free tier is not a trial — it works indefinitely at the free level.</p>
        </section>

        <section>
          <h2>4. Accounts</h2>
          <p>You sign in with your email via a one-time code. You're responsible for keeping your email secure.</p>
        </section>

        <section>
          <h2>5. Subscriptions</h2>
          <p>Pro subscriptions are billed monthly through Paddle. Prices are listed on our site. Paddle handles all payment processing — we never see your card details.</p>
          <p>Subscriptions renew automatically each month unless cancelled. You can cancel anytime — you keep Pro access until the end of your current billing period, then revert to free.</p>
        </section>

        <section>
          <h2>6. Refunds</h2>
          <p>See our <Link to="/refund">Refund Policy</Link>. Short version: 14-day window for first-time subscribers, no refunds after that unless required by law.</p>
        </section>

        <section>
          <h2>7. Acceptable Use</h2>
          <ul>
            <li>No reverse engineering or copying the extension</li>
            <li>No breaking Google Labs Flow's terms of service</li>
            <li>No reselling or redistributing Pro access</li>
            <li>No use for spam, fraud, or illegal activity</li>
            <li>No bypassing usage limits or access controls</li>
          </ul>
        </section>

        <section>
          <h2>8. Your Content</h2>
          <p>Your prompts, settings, and generated media belong to you. We don't claim ownership and don't look at your prompts — they're sent directly to Google's API on your behalf.</p>
        </section>

        <section>
          <h2>9. Disclaimer</h2>
          <p>The extension is provided "as is." We're not liable for lost generation credits due to bugs, changes to Flow that break the extension, or indirect damages.</p>
        </section>

        <section>
          <h2>10. Termination</h2>
          <p>We can suspend your access for violating these terms. We'll email you before doing so unless it's an emergency.</p>
        </section>

        <section>
          <h2>11. Changes</h2>
          <p>We may update these terms. Material changes will be notified via email or the extension.</p>
        </section>

        <section>
          <h2>12. Contact</h2>
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
