import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
const BgPlayground = lazy(() => import("./pages/BgPlayground"));
const Privacy = lazy(() => import("./pages/Privacy").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then((m) => ({ default: m.Terms })));
const Refund = lazy(() => import("./pages/Refund").then((m) => ({ default: m.Refund })));
const Guide = lazy(() => import("./pages/Guide").then((m) => ({ default: m.Guide })));

function AppContent() {
  const location = useLocation();
  const showHeaderFooter = location.pathname !== "/bg-playground";

  return (
    <>
      {/* Cinematic page-load reveal — fades from black to transparent once */}
      <WebSiteSchema />
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

      {/* Mesh Drift WebGL1 background integrating with our theme */}
      {showHeaderFooter && <DriftBackground />}

      <div style={{ position: "relative", zIndex: 1 }}>
        {showHeaderFooter && <Header />}
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/bg-playground" element={<BgPlayground />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </Suspense>
        {showHeaderFooter && <Footer />}
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
