import React, { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const spacing = isMobile ? 36 : 32;
    const baseDotSize = isMobile ? 1.0 : 1.2;
    const maxDotSize = isMobile ? 3.0 : 3.6;
    const mouseRadius = isMobile ? 120 : 180;

    let cols = Math.ceil(width / spacing);
    let rows = Math.ceil(height / spacing);
    let dots = new Float32Array(cols * rows);

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false
    };

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.ceil(width / spacing);
      rows = Math.ceil(height / spacing);
      dots = new Float32Array(cols * rows);
    };

    const onMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    const render = () => {
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.2;
        mouse.y += (mouse.targetY - mouse.y) * 0.2;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      ctx.clearRect(0, 0, width, height);

      // Render grid dots
      for (let r = 0; r < rows; r++) {
        const py = r * spacing + spacing / 2;
        for (let c = 0; c < cols; c++) {
          const px = c * spacing + spacing / 2;
          const idx = r * cols + c;

          let intensity = dots[idx];

          if (mouse.active) {
            const dx = mouse.x - px;
            const dy = mouse.y - py;
            const distSq = dx * dx + dy * dy;
            const radSq = mouseRadius * mouseRadius;

            if (distSq < radSq) {
              const target = Math.pow(1 - Math.sqrt(distSq) / mouseRadius, 1.6);
              if (target > intensity) {
                intensity = target;
              }
            }
          }

          // Smooth decay
          intensity *= 0.93;
          if (intensity < 0.002) intensity = 0;
          dots[idx] = intensity;

          if (intensity > 0.01) {
            const curSize = baseDotSize + (maxDotSize - baseDotSize) * intensity;
            const alpha = 0.06 + 0.85 * intensity;
            ctx.beginPath();
            ctx.arc(px, py, curSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 90, 31, ${alpha})`;
            ctx.fill();

            if (intensity > 0.4) {
              ctx.beginPath();
              ctx.arc(px, py, curSize * 2.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 130, 60, ${intensity * 0.25})`;
              ctx.fill();
            }
          } else {
            ctx.beginPath();
            ctx.arc(px, py, baseDotSize, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.fill();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div className="bg-canvas-wrapper" aria-hidden="true">
      <div className="ambient-aurora aurora-1"></div>
      <div className="ambient-aurora aurora-2"></div>
      <div className="ambient-aurora aurora-3"></div>
      <div className="bg-grain-overlay"></div>
      <canvas ref={canvasRef} className="bg-interactive-canvas" />
    </div>
  );
}
