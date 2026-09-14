import React, { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Pixel Grid Configuration
    const isMobile = window.innerWidth < 768;
    const cellSize = isMobile ? 24 : 28; // Grid cell spacing
    const basePixelSize = isMobile ? 2.5 : 3.0; // Resting pixel size
    const maxPixelSize = cellSize * 0.88; // Prominent, chunky expanded cube size on hover (e.g. ~24px)
    const mouseRadius = isMobile ? 150 : 210;

    let cols = Math.ceil(width / cellSize);
    let rows = Math.ceil(height / cellSize);

    // Array to store pixel intensity states
    let pixelState = new Float32Array(cols * rows);

    // Mouse Tracking & Trail History
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    // Ripples / Shockwaves list
    const ripples = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
      pixelState = new Float32Array(cols * rows);
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.45,
        speed: 8.5,
        opacity: 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    // Theme calculation based on active section
    const getThemeColors = () => {
      const aboutEl = document.getElementById("about");
      const footerEl = document.querySelector(".footer");

      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const middleY = scrollY + windowH * 0.45;

      let inDarkSection = false;
      let inFooterSection = false;

      if (aboutEl) {
        const rect = aboutEl.getBoundingClientRect();
        const top = rect.top + scrollY;
        const bottom = top + rect.height;
        if (middleY >= top && middleY <= bottom) inDarkSection = true;
      }

      if (footerEl) {
        const rect = footerEl.getBoundingClientRect();
        const top = rect.top + scrollY;
        if (middleY >= top) inFooterSection = true;
      }

      if (inDarkSection) {
        // Dark section (About)
        return {
          baseRgb: "243, 239, 231",
          baseAlpha: 0.08,
          activeRgb: "255, 90, 31",
          secondaryRgb: "255, 140, 60",
          glowAlpha: 0.85,
          activeMaxAlpha: 0.95,
        };
      } else if (inFooterSection) {
        // Footer section
        return {
          baseRgb: "17, 17, 17",
          baseAlpha: 0.07,
          activeRgb: "17, 17, 17",
          secondaryRgb: "255, 255, 255",
          glowAlpha: 0.6,
          activeMaxAlpha: 0.85,
        };
      } else {
        // Cream sections (Hero, Contact)
        return {
          baseRgb: "17, 17, 17",
          baseAlpha: 0.08,
          activeRgb: "255, 90, 31",
          secondaryRgb: "17, 17, 17",
          glowAlpha: 0.75,
          activeMaxAlpha: 0.95,
        };
      }
    };

    // Helper: draw rounded rectangle / cube pixel
    const drawRoundedRect = (x, y, size, radius) => {
      const half = size / 2;
      const r = Math.min(radius, half);
      ctx.beginPath();
      ctx.moveTo(x - half + r, y - half);
      ctx.lineTo(x + half - r, y - half);
      ctx.quadraticCurveTo(x + half, y - half, x + half, y - half + r);
      ctx.lineTo(x + half, y + half - r);
      ctx.quadraticCurveTo(x + half, y + half, x + half - r, y + half);
      ctx.lineTo(x - half + r, y + half);
      ctx.quadraticCurveTo(x - half, y + half, x - half, y + half - r);
      ctx.lineTo(x - half, y - half + r);
      ctx.quadraticCurveTo(x - half, y - half, x - half + r, y - half);
      ctx.closePath();
      ctx.fill();
    };

    // Animation Loop
    const animate = () => {
      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.25;
        mouse.y += (mouse.targetY - mouse.y) * 0.25;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      ctx.clearRect(0, 0, width, height);

      const theme = getThemeColors();

      // Update ripples
      for (let rIdx = ripples.length - 1; rIdx >= 0; rIdx--) {
        const rip = ripples[rIdx];
        rip.radius += rip.speed;
        rip.opacity = Math.max(0, 1 - rip.radius / rip.maxRadius);
        if (rip.radius >= rip.maxRadius || rip.opacity <= 0) {
          ripples.splice(rIdx, 1);
        }
      }

      // Loop through all grid pixels
      for (let r = 0; r < rows; r++) {
        const cy = r * cellSize + cellSize / 2;

        for (let c = 0; c < cols; c++) {
          const cx = c * cellSize + cellSize / 2;
          const idx = r * cols + c;

          let intensity = pixelState[idx];

          // 1. Mouse Proximity Activation
          if (mouse.active) {
            const dx = mouse.x - cx;
            const dy = mouse.y - cy;
            const distSq = dx * dx + dy * dy;
            const radiusSq = mouseRadius * mouseRadius;

            if (distSq < radiusSq) {
              const targetInt = Math.pow(1 - Math.sqrt(distSq) / mouseRadius, 1.4);
              if (targetInt > intensity) {
                intensity = targetInt;
              }
            }
          }

          // 2. Ripple / Shockwave Activation
          for (let rip of ripples) {
            const rdx = rip.x - cx;
            const rdy = rip.y - cy;
            const dist = Math.sqrt(rdx * rdx + rdy * rdy);
            const ringDist = Math.abs(dist - rip.radius);
            if (ringDist < 45) {
              const ripIntensity = (1 - ringDist / 45) * rip.opacity * 0.9;
              if (ripIntensity > intensity) {
                intensity = ripIntensity;
              }
            }
          }

          // 3. Smooth Decay
          intensity *= 0.92; // Smooth trail fade
          if (intensity < 0.001) intensity = 0;
          pixelState[idx] = intensity;

          // Render Pixel
          if (intensity > 0.02) {
            // Active state: Big bold glowing cube
            const curSize = basePixelSize + (maxPixelSize - basePixelSize) * intensity;
            const alpha = theme.baseAlpha + (theme.activeMaxAlpha - theme.baseAlpha) * intensity;

            ctx.fillStyle = `rgba(${theme.activeRgb}, ${alpha})`;
            drawRoundedRect(cx, cy, curSize, curSize * 0.18);

            // Outer soft glow halo for peak cubes
            if (intensity > 0.45) {
              ctx.fillStyle = `rgba(${theme.secondaryRgb}, ${intensity * 0.22})`;
              drawRoundedRect(cx, cy, curSize * 1.35, curSize * 0.25);
            }
          } else {
            // Steady clean resting micro-dot (no sparkles)
            ctx.fillStyle = `rgba(${theme.baseRgb}, ${theme.baseAlpha})`;
            drawRoundedRect(cx, cy, basePixelSize, basePixelSize * 0.25);
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-canvas-wrapper" aria-hidden="true">
      <div className="ambient-orb ambient-orb-1"></div>
      <div className="ambient-orb ambient-orb-2"></div>
      <div className="ambient-orb ambient-orb-3"></div>
      <canvas ref={canvasRef} className="bg-interactive-canvas" />
    </div>
  );
}
