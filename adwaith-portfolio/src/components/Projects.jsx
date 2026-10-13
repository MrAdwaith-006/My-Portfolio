import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../config/profile";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt (max 3.5 deg)
    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    
    if (glowRef.current) {
      glowRef.current.style.opacity = "1";
      const glowRgba = project.accent === "#00f0ff"
        ? "rgba(0, 240, 255, 0.22)"
        : (project.accent ? `${project.accent}2e` : "rgba(255, 90, 31, 0.18)");
      glowRef.current.style.background = `radial-gradient(circle 280px at ${x}px ${y}px, ${glowRgba}, transparent 70%)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={cardRef}
      className="project-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-text="EXPLORE"
    >
      <div ref={glowRef} className="card-spotlight-glow" aria-hidden="true" />

      <div className="card-header">
        <div className="card-number" style={project.accent ? { color: project.accent } : undefined}>0{index + 1}</div>
        <span className="card-category">{project.category}</span>
      </div>

      <div
        className="card-visual"
        style={project.accent ? {
          background: `linear-gradient(135deg, ${project.accent}1f 0%, rgba(14, 14, 20, 0.95) 100%)`
        } : undefined}
      >
        {project.image && !imgError ? (
          <>
            <img
              src={project.image}
              alt={`${project.title} interface preview`}
              className="card-visual-img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
            <div className="card-visual-overlay" aria-hidden="true" />
          </>
        ) : (
          <>
            <div className="card-visual-pattern">
              <div
                className="pattern-circle"
                style={project.accent ? { borderColor: `${project.accent}4d` } : undefined}
              />
              <div className="pattern-grid" />
            </div>
            <div className="card-visual-title">{project.title}</div>
          </>
        )}
        <div
          className="card-visual-badge"
          style={project.accent ? { color: project.accent, borderColor: `${project.accent}40` } : undefined}
        >
          {project.badge || "FEATURED WORK"}
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-desc">{project.description}</p>

        <div className="card-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        <div className="card-actions">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="card-btn primary-card-btn magnetic"
              aria-label={`View ${project.title} project`}
            >
              <span>{project.demoLabel || "VIEW PROJECT"}</span>
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`card-btn ${project.demo ? "secondary-card-btn" : "primary-card-btn"} magnetic`}
              aria-label={`View ${project.title} on GitHub repository`}
            >
              <span>GITHUB REPOSITORY</span>
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".projects-heading span", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".projects-heading",
          start: "top 80%"
        }
      });

      gsap.from(".project-card", {
        y: 70,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 80%"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="projects-section section" id="projects" ref={sectionRef}>
      <div className="section-number">03 / SELECTED WORK</div>
      <div className="projects-heading">
        <span>FEATURED</span>
        <span className="orange-text">PROJECTS.</span>
      </div>

      <div className="projects-grid">
        {profile.projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
