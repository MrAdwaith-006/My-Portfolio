import React, { useEffect, useRef } from "react";

export default function Hero3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement.clientHeight || 400);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 400;
      height = canvas.height = canvas.parentElement.clientHeight || 400;
    };

    window.addEventListener("resize", onResize);

    // 3D Geometry vertices for a geodesic icosahedron
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];

    // Normalize vertices to unit sphere
    const vertices = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [x / len, y / len, z / len];
    });

    // Edges connecting vertices
    const edges = [];
    const threshold = 1.1; // Distance connecting adjacent vertices
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const [x1, y1, z1] = vertices[i];
        const [x2, y2, z2] = vertices[j];
        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
        if (dist < threshold) {
          edges.push([i, j]);
        }
      }
    }

    // Orbiting particle points
    const numParticles = 48;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phiAngle = Math.acos(Math.random() * 2 - 1);
      const r = 1.15 + Math.random() * 0.45;
      particles.push({
        x: r * Math.sin(phiAngle) * Math.cos(theta),
        y: r * Math.sin(phiAngle) * Math.sin(theta),
        z: r * Math.cos(phiAngle),
        speed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2.2 + 1.2,
        opacity: Math.random() * 0.6 + 0.4
      });
    }

    let rotX = 0.4;
    let rotY = 0.2;
    let targetRotX = 0.4;
    let targetRotY = 0.2;
    let mouseActive = false;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      targetRotY = dx * 0.8;
      targetRotX = -dy * 0.8;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    // Rotation helper
    const rotate3D = (x, y, z, rx, ry, rz) => {
      // Rotate around Y
      let x1 = x * Math.cos(ry) + z * Math.sin(ry);
      let y1 = y;
      let z1 = -x * Math.sin(ry) + z * Math.cos(ry);

      // Rotate around X
      let x2 = x1;
      let y2 = y1 * Math.cos(rx) - z1 * Math.sin(rx);
      let z2 = y1 * Math.sin(rx) + z1 * Math.cos(rx);

      // Rotate around Z
      let x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
      let z3 = z2;

      return [x3, y3, z3];
    };

    let time = 0;

    const render = () => {
      time += 0.012;

      // Smooth inertia rotation
      rotX += (targetRotX + Math.sin(time * 0.7) * 0.15 - rotX) * 0.05;
      rotY += (targetRotY + time * 0.35 - rotY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.36;
      const fov = 400;

      // Draw outer ambient ring
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, scale * 1.35, scale * 0.45, rotY * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 90, 31, 0.18)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 12]);
      ctx.stroke();
      ctx.restore();

      // Project vertices
      const projected = vertices.map(([vx, vy, vz]) => {
        const [rx, ry, rz] = rotate3D(vx, vy, vz, rotX, rotY, time * 0.1);
        const depth = fov / (fov + rz * scale);
        return {
          x: cx + rx * scale * depth,
          y: cy + ry * scale * depth,
          z: rz,
          depth
        };
      });

      // Draw Edges
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.12, Math.min(0.9, (avgZ + 1.2) / 2.2));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 90, 31, ${alpha * 0.75})`;
        ctx.lineWidth = 1.2 + alpha * 0.8;
        ctx.stroke();
      });

      // Draw Nodes / Vertices with glowing dots
      projected.forEach((p) => {
        const nodeAlpha = Math.max(0.2, (p.z + 1.2) / 2.2);
        const radius = (p.z > 0 ? 3.8 : 2.4) * p.depth;

        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 120, 50, ${nodeAlpha * 0.25})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 240, 230, ${nodeAlpha})`;
        ctx.fill();
      });

      // Orbiting particles
      particles.forEach((pt) => {
        // Update particle angle
        pt.x = pt.x * Math.cos(pt.speed) - pt.z * Math.sin(pt.speed);
        pt.z = pt.x * Math.sin(pt.speed) + pt.z * Math.cos(pt.speed);

        const [rx, ry, rz] = rotate3D(pt.x, pt.y, pt.z, rotX * 0.5, rotY * 0.8, 0);
        const depth = fov / (fov + rz * scale);
        const px = cx + rx * scale * depth;
        const py = cy + ry * scale * depth;
        const pAlpha = Math.max(0.1, ((rz + 1.4) / 2.8) * pt.opacity);

        ctx.beginPath();
        ctx.arc(px, py, pt.size * depth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 90, 31, ${pAlpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="hero-3d-wrapper" aria-label="Interactive 3D Geometric Object">
      <canvas ref={canvasRef} className="hero-3d-canvas" />
      <div className="hero-3d-badge">
        <span className="badge-pulse"></span>
        <span className="badge-text">INTERACTIVE 3D • DRAG & HOVER</span>
      </div>
    </div>
  );
}
