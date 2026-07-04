import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SmokeBackground } from "./components/SmokeBackground";
import { Home } from "./pages/Home";
import { PricingPage } from "./pages/PricingPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
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
