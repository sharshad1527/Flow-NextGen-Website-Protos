import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { faqs } from "../data/faqs";

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
