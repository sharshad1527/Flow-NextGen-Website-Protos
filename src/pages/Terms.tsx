import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import "./Legal.css";

export function Terms() {
  return (
    <div className="legal-page">
      <SEO
        title="Terms of Service"
        description="Flow NextGen terms of service: conditions for using our Chrome extension and subscription service."
        canonicalPath="/terms"
      />
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="legal-date">Last updated: September 1, 2026</p>

        <section>
          <h2>1. Introduction & Acceptance</h2>
          <p>Flow NextGen is a browser extension and software service designed to automate user workflows on Google Labs Flow. By installing the extension or using this website, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, do not install or use our software.</p>
        </section>

        <section>
          <h2>2. Description of Service & Account Tiers</h2>
          <ul>
            <li><strong>Free Tier:</strong> Provides basic DOM simulation generation automation. Free tier usage is capped at a daily quota (e.g. 30 prompts per 6-hour window). Bypassing this quota through multiple account registrations or script injections is prohibited.</li>
            <li><strong>Pro Tier:</strong> Unlocks advanced API-based automation, auto-download naming, unlimited batch queues, 4K rendering tools, and custom metadata templates. Pro features are subject to monthly or annual subscription fees.</li>
          </ul>
        </section>

        <section>
          <h2>3. Merchant of Record Reseller Clause</h2>
          <p>Our billing, order processes, and checkout operations are conducted exclusively by our online reseller and Merchant of Record, <strong>Dodo Payments</strong> (dodopayments.com). Dodo Payments is the legal seller of record for all our digital product sales. By subscribing to our Pro services, you acknowledge that transactions are subject to Dodo Payments' own Buyer Terms and Conditions, and you agree to their payment, tax compliance, and processing guidelines.</p>
          <p>Dodo Payments' Buyer Terms: <a href="https://dodopayments.com/legal/buyer-terms" target="_blank" rel="noopener noreferrer">https://dodopayments.com/legal/buyer-terms</a></p>
        </section>

        <section>
          <h2>4. Google Labs Flow Dependency & Risks</h2>
          <div className="legal-highlight">
            <p><strong>CRITICAL NOTICE ON THIRD-PARTY COMPATIBILITY:</strong></p>
            <p>Flow NextGen is an independent automation tool and is not affiliated, endorsed, or partnered with Google LLC or Google Labs Flow. The software operates strictly by interfacing with the current layout, APIs, and state mechanisms of the Google Labs Flow platform (<code>labs.google.com</code>).</p>
            <p>You acknowledge and agree to the following conditions:</p>
            <ul>
              <li><strong>Breaking Changes:</strong> Google may modify its web dashboard, HTML selectors, endpoint structures, authentication protocols, or APIs at any time without notice. Such changes can cause Flow NextGen to stop working temporarily or permanently. We will attempt to release compatibility patches but cannot guarantee restoration of service.</li>
              <li><strong>Service Obsolescence:</strong> If Google deprecates or locks the Google Labs Flow project, our extension may become obsolete. We are not liable to issue refunds or chargebacks for downtime caused by Google's updates or platform choices.</li>
              <li><strong>Account Risks:</strong> Google's program guidelines may restrict or prohibit the use of automation scripts, macros, or DOM simulators. By using Flow NextGen, you assume all risks related to your Google account, including rate limits, flags, suspension, or termination. We are not liable for any actions Google takes against your Google account.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>5. Subscription Renewals & Cancellations</h2>
          <p>Subscriptions renew automatically each month at our published rate ($5.99/month). You can cancel your subscription at any time through the Dodo Payments customer portal (the "Manage Subscription" option in your extension settings) or by contacting our team. Cancellations will deactivate future billing; you will keep full Pro access until the end of your prepaid period, after which your account will revert to the Free tier.</p>
          <p>Taxes (including GST/VAT where applicable) are calculated, collected, and remitted by Dodo Payments as our Merchant of Record. The price you see at checkout is inclusive of applicable taxes unless stated otherwise.</p>
        </section>

        <section>
          <h2>6. Acceptable Use Rules</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Reverse engineer, decompile, or harvest source code from the Chrome extension or our website assets.</li>
            <li>Resell, sublicense, or share your Pro authentication email or account access with third parties.</li>
            <li>Use the software's queue mechanics to submit illegal, abusive, harmful, or copyright-violating generation requests that breach Google's Acceptable Use policies.</li>
            <li>Deploy bot farms or script wrappers on top of our extension to bypass payment barriers or license restrictions.</li>
          </ul>
        </section>

        <section>
          <h2>7. Disclaimer of Warranties</h2>
          <p>FLOW NEXTGEN IS PROVIDED "AS IS" AND "AS AVAILABLE". WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTIBILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, BUGS-FREE, OR ERROR-FREE.</p>
        </section>

        <section>
          <h2>8. Limitation of Liability</h2>
          <p>IN NO EVENT SHALL FLOW NEXTGEN, ITS DEVELOPERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF GOOGLE SERVICES ACCESS, LOST PROFITS, OR TRANSACTION FAILURES, IN EXCESS OF THE TOTAL AMOUNT COMPENSATED BY YOU TO DISCLOSED PAYMENT SERVICES DURING THE THREE (3) MONTHS PRIOR TO THE CLAIM.</p>
        </section>

        <section>
          <h2>9. Governing Law & Dispute Resolution</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the principal developer operates, without regard to its conflict of law provisions. Any legal disputes, claims, or arbitrations arising from our software must be brought exclusively in the courts of this jurisdiction.</p>
        </section>

        <section>
          <h2>10. Contact Information</h2>
          <p>For terms inquiries or account policy questions, contact us via email at:</p>
          <p><strong>flownextgen-support@googlegroups.com</strong></p>
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
