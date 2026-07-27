import { Link } from "react-router-dom";
import "./Legal.css";

export function Refund() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Refund Policy</h1>
        <p className="legal-date">Last updated: July 26, 2026</p>

        <section>
          <h2>The Short Version</h2>
          <p>Try the free tier first. It's not a trial - it's a fully working extension with a daily limit of 30 prompts. If Pro works for you, great. If not, you have 14 days to ask for your money back on the first payment. After that, refunds are only where required by law.</p>
        </section>

        <section>
          <h2>14-Day Window (First Subscription Only)</h2>
          <p>If you're in the EU, EEA, Switzerland, or the UK, you have a statutory right to cancel within 14 days of your first Pro payment. We extend this to everyone - if you request a refund within 14 days of your first payment, we'll process it.</p>
          <p>This only applies to the <strong>first</strong> payment. Subsequent renewals are non-refundable.</p>
          <div className="legal-highlight">
            <p>When you purchase Pro, you agree that access starts immediately. If you're in the EU/UK, you acknowledge you're waiving your withdrawal right by starting the service right away. If you don't agree, don't complete the purchase - the free tier is always available.</p>
          </div>
        </section>

        <section>
          <h2>Outside the EU/UK</h2>
          <p>If you're outside the EU, EEA, Switzerland, or the UK, all subscription fees are non-refundable unless required by local law (for example, 7-day rights in Canada, Brazil, South Korea, or Singapore).</p>
        </section>

        <section>
          <h2>Cancellation</h2>
          <p>You can cancel anytime. You keep Pro access until the end of your billing period - no interruption. No partial refunds for unused days. After the period ends, you're back on the free tier.</p>
        </section>

        <section>
          <h2>How to Request a Refund</h2>
          <p>Refunds are handled through Paddle. Visit <a href="https://paddle.net">paddle.net</a>, click "View Receipt" in your purchase email, and follow Paddle's refund process. Or email us and we'll point you in the right direction.</p>
        </section>

        <section>
          <h2>Contact</h2>
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
