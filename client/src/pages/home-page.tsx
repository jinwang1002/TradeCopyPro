import { useLocation } from "wouter";
import { useEffect } from "react";

export default function HomePage() {
  const [_, navigate] = useLocation();

  useEffect(() => {
    // Redirect to dashboard as the main landing page
    navigate("/dashboard");
  }, [navigate]);

  return null; // We don't render anything here as we're redirecting
}
