import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import "./Legal.css";

export function Refund() {
  return (
    <div className="legal-page">
      <SEO
        title="Refund Policy"
        description="Flow NextGen refund policy: 14-day refund window for first-time subscribers and cancellation terms."
        canonicalPath="/refund"
      />
      <div className="legal-container">
        <h1>Refund Policy</h1>
        <p className="legal-date">Last updated: September 1, 2026</p>

        <section>
          <h2>Try the Free Tier First</h2>
          <p>We believe in full transparency. Our Free tier is not a time-limited trial; it is a fully functioning workspace limited only by query capacity (30 prompts per 6 hours). We strongly recommend using the Free tier first to ensure the extension fits your workspace and operates correctly on your Google account before upgrading to Pro.</p>
        </section>

        <section>
          <h2>1. 14-Day Voluntary Money-Back Guarantee</h2>
          <p>We offer a 14-day refund window from the date of your <strong>original</strong> Pro tier purchase. This policy allows you to evaluate the advanced queue and download capabilities. This money-back window applies only to first-time purchases. Subsequent monthly renewal charges are strictly non-refundable.</p>
        </section>

        <section>
          <h2>2. Usage Limits to Prevent Abuse (Fair Use Quota)</h2>
          <div className="legal-highlight">
            <p><strong>IMPORTANT REFUND CONDITION:</strong></p>
            <p>To prevent subscription cycling abuse, where users subscribe to Pro, execute massive queues download, and immediately request a refund, we enforce a usage threshold. Refunds are only eligible if you have executed <strong>fewer than 50 automated prompt generations</strong> on the Pro tier during the 14-day evaluation window. If your account usage logs exceed this threshold, your voluntary refund request will be rejected.</p>
          </div>
        </section>

        <section>
          <h2>3. Merchant of Record & Processing</h2>
          <p>All subscription payments, checkouts, and refunds are managed by our Merchant of Record, <strong>Dodo Payments</strong> (dodopayments.com). Since Dodo Payments processes the payments and handles tax filings, refund requests are processed through Dodo Payments. Once a refund is approved by our team or Dodo Payments, it is credited back to your original payment method. Refund processing typically takes 3-5 business days depending on your bank or payment method.</p>
          <p>We offer <strong>full refunds</strong> for eligible requests within the 14-day window, and <strong>partial refunds</strong> at our discretion (for example, where only part of a charge warrants a refund). Dodo Payments enforces a 30-day platform limit for initiating refunds on any successful payment.</p>
        </section>

        <section>
          <h2>4. European Union & United Kingdom Statutory Rights</h2>
          <p>Under local consumer laws in the EU and UK, you have a statutory right of withdrawal for digital services within 14 days of purchase. However, when subscribing, you acknowledge that access to the Pro services commences immediately. By starting the services, you acknowledge that you are waiving your statutory right of withdrawal. Nevertheless, we voluntarily extend our 14-day money-back guarantee (subject to the Fair Use Quota in Section 2) to cover you.</p>
        </section>

        <section>
          <h2>5. Subscriptions Renewal & Cancellations</h2>
          <p>Cancellations do not trigger partial refunds. If you cancel your membership mid-cycle, you will retain active Pro status until the end of your prepayed period. On the next billing cycle date, your account simply deactivates and reverts to the Free tier.</p>
        </section>

        <section>
          <h2>6. How to Request a Refund</h2>
          <p>To request a refund, follow one of these paths:</p>
          <ul>
            <li><strong>Via the Dodo Payments customer portal:</strong> Open the "Manage Subscription" option in your extension settings, sign in to the Dodo Payments customer portal, and view your transaction history. Refund requests can be initiated from the payment details view.</li>
            <li><strong>Via Support Email:</strong> Contact us at <strong>flownextgen-support@googlegroups.com</strong> with your registered account email and a brief description of why you want a refund. We will review your request within 2 business days and process approved refunds through Dodo Payments.</li>
          </ul>
          <p><strong>Chargebacks:</strong> If you dispute a charge through your bank or card network instead of requesting a refund directly, the chargeback will be handled through Dodo Payments as our Merchant of Record. Dodo Payments will manage the dispute process on our behalf.</p>
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
