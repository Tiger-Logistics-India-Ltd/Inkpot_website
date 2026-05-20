"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fade = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#ffffff", paddingTop: "120px", paddingBottom: "100px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>

          <motion.p {...fade} transition={{ duration: 0.5 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--primary-red)", marginBottom: "16px" }}>
            Legal
          </motion.p>

          <motion.h1 {...fade} transition={{ duration: 0.6, delay: 0.05 }}
            style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(36px, 5vw, 60px)", color: "#0D0B09", lineHeight: 1.1, marginBottom: "8px" }}>
            Privacy Policy
          </motion.h1>

          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(0,0,0,0.45)", marginBottom: "8px" }}>
            <strong>Inkpot India Pvt. Ltd.</strong>
          </motion.div>
          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.12 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.38)", marginBottom: "56px" }}>
            Effective Date: October 24, 2025 &nbsp;·&nbsp; Last Updated: October 24, 2025
          </motion.div>

          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.15 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.9, color: "rgba(0,0,0,0.72)" }}>

            <p style={{ marginBottom: "40px" }}>
              Inkpot India Pvt. Ltd. (&ldquo;Inkpot India&rdquo;, &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) values your trust and respects your right to privacy. We are committed to protecting your personal data and ensuring transparency in how we collect, use, and safeguard information provided to us through our website, applications, ticketing platforms, social media pages, partner websites, and offline or online event registrations (collectively referred to as the &ldquo;Platform&rdquo;).
            </p>

            <Section title="Introduction">
              This Privacy Policy (&ldquo;Policy&rdquo;) outlines how Inkpot India collects, stores, uses, discloses, and protects the personal data and sensitive personal information of individuals who interact with us — whether as visitors, event participants, artists, vendors, partners, or customers. By accessing or using the Platform, or by voluntarily providing any Personal Data to us, you acknowledge and consent to the collection, storage, processing, and disclosure of your data in accordance with this Policy and the applicable laws of India.
            </Section>

            <Section title="1. Collection of Information">
              <p>Inkpot India recognises that the information you share with us is personal and confidential. We are committed to collecting only such information as is necessary for lawful, legitimate, and transparent business purposes. We ensure that the collection, use, and handling of such information comply with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and other applicable data protection regulations.</p>

              <SubSection title="1.1 Categories of Information Collected">
                <p style={{ marginBottom: "16px" }}>Inkpot India collects the following categories of data, either directly from you or automatically through your use of our Platform:</p>

                <SubSection title="A. Personal Information">
                  <ul style={{ paddingLeft: "20px" }}>
                    <li style={{ marginBottom: "10px" }}><strong>Identity Data:</strong> Full name, date of birth, age, gender, and nationality.</li>
                    <li style={{ marginBottom: "10px" }}><strong>Contact Data:</strong> Email address, mobile number, telephone number, and postal or residential address.</li>
                    <li style={{ marginBottom: "10px" }}><strong>Account Data:</strong> Login credentials, usernames, passwords, and authentication tokens.</li>
                    <li style={{ marginBottom: "10px" }}><strong>Communication Preferences:</strong> How you prefer to receive communications (email, SMS, WhatsApp, or push notifications).</li>
                    <li style={{ marginBottom: "10px" }}><strong>Event Participation Data:</strong> Details provided during registration for events, workshops, or programmes.</li>
                    <li style={{ marginBottom: "10px" }}><strong>Profile and Demographic Data:</strong> Interests, profession, or artistic preferences.</li>
                    <li style={{ marginBottom: "10px" }}><strong>Visual and Media Data:</strong> Photographs, video recordings, or testimonials collected during Inkpot India events. By attending events, you consent to the use of media captured in public spaces for promotional and documentation purposes.</li>
                  </ul>
                </SubSection>

                <SubSection title="B. Sensitive Personal Data or Information (SPDI)">
                  <p style={{ marginBottom: "12px" }}>In accordance with Rule 3 of the IT (SPDI) Rules, 2011, we may collect:</p>
                  <ul style={{ paddingLeft: "20px" }}>
                    <li style={{ marginBottom: "10px" }}><strong>Financial Data:</strong> Payment instrument details such as debit/credit card numbers, UPI IDs, or bank account information when you purchase tickets or make donations.</li>
                    <li style={{ marginBottom: "10px" }}><strong>Authentication Data:</strong> Passwords, PINs, and other security codes.</li>
                    <li style={{ marginBottom: "10px" }}><strong>Biometric or Identification Data:</strong> In limited cases, ID verification information (such as Aadhaar, PAN, or Passport) where required by law or venue regulations.</li>
                    <li style={{ marginBottom: "10px" }}><strong>Health and Safety Data:</strong> Voluntarily provided health information such as allergy disclosures, emergency contacts, or disability assistance requests.</li>
                  </ul>
                </SubSection>

                <SubSection title="C. Automatically Collected Data">
                  <ul style={{ paddingLeft: "20px" }}>
                    <li style={{ marginBottom: "10px" }}><strong>Device and Technical Data:</strong> Browser type, operating system, screen resolution, and device model.</li>
                    <li style={{ marginBottom: "10px" }}><strong>Log Data and Analytics:</strong> IP address, time and date of visit, session duration, referring URLs, and usage statistics.</li>
                    <li style={{ marginBottom: "10px" }}><strong>Cookies and Tracking Technologies:</strong> Information gathered through cookies, pixel tags, and web beacons (see Section 8).</li>
                    <li style={{ marginBottom: "10px" }}><strong>Geolocation Data:</strong> Approximate location derived from your IP address or device settings.</li>
                  </ul>
                </SubSection>
              </SubSection>

              <SubSection title="1.2 Methods of Data Collection">
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "8px" }}><strong>Direct collection:</strong> Information you voluntarily provide through forms, surveys, or event registrations.</li>
                  <li style={{ marginBottom: "8px" }}><strong>Automated collection:</strong> Information gathered through cookies, analytics tools, and system logs.</li>
                  <li style={{ marginBottom: "8px" }}><strong>Partner integration:</strong> Information shared by authorised partners or service providers.</li>
                  <li style={{ marginBottom: "8px" }}><strong>Offline collection:</strong> Information captured at physical events, including attendee registrations or visitor book entries.</li>
                </ul>
              </SubSection>

              <SubSection title="1.3 Children and Minors">
                Our services are intended for individuals above 18 years of age. Persons below 18 may participate in events only under the supervision and consent of a parent or legal guardian.
              </SubSection>
            </Section>

            <Section title="2. Purpose and Use of Collected Information">
              <SubSection title="2.1 Operational and Contractual Purposes">
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "8px" }}>Event registration, verification, and participation management</li>
                  <li style={{ marginBottom: "8px" }}>Ticketing, booking management, and payment processing</li>
                  <li style={{ marginBottom: "8px" }}>Identity verification and access control</li>
                  <li style={{ marginBottom: "8px" }}>Communication of event-related information, schedules, and updates</li>
                  <li style={{ marginBottom: "8px" }}>Vendor and partner coordination</li>
                </ul>
              </SubSection>

              <SubSection title="2.2 Customer Relationship and Engagement">
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "8px" }}>Customer support and grievance redressal</li>
                  <li style={{ marginBottom: "8px" }}>Personalised event recommendations and user experience</li>
                  <li style={{ marginBottom: "8px" }}>Surveys and feedback collection</li>
                </ul>
              </SubSection>

              <SubSection title="2.3 Marketing and Promotional Activities">
                <p style={{ marginBottom: "12px" }}>With your consent, we may use your data for:</p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "8px" }}>Email, SMS, and social media campaigns about upcoming events and programmes</li>
                  <li style={{ marginBottom: "8px" }}>Advertising and remarketing on online platforms</li>
                  <li style={{ marginBottom: "8px" }}>Media and publicity using event photographs or testimonials</li>
                </ul>
                <p style={{ marginTop: "12px" }}>You may opt out at any time by using the &ldquo;unsubscribe&rdquo; link in our emails or by contacting us at <a href="mailto:hello@inkpotindia.com" style={{ color: "var(--primary-red)" }}>hello@inkpotindia.com</a>.</p>
              </SubSection>

              <SubSection title="2.4 Legal and Regulatory Compliance">
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "8px" }}>Compliance with tax, audit, and financial reporting obligations</li>
                  <li style={{ marginBottom: "8px" }}>Responding to lawful requests from courts or government authorities</li>
                  <li style={{ marginBottom: "8px" }}>Fraud prevention, security monitoring, and risk management</li>
                </ul>
              </SubSection>

              <SubSection title="2.5 Analytics and Business Intelligence">
                Usage analytics, market research, and service improvement are conducted using anonymised and aggregated data where individuals cannot be personally identified.
              </SubSection>
            </Section>

            <Section title="3. Disclosure of Information">
              <SubSection title="3.1 Sharing with Affiliates and Partners">
                Personal data may be shared with affiliates, event co-organizers, and marketing partners solely for legitimate, stated purposes and subject to binding confidentiality obligations.
              </SubSection>

              <SubSection title="3.2 Third-Party Service Providers">
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "8px" }}>Payment gateways for processing transactions</li>
                  <li style={{ marginBottom: "8px" }}>Cloud and IT service providers for secure storage and system maintenance</li>
                  <li style={{ marginBottom: "8px" }}>Data analytics providers (including Google Analytics) to improve user experience</li>
                  <li style={{ marginBottom: "8px" }}>Email delivery services (including EmailJS) for communications</li>
                </ul>
              </SubSection>

              <SubSection title="3.3 Legal or Regulatory Disclosure">
                Inkpot India may disclose personal data to government authorities, courts, or law enforcement agencies as required by law. The Company is not liable for misuse of data by third parties acting independently once data has been lawfully shared.
              </SubSection>
            </Section>

            <Section title="4. International Data Transfers">
              Inkpot India may transfer personal data outside India when necessary to provide services. Transfers occur only where the recipient country ensures adequate data protection or appropriate safeguards (such as standard contractual clauses) are in place. We ensure compliance with all applicable data protection laws.
            </Section>

            <Section title="5. Data Retention and Destruction">
              <ul style={{ paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}><strong>Operational Data:</strong> Retained until completion of service or event obligations</li>
                <li style={{ marginBottom: "8px" }}><strong>Financial Data:</strong> Retained as required for accounting, taxation, or audit purposes under Indian law</li>
                <li style={{ marginBottom: "8px" }}><strong>Marketing Data:</strong> Retained until consent is withdrawn</li>
                <li style={{ marginBottom: "8px" }}><strong>Analytics Data:</strong> Retained per Google Analytics default settings (26 months)</li>
              </ul>
              <p style={{ marginTop: "12px" }}>Data no longer required is deleted, anonymised, or securely archived using industry-standard methods.</p>
            </Section>

            <Section title="6. Security Practices and Procedures">
              <p style={{ marginBottom: "16px" }}>Inkpot India implements technical, administrative, and physical safeguards including:</p>
              <ul style={{ paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>SSL/TLS encryption for data transmission</li>
                <li style={{ marginBottom: "8px" }}>Firewalls, intrusion detection, and malware protection</li>
                <li style={{ marginBottom: "8px" }}>Role-based access controls and employee training on data confidentiality</li>
                <li style={{ marginBottom: "8px" }}>Regular security audits and vulnerability assessments</li>
              </ul>
              <p style={{ marginTop: "12px" }}>Despite these measures, Inkpot India does not guarantee absolute protection against unauthorized access or data breaches beyond our control.</p>
            </Section>

            <Section title="7. Your Rights and Choices">
              <ul style={{ paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}><strong>Access and Correction:</strong> Request access to or correction of your personal data</li>
                <li style={{ marginBottom: "8px" }}><strong>Data Deletion:</strong> Request deletion of personal data, subject to legal or contractual retention requirements</li>
                <li style={{ marginBottom: "8px" }}><strong>Consent Withdrawal:</strong> Withdraw previously given consent for data processing at any time</li>
                <li style={{ marginBottom: "8px" }}><strong>Unsubscribe:</strong> Opt out of marketing emails at any time</li>
              </ul>
              <p style={{ marginTop: "12px" }}>To exercise any of these rights, contact our Grievance Officer at <a href="mailto:hello@inkpotindia.com" style={{ color: "var(--primary-red)" }}>hello@inkpotindia.com</a>.</p>
            </Section>

            <Section title="8. Use of Cookies and Tracking Technologies">
              <p style={{ marginBottom: "16px" }}>Inkpot India uses cookies and similar technologies for:</p>
              <ul style={{ paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>Authentication and session management</li>
                <li style={{ marginBottom: "8px" }}>Analytics and performance monitoring (via Google Analytics)</li>
                <li style={{ marginBottom: "8px" }}>Personalised recommendations and marketing</li>
              </ul>
              <p style={{ marginTop: "12px" }}>Cookies can be disabled through your browser settings. Disabling cookies may limit access to certain features. You may also opt out of Google Analytics tracking via <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-red)" }}>Google&apos;s opt-out tool</a>.</p>
            </Section>

            <Section title="9. Limitation of Liability">
              Inkpot India shall not be liable for indirect, incidental, or consequential losses arising from misuse or unauthorized disclosure of data, or events beyond our reasonable control including cyberattacks or third-party breaches. Exceptions apply in cases of proven gross negligence or as required by applicable law.
            </Section>

            <Section title="10. Policy Updates">
              Inkpot India may update this Privacy Policy from time to time to reflect changes in law, technology, or business practices. Material changes will be highlighted on the Platform with an updated effective date. Continued use of the Platform after changes constitutes acceptance of the updated Policy.
            </Section>

            <Section title="11. Grievance Officer and Contact Information">
              <p><strong>Grievance Officer</strong></p>
              <p>Inkpot India Pvt. Ltd.</p>
              <p style={{ marginTop: "8px" }}>Email: <a href="mailto:hello@inkpotindia.com" style={{ color: "var(--primary-red)" }}>hello@inkpotindia.com</a></p>
            </Section>

            <Section title="12. Governing Law and Jurisdiction">
              This Privacy Policy shall be governed by and construed in accordance with the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts at New Delhi, India.
            </Section>

          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "48px" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "24px", color: "#0D0B09", marginBottom: "18px", paddingBottom: "12px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "24px", marginTop: "20px" }}>
      <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "13px", letterSpacing: "0.04em", color: "#0D0B09", marginBottom: "12px", textTransform: "uppercase" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
