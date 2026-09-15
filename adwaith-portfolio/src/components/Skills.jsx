import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../config/profile";

gsap.registerPlugin(ScrollTrigger);

const getSkillIcon = (name) => {
  switch (name.toLowerCase()) {
    case "python":
      return (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
          <path d="M11.91 2C6.44 2 6.78 4.38 6.78 4.38L6.8 6.84H12.1V7.6H4.37S2 7.33 2 12.8c0 5.46 2.07 5.25 2.07 5.25h1.23v-2.58s-.07-2.95 2.88-2.95h5.05s2.76.04 2.76-2.69V4.69S16.5 2 11.91 2zm-2.07 1.83a.92.92 0 1 1 0 1.84.92.92 0 0 1 0-1.84z" fill="#387EB8"/>
          <path d="M12.09 22c5.47 0 5.13-2.38 5.13-2.38l-.02-2.46h-5.3v-.76h7.73s2.37.27 2.37-5.2c0-5.46-2.07-5.25-2.07-5.25h-1.23v2.58s.07 2.95-2.88 2.95H10.77s-2.76-.04-2.76 2.69v5.14S7.5 22 12.09 22zm2.07-1.83a.92.92 0 1 1 0-1.84.92.92 0 0 1 0 1.84z" fill="#FFE873"/>
        </svg>
      );
    case "javascript":
      return (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
          <rect width="24" height="24" rx="5" fill="#F7DF1E"/>
          <path d="M7.2 16.6c.5.8 1.2 1.3 2.2 1.3 1.2 0 2-.6 2-2.2v-6.6H9.3v6.5c0 .6-.3.9-.8.9-.4 0-.7-.2-.9-.6l-.4.7zm8.1-.2c.6 1 1.6 1.5 2.8 1.5 1.7 0 2.8-.9 2.8-2.3 0-1.4-.9-2-2.3-2.6l-.8-.3c-.7-.3-1.1-.6-1.1-1.2 0-.6.5-1.1 1.3-1.1.7 0 1.3.3 1.7.9l1.4-1c-.7-1.1-1.7-1.5-3.1-1.5-1.9 0-3.1 1.1-3.1 2.6 0 1.3.8 2 2.1 2.5l.8.3c.8.4 1.3.7 1.3 1.4 0 .7-.6 1.2-1.5 1.2-.9 0-1.6-.5-2.1-1.3l-1.4.8z" fill="#000000"/>
        </svg>
      );
    case "react":
      return (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#61DAFB" strokeWidth="1.5">
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="2.2" fill="#61DAFB" stroke="none" />
        </svg>
      );
    case "node.js":
    case "nodejs":
      return (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
          <path d="M12 2L3 7.2v10.4L12 22.8l9-5.2V7.2L12 2z" fill="rgba(104, 160, 99, 0.15)" stroke="#68A063" strokeWidth="1.8"/>
          <path d="M12 6.5l4.8 2.8v5.6L12 17.7l-4.8-2.8V9.3L12 6.5z" stroke="#68A063" strokeWidth="1.2"/>
          <circle cx="12" cy="12" r="2" fill="#68A063"/>
        </svg>
      );
    case "html":
    case "html5":
      return (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
          <path d="M4 2.5l1.6 18.2L12 23l6.4-2.3L20 2.5H4z" fill="#E34F26" />
          <path d="M12 4.1v17.1l5-1.8 1.3-15.3H12z" fill="#EF652A" />
          <path d="M8.2 7.2h7.6l-.2 2.3H12v2.3h3.4l-.5 5.5-2.9 1-2.9-1-.2-2.5h2.1l.1 1.2 1 .3 1-.3.2-2.1H8.5L8.2 7.2z" fill="#ffffff" />
        </svg>
      );
    case "css":
    case "css3":
      return (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
          <path d="M4 2.5l1.6 18.2L12 23l6.4-2.3L20 2.5H4z" fill="#1572B6" />
          <path d="M12 4.1v17.1l5-1.8 1.3-15.3H12z" fill="#33A9DC" />
          <path d="M8.2 7.2h7.6l-.2 2.3H12v2.3h3.4l-.5 5.5-2.9 1-2.9-1-.2-2.5h2.1l.1 1.2 1 .3 1-.3.2-2.1H8.5L8.2 7.2z" fill="#ffffff" />
        </svg>
      );
    default:
      return <span style={{ fontSize: "22px" }}>⚡</span>;
  }
};

function SkillCard({ skill, index }) {
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

    // 3D tilt calculation
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    if (glowRef.current) {
      glowRef.current.style.opacity = "1";
      glowRef.current.style.background = `radial-gradient(circle 240px at ${x}px ${y}px, ${skill.accentGlow || "rgba(255, 90, 31, 0.2)"}, transparent 70%)`;
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
      className="skill-box-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-text="TECH"
      style={{ "--skill-color": skill.color }}
    >
      {/* Dynamic Cursor Spotlight Glow */}
      <div ref={glowRef} className="skill-box-spotlight" aria-hidden="true" />

      {/* Subtle Ambient Corner Accent */}
      <div
        className="skill-box-corner-glow"
        style={{
          background: `radial-gradient(circle at 100% 0%, ${skill.accentGlow || "rgba(255, 90, 31, 0.15)"} 0%, transparent 65%)`
        }}
        aria-hidden="true"
      />

      {/* Top Header with Icon, Index & Level Badge */}
      <div className="skill-box-header">
        <div className="skill-box-icon-wrap" style={{ borderColor: `${skill.color}33` }}>
          <div className="skill-icon-inner">{getSkillIcon(skill.name)}</div>
        </div>

        <div className="skill-box-meta">
          <span className="skill-box-num">0{index + 1}</span>
          <span className="skill-box-badge" style={{ color: skill.color, borderColor: `${skill.color}44` }}>
            {skill.level.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="skill-box-body">
        <div className="skill-box-title-group">
          <h3 className="skill-box-name">{skill.name}</h3>
          <span className="skill-box-category">{skill.category}</span>
        </div>
        <p className="skill-box-desc">{skill.description}</p>
      </div>

      {/* Animated Mastery Progress Bar */}
      <div className="skill-box-progress-wrap">
        <div className="skill-box-progress-info">
          <span className="progress-lbl">PROFICIENCY</span>
          <span className="progress-val" style={{ color: skill.color }}>{skill.percentage}%</span>
        </div>
        <div className="skill-box-track">
          <div
            className="skill-box-bar"
            style={{
              width: `${skill.percentage}%`,
              background: `linear-gradient(90deg, ${skill.color}88 0%, ${skill.color} 100%)`,
              boxShadow: `0 0 10px ${skill.color}66`
            }}
          />
        </div>
      </div>

      {/* Skill Key Highlights / Tags */}
      <div className="skill-box-tags">
        {skill.tags.map((tag) => (
          <span key={tag} className="skill-tag-chip">
            <span className="tag-chip-dot" style={{ background: skill.color }} />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skills-heading span", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".skills-heading",
          start: "top 80%"
        }
      });

      gsap.from(".skill-box-card", {
        y: 60,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 82%"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="skills-section section" id="skills" ref={sectionRef}>
      <div className="section-number">04 / CAPABILITIES</div>
      <div className="skills-heading">
        <span>TECH</span>
        <span className="outline-text">STACK</span>
        <span className="orange-text">&amp; TOOLS.</span>
      </div>

      {/* Animated Skill Boxes Grid */}
      <div className="skills-grid">
        {profile.skills.map((skill, index) => (
          <SkillCard key={skill.name} skill={skill} index={index} />
        ))}
      </div>
    </section>
  );
}

