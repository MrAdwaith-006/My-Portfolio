import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable completely on touch devices or fine pointer absent
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Instant inner dot placement
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: "power2.out",
        overwrite: "auto"
      });
    };

    // Smooth ticker for the lagging outer ring
    const updateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      gsap.set(ring, { x: ringX, y: ringY });
    };

    gsap.ticker.add(updateRing);

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.body.addEventListener("mouseleave", onMouseLeave);
    document.body.addEventListener("mouseenter", onMouseEnter);

    // Event delegation for hover states
    const handleMouseOver = (e) => {
      const target = e.target.closest("a, button, input, textarea, .project-card, .terminal-window, .skill-card, .magnetic");
      if (target) {
        setIsHovered(true);
        const customText = target.getAttribute("data-cursor-text");
        if (customText) {
          setCursorText(customText);
        } else if (target.classList.contains("project-card")) {
          setCursorText("VIEW");
        } else if (target.tagName === "BUTTON" || target.tagName === "A") {
          setCursorText("");
        }
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      gsap.ticker.remove(updateRing);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      document.body.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isVisible ? "is-active" : ""} ${isClicking ? "is-clicking" : ""}`}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isVisible ? "is-active" : ""} ${isHovered ? "is-hovered" : ""} ${isClicking ? "is-clicking" : ""} ${cursorText ? "has-text" : ""}`}
        aria-hidden="true"
      >
        {cursorText && <span className="cursor-label">{cursorText}</span>}
      </div>
    </>
  );
}