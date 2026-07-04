import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion } from "motion/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SmokeBackground } from "./components/SmokeBackground";
import { Home } from "./pages/Home";
import { PricingPage } from "./pages/PricingPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
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

      {/* Dual-tone smoke background integrating with our theme */}
      <SmokeBackground smokeColorLeft="#FF6B00" smokeColorRight="#00E676" opacity={0.6} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
