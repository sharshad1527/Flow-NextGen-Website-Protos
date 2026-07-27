import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is Flow NextGen?",
    answer: "Flow NextGen is a Chrome extension that automates bulk AI image and video generation on Google Flow. Queue hundreds of prompts, and the extension runs them automatically while you work on other things."
  },
  {
    question: "Is it free?",
    answer: "Yes, there is a free tier that gives you 30 prompts per 6 hours with DOM simulation mode. The Pro tier at $9.99/month unlocks unlimited generation, API-first mode, auto-download, 4K upscaling, and priority features."
  },
  {
    question: "What models does it support?",
    answer: "Video generation uses Veo 3.1 (Lite, Fast, or Quality mode) and Omni Flash. Image generation uses Nano Banana Pro, Nano Banana 2, and Banana 2 Lite. All are Google's latest models available through Google Flow."
  },
  {
    question: "How do I get started?",
    answer: "Install the extension from the Chrome Web Store, pin it to your toolbar, and open Google Flow in a tab. Click the extension icon to open the sidepanel, sign in with your email, and you're ready to queue your first prompts."
  },
  {
    question: "How is this different from manually using Google Flow?",
    answer: "Instead of typing prompts one at a time and waiting for each to finish, you paste your entire list at once. The extension handles the clicking, waiting, retrying, and downloading — while you focus on creative work."
  },
  {
    question: "Where can I get help?",
    answer: "Join our Discord community for support, feature requests, and updates. You can also check the Guide page for detailed walkthroughs of each feature."
  }
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="faq-section" style={{
      padding: '5rem 0',
      position: 'relative',
    }}>
      <div className="container" style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 2vw + 1rem, 3.5rem)',
            letterSpacing: '-0.02em',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            marginBottom: '0.5rem',
          }}>
            Frequently Asked <span style={{
              background: 'linear-gradient(135deg, #FF9100 0%, #FF5100 50%, #FF3D00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Questions</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(1rem, 0.5vw + 0.7rem, 1.2rem)' }}>
            Everything you need to know before getting started.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              layout
              style={{
                background: openIndex === i ? 'rgba(22,22,22,0.85)' : 'rgba(22,22,22,0.4)',
                border: openIndex === i ? '1px solid rgba(255,107,0,0.3)' : '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                cursor: 'pointer',
                transition: 'background 0.3s ease, border-color 0.3s ease',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}>
                <h4 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: '#fff',
                  margin: 0,
                }}>
                  {faq.question}
                </h4>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ flexShrink: 0 }}
                >
                  <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
                </motion.div>
              </div>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      paddingTop: '0.75rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      marginTop: '0.75rem',
                    }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
