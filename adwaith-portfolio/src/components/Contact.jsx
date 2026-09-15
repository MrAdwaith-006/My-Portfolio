import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../config/profile";

gsap.registerPlugin(ScrollTrigger);

function ConnectCard({
  link,
  title,
  platform,
  username,
  description,
  badge,
  badgeColor,
  icon,
  accentGlow,
  accentColor,
  btnText
}) {
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

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    if (glowRef.current) {
      glowRef.current.style.opacity = "1";
      glowRef.current.style.background = `radial-gradient(circle 280px at ${x}px ${y}px, ${accentGlow}, transparent 70%)`;
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
    <a
      ref={cardRef}
      href={link}
      target="_blank"
      rel="noreferrer"
      className="connect-animated-card magnetic"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-text="CONNECT"
      style={{ "--accent-color": accentColor }}
    >
      <div ref={glowRef} className="connect-card-glow" aria-hidden="true" />

      <div className="connect-card-top">
        <div className="connect-icon-wrapper" style={{ borderColor: `${accentColor}44` }}>
          {icon}
        </div>
        <span className="connect-badge" style={{ color: badgeColor, borderColor: `${badgeColor}44` }}>
          <span className="connect-badge-dot" style={{ background: badgeColor }} />
          {badge}
        </span>
      </div>

      <div className="connect-card-content">
        <div className="connect-card-platform">{platform}</div>
        <h4 className="connect-card-title">{title}</h4>
        <div className="connect-card-user">{username}</div>
        <p className="connect-card-desc">{description}</p>
      </div>

      <div className="connect-card-action">
        <span className="connect-action-text">{btnText}</span>
        <span className="connect-action-arrow">↗</span>
      </div>
    </a>
  );
}

export default function Contact() {
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-heading span", {
        y: 130,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".contact-heading",
          start: "top 80%"
        }
      });

      gsap.from(".contact-intro", {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-layout",
          start: "top 82%"
        }
      });

      gsap.from(".contact-form", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-form",
          start: "top 85%"
        }
      });

      gsap.from(".connect-animated-card", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-connect-hub",
          start: "top 85%"
        }
      });

      gsap.from(".contact-orb", {
        scale: 0.6,
        rotation: -30,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".contact-connect-hub",
          start: "top 85%"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in all fields.");
      return;
    }
    const subject = encodeURIComponent(`Portfolio Message from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    setSubmitted(true);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact section" id="contact" ref={sectionRef}>
      <div className="section-number">05 / CONTACT</div>
      <div className="contact-heading">
        <span>LET'S</span>
        <span className="orange-text">TALK.</span>
      </div>

      <div className="contact-layout">
        <div className="contact-intro">
          <p className="contact-lead-text">
            HAVE AN IDEA, QUESTION, PROJECT, OR JUST WANT TO SAY HELLO?
          </p>

          <div className="email-copy-box">
            <span className="email-label">DIRECT EMAIL:</span>
            <div className="email-row">
              <a href={`mailto:${profile.email}`} className="contact-email">
                {profile.email}
              </a>
              <button
                type="button"
                className="copy-btn magnetic"
                onClick={copyEmail}
                aria-label="Copy email address"
              >
                {copied ? "COPIED! ✓" : "COPY 📋"}
              </button>
            </div>
          </div>

          <div className="contact-socials">
            <span className="socials-label">FIND ME ONLINE:</span>
            <div className="socials-list">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="social-pill magnetic"
              >
                <span>GITHUB</span>
                <span className="pill-arrow">↗</span>
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="social-pill magnetic"
              >
                <span>LINKEDIN</span>
                <span className="pill-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            <span>01 — YOUR NAME</span>
            <input
              type="text"
              name="name"
              placeholder="e.g. Alex Morgan"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span>02 — YOUR EMAIL</span>
            <input
              type="email"
              name="email"
              placeholder="e.g. alex@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span>03 — YOUR MESSAGE</span>
            <textarea
              name="message"
              placeholder="Tell me about your project or idea..."
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <button type="submit" className="submit-button magnetic">
            <span>{submitted ? "OPENING EMAIL CLIENT..." : "SEND MESSAGE"}</span>
            <span className="btn-arrow">↗</span>
          </button>
        </form>
      </div>

      {/* Animated Social Profile Connect Zone in the bottom space */}
      <div className="contact-connect-hub">
        <div className="connect-hub-header">
          <span className="connect-hub-eyebrow">DIRECT NETWORKS</span>
          <h3 className="connect-hub-title">CONNECT ON SOCIALS</h3>
        </div>

        <div className="connect-hub-grid">
          <ConnectCard
            link={profile.github}
            platform="GITHUB PROFILE"
            title="Code Repositories"
            username="@MrAdwaith-006"
            description="Explore open-source projects, source code architectures, and developer commits."
            badge="ACTIVE CODEBASE"
            badgeColor="#ff7a00"
            accentColor="#ffffff"
            accentGlow="rgba(255, 90, 31, 0.28)"
            btnText="VISIT GITHUB PROFILE"
            icon={
              <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            }
          />

          <ConnectCard
            link={profile.linkedin}
            platform="LINKEDIN NETWORK"
            title="Adwaith Ajay"
            username="in/adwaith--ajay"
            description="Connect for software engineering collaborations, professional networking, and job opportunities."
            badge="OPEN TO CONNECT"
            badgeColor="#00E5FF"
            accentColor="#0A66C2"
            accentGlow="rgba(10, 102, 194, 0.35)"
            btnText="CONNECT ON LINKEDIN"
            icon={
              <svg viewBox="0 0 24 24" width="36" height="36" fill="#0A66C2">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            }
          />

          <div className="contact-orb">
            <div>
              <span>SAY</span>
              <br />
              <span>HELLO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}