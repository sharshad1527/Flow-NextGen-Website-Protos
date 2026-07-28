import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import "./NotFound.css";

export function NotFound() {
  return (
    <div className="not-found-page">
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
      />
      <div className="not-found-container">
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-text">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="not-found-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
