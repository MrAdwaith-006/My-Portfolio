import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../config/profile";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

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
      glowRef.current.style.background = `radial-gradient(circle 280px at ${x}px ${y}px, rgba(255, 90, 31, 0.18), transparent 70%)`;
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
        <div className="card-number">0{index + 1}</div>
        <span className="card-category">{project.category}</span>
      </div>

      <div className="card-visual">
        <div className="card-visual-pattern">
          <div className="pattern-circle"></div>
          <div className="pattern-grid"></div>
        </div>
        <div className="card-visual-title">{project.title}</div>
        <div className="card-visual-badge">FEATURED WORK</div>
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
          {project.demo && project.demo !== project.github && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="card-btn primary-card-btn magnetic"
            >
              <span>LIVE DEMO</span>
              <span className="btn-arrow">↗</span>
            </a>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className={`card-btn ${project.demo && project.demo !== project.github ? "secondary-card-btn" : "primary-card-btn"} magnetic`}
          >
            <span>GITHUB REPOSITORY</span>
            <span className="btn-arrow">↗</span>
          </a>
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
