import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      let attempts = 0;
      const maxAttempts = 30; // 3 seconds max timeout
      const interval = setInterval(() => {
        try {
          const element = document.querySelector(hash);
          if (element) {
            clearInterval(interval);
            // Height verification helper: give layout/animations a tiny window to settle
            setTimeout(() => {
              element.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }
        } catch (e) {
          // Prevent infinite loops if querySelector throws on malformed CSS selectors
          clearInterval(interval);
        }
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
