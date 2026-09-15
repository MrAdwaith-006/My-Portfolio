import React, { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setProgress(pct);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="scroll-progress-container" aria-hidden="true">
      <div 
        className="scroll-progress-bar" 
        style={{ width: `${progress}%` }}
      >
        <div className="scroll-progress-glow"></div>
        <div className="scroll-progress-head"></div>
      </div>
      <div className="scroll-progress-pill">
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
