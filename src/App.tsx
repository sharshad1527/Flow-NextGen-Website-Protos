import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "motion/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DriftBackground } from "./components/DriftBackground";
import { ScrollToTop } from "./components/ScrollToTop";
import { PageLoading } from "./components/PageLoading";
import { WebSiteSchema } from "./components/JSONLD";
import "./App.css";

// Lazy-loaded pages for code-splitting — each page chunk loads only when navigated to
const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const PricingPage = lazy(() => import("./pages/PricingPage").then((m) => ({ default: m.PricingPage })));

const Privacy = lazy(() => import("./pages/Privacy").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then((m) => ({ default: m.Terms })));
const Refund = lazy(() => import("./pages/Refund").then((m) => ({ default: m.Refund })));
const Guide = lazy(() => import("./pages/Guide").then((m) => ({ default: m.Guide })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

function AppContent() {
  const [showFade, setShowFade] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowFade(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Skip-to-content link for keyboard users — appears on Tab press */}
      <a
        href="#main-content"
        style={{
          position: 'fixed',
          top: '-100%',
          left: 0,
          zIndex: 99999,
          padding: '1rem 2rem',
          background: '#FF6B00',
          color: '#F5F5F5',
          fontWeight: 600,
          fontSize: '1rem',
          textDecoration: 'none',
          borderRadius: '0 0 8px 0',
          transition: 'top 0.2s ease',
        }}
        onFocus={(e) => { e.currentTarget.style.top = '0' }}
        onBlur={(e) => { e.currentTarget.style.top = '-100%' }}
      >
        Skip to content
      </a>

      {/* Cinematic page-load reveal — fades from black to transparent once */}
      <WebSiteSchema />
      {showFade && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            zIndex: 99999,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Mesh Drift WebGL1 background integrating with our theme */}
      <DriftBackground />

      <div id="main-content" role="main" style={{ position: "relative", zIndex: 1 }}>
        <Header />
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
