import { motion } from "motion/react";
import { Code2, Terminal, Cpu } from "lucide-react";
import "./Technical.css";

export function Technical() {
  return (
    <section id="technical" className="technical">
      <div className="container">
        <div className="technical-header">
          <h2>How It <span className="gradient-text">Works</span></h2>
          <p>Advanced automation under the hood.</p>
        </div>

        <div className="technical-content">
          <motion.div 
            className="tech-visual"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="code-block">
              <div className="code-header">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="filename">background.ts</span>
              </div>
              <pre>
                <code>
                  <span className="keyword">const</span> <span className="variable">submitJob</span> = <span className="keyword">async</span> (job) {'=>'} {'{'}
                  <br/>
                  {'  '}<span className="keyword">if</span> (mode === <span className="string">'API'</span>) {'{'}
                  <br/>
                  {'    '}<span className="keyword">await</span> executeApiRequest(job.prompt);
                  <br/>
                  {'  '}{'} '} <span className="keyword">else</span> {'{'}
                  <br/>
                  {'    '}<span className="comment">// Fallback to DOM injection</span>
                  <br/>
                  {'    '}<span className="keyword">await</span> chrome.debugger.sendCommand(
                  <br/>
                  {'      '}target, <span className="string">"Input.dispatchKeyEvent"</span>
                  <br/>
                  {'    '});
                  <br/>
                  {'  '}{'}'}
                  <br/>
                  {'}'};
                </code>
              </pre>
            </div>
          </motion.div>

          <div className="tech-features">
            <motion.div 
              className="tech-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="tech-icon"><Code2 size={20} /></div>
              <div>
                <h4>Main World Injection</h4>
                <p>Injects code directly into the Google Flow webpage to interact seamlessly with React components and internal state.</p>
              </div>
            </motion.div>

            <motion.div 
              className="tech-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="tech-icon"><Cpu size={20} /></div>
              <div>
                <h4>Background Service Worker</h4>
                <p>Maintains your queue and manages gallery state persistently, ensuring operations continue even if tabs reload.</p>
              </div>
            </motion.div>

            <motion.div 
              className="tech-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="tech-icon"><Terminal size={20} /></div>
              <div>
                <h4>Chrome DevTools Protocol</h4>
                <p>Uses CDP for programmatic typing and clicking when API limits are reached, simulating real human interactions.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
