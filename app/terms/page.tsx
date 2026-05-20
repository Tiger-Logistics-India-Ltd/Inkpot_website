"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fade = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

export default function TermsAndConditions() {
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
            Terms &amp; Conditions
          </motion.h1>

          <motion.p {...fade} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(0,0,0,0.4)", marginBottom: "56px" }}>
            Last updated: May 2026
          </motion.p>

          <motion.div {...fade} transition={{ duration: 0.6, delay: 0.15 }}
            style={{ fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.85, color: "rgba(0,0,0,0.72)" }}>

            <Section title="Acceptance of Terms">
              By accessing and using <strong>www.inkpotindia.com</strong>, you accept and agree to be bound by these Terms &amp; Conditions. If you do not agree to these terms, please do not use this website.
            </Section>

            <Section title="About Inkpot India">
              Inkpot India is a cultural organisation that produces events, experiences, and programmes celebrating Indian art, music, heritage, and performance. These terms govern your use of our website and any services offered through it.
            </Section>

            <Section title="Use of This Website">
              <ul style={{ paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>You may use this website for personal, non-commercial purposes</li>
                <li style={{ marginBottom: "8px" }}>You must not reproduce, distribute, or use any content from this site without written permission from Inkpot India</li>
                <li style={{ marginBottom: "8px" }}>You must not use the website in any way that causes damage or disruption to our services</li>
                <li style={{ marginBottom: "8px" }}>We reserve the right to restrict access to any part of this website at any time</li>
              </ul>
            </Section>

            <Section title="Intellectual Property">
              All content on this website — including text, images, videos, logos, and design — is the intellectual property of Inkpot India or its respective creators and is protected by applicable copyright laws. Unauthorised use, reproduction, or distribution of any content is strictly prohibited.
            </Section>

            <Section title="Newsletter &amp; Communications">
              By subscribing to our newsletter, you consent to receiving periodic emails from Inkpot India about our events, programmes, and cultural updates. You may unsubscribe at any time. We do not send spam and we do not share your email with third parties for marketing purposes.
            </Section>

            <Section title="Events &amp; Experiences">
              <ul style={{ paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>Event details, dates, and venues are subject to change. We will communicate any changes through our website and email</li>
                <li style={{ marginBottom: "8px" }}>Inkpot India reserves the right to cancel or reschedule events. In such cases, registered participants will be notified</li>
                <li style={{ marginBottom: "8px" }}>Photography and videography may take place at our events. By attending, you consent to being photographed or filmed for Inkpot India&apos;s documentation and promotional use</li>
              </ul>
            </Section>

            <Section title="Limitation of Liability">
              Inkpot India makes every effort to ensure the accuracy of information on this website, but we do not guarantee that all content is complete, accurate, or up to date. We shall not be liable for any loss or damage arising from your use of this website or reliance on any information provided.
            </Section>

            <Section title="Third-Party Links">
              This website contains links to third-party websites (including press articles and partner organisations). These links are provided for convenience only. Inkpot India is not responsible for the content, privacy practices, or terms of any third-party website.
            </Section>

            <Section title="Governing Law">
              These terms are governed by the laws of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts of New Delhi, India.
            </Section>

            <Section title="Contact">
              If you have any questions about these terms, please contact us at <a href="mailto:hello@inkpotindia.com" style={{ color: "var(--primary-red)" }}>hello@inkpotindia.com</a> or visit our <a href="/contact" style={{ color: "var(--primary-red)" }}>Contact page</a>.
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
