import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DriftBackground } from "./components/DriftBackground";
import { Home } from "./pages/Home";
import { PricingPage } from "./pages/PricingPage";
import { BgPlayground } from "./pages/BgPlayground";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Refund } from "./pages/Refund";
import { Guide } from "./pages/Guide";
import { ScrollToTop } from "./components/ScrollToTop";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const showHeaderFooter = location.pathname !== "/bg-playground";

  return (
    <>
      {/* Cinematic page-load reveal — fades from black to transparent once */}
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
      {showHeaderFooter && (
        <DriftBackground />
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {showHeaderFooter && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/bg-playground" element={<BgPlayground />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>
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
