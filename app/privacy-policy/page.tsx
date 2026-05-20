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
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px" }}>

          <motion.p {...fade} transition={{ duration: 0.5 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--primary-red)", marginBottom: "16px" }}>
            Legal
          </motion.p>

          <motion.h1 {...fade} transition={{ duration: 0.6, delay: 0.05 }}
            style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(36px, 5vw, 60px)", color: "#0D0B09", lineHeight: 1.1, marginBottom: "12px" }}>
            Privacy Policy
          </motion.h1>

          <motion.p {...fade} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.4)", marginBottom: "56px" }}>
            Last updated: May 2026
          </motion.p>

          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.15 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.85, color: "rgba(0,0,0,0.72)" }}>

            <Section title="Who We Are">
              Inkpot India is a cultural organisation based in New Delhi, India. We create and produce experiences that celebrate India&apos;s art, music, architecture, and heritage. Our website is <strong>www.inkpotindia.com</strong>. For any privacy-related queries, write to us at <a href="mailto:hello@inkpotindia.com" style={{ color: "var(--primary-red)" }}>hello@inkpotindia.com</a>.
            </Section>

            <Section title="Information We Collect">
              <p>We collect the following personal information:</p>
              <ul style={{ paddingLeft: "20px", marginTop: "12px" }}>
                <li style={{ marginBottom: "8px" }}><strong>Email address</strong> — when you subscribe to our newsletter or fill out the contact form</li>
                <li style={{ marginBottom: "8px" }}><strong>Phone number</strong> — when you submit it voluntarily through our contact form</li>
                <li style={{ marginBottom: "8px" }}><strong>Name</strong> — when provided through our contact form</li>
                <li style={{ marginBottom: "8px" }}><strong>Usage data</strong> — pages visited, time on site, device type (via Google Analytics)</li>
              </ul>
            </Section>

            <Section title="How We Use Your Information">
              <ul style={{ paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>To send you our newsletter and cultural updates (email only)</li>
                <li style={{ marginBottom: "8px" }}>To respond to enquiries you send via the contact form</li>
                <li style={{ marginBottom: "8px" }}>To understand how visitors use our website and improve it (analytics)</li>
                <li style={{ marginBottom: "8px" }}>We do not sell, rent, or trade your personal information to any third party</li>
              </ul>
            </Section>

            <Section title="Third-Party Services">
              <p>We use the following third-party services that may process your data:</p>
              <ul style={{ paddingLeft: "20px", marginTop: "12px" }}>
                <li style={{ marginBottom: "8px" }}><strong>EmailJS</strong> — delivers emails from our newsletter and contact forms. Your email address is processed by EmailJS to send transactional emails.</li>
                <li style={{ marginBottom: "8px" }}><strong>Google Analytics</strong> — tracks anonymous usage data such as pages visited, session duration, and device type. This uses cookies. You can opt out via <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-red)" }}>Google&apos;s opt-out tool</a>.</li>
                <li style={{ marginBottom: "8px" }}><strong>Vercel</strong> — our website hosting provider. Your IP address and request data may pass through Vercel&apos;s servers.</li>
              </ul>
            </Section>

            <Section title="Cookies">
              Our website uses cookies solely through Google Analytics to understand visitor behaviour. These are analytics cookies — we do not use advertising or tracking cookies. You can disable cookies in your browser settings at any time.
            </Section>

            <Section title="Data Retention">
              Newsletter subscriber emails are retained until you unsubscribe. Contact form submissions are retained for up to 12 months. Analytics data is retained as per Google Analytics&apos; default retention settings (26 months).
            </Section>

            <Section title="Your Rights">
              <p>You have the right to:</p>
              <ul style={{ paddingLeft: "20px", marginTop: "12px" }}>
                <li style={{ marginBottom: "8px" }}>Unsubscribe from our newsletter at any time by replying &ldquo;unsubscribe&rdquo; to any email</li>
                <li style={{ marginBottom: "8px" }}>Request access to, correction of, or deletion of your personal data</li>
                <li style={{ marginBottom: "8px" }}>Withdraw consent at any time</li>
              </ul>
              <p style={{ marginTop: "12px" }}>To exercise any of these rights, email us at <a href="mailto:hello@inkpotindia.com" style={{ color: "var(--primary-red)" }}>hello@inkpotindia.com</a>.</p>
            </Section>

            <Section title="Changes to This Policy">
              We may update this policy from time to time. Any changes will be posted on this page with an updated date. Continued use of our website after changes constitutes acceptance of the revised policy.
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
    <div style={{ marginBottom: "44px" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 400, fontSize: "22px", color: "#0D0B09", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
