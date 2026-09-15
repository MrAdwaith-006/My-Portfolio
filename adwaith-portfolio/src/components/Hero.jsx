import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { profile } from "../config/profile";
import Hero3D from "./Hero3D";

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-status-pill", { y: -30, opacity: 0, duration: 0.8 })
        .from(".hero-eyebrow", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(".hero-title-line", { y: 120, opacity: 0, duration: 1.1, stagger: 0.14 }, "-=0.6")
        .from(".hero-description", { y: 30, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-actions button, .hero-actions a", { y: 30, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
        .from(".hero-3d-wrapper", { scale: 0.75, opacity: 0, duration: 1.2, ease: "back.out(1.4)" }, "-=0.8")
        .from(".scroll-indicator", { opacity: 0, duration: 0.6 }, "-=0.4");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-noise"></div>

      <div className="hero-content">
        <div className="hero-status-pill">
          <span className="status-dot"></span>
          <span className="status-text">{profile.status.toUpperCase()}</span>
        </div>

        <div className="hero-eyebrow">
          <span className="orange-dot"></span>
          <span>HELLO, I'M</span>
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line">ADWAITH</span>
          <span className="hero-title-line outline-text">AJAY</span>
        </h1>

        <div className="hero-bottom">
          <p className="hero-description">
            DEVELOPER &amp; BUILDER<br />
            TURNING IDEAS INTO IMPACTFUL DIGITAL EXPERIENCES
          </p>
          <div className="hero-actions">
            <button className="outline-button magnetic" onClick={scrollToProjects}>
              <span>VIEW WORK</span>
              <span className="btn-arrow">↓</span>
            </button>
            <button className="dark-button magnetic" onClick={scrollToContact}>
              <span>LET'S TALK</span>
              <span className="btn-arrow">↗</span>
            </button>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="ghost-button magnetic"
            >
              <span>GITHUB</span>
              <span className="btn-arrow">↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="hero-artwork-area">
        <Hero3D />
      </div>

      <div className="scroll-indicator" onClick={scrollToProjects} role="button" tabIndex={0}>
        <span>SCROLL TO EXPLORE</span>
        <div className="scroll-line"></div>
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  );
}