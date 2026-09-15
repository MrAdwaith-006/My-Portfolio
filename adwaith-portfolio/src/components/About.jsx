import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../config/profile";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-heading span", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".about-heading",
          start: "top 80%"
        }
      });

      gsap.from(".about-copy", {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-copy",
          start: "top 82%"
        }
      });

      gsap.from(".about-stats-grid .stat-item", {
        scale: 0.85,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".about-stats-grid",
          start: "top 85%"
        }
      });

      gsap.from(".about-symbol", {
        scale: 0.7,
        rotation: -15,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".about-symbol",
          start: "top 80%"
        }
      });

      gsap.to(".about-symbol", {
        y: -30,
        rotation: 6,
        ease: "none",
        scrollTrigger: {
          trigger: ".about",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="about section" id="about" ref={sectionRef}>
      <div className="section-number">01 / ABOUT</div>
      <div className="about-heading">
        <span>A LITTLE</span>
        <span className="orange-text">ABOUT</span>
        <span>ME.</span>
      </div>

      <div className="about-layout">
        <div className="about-symbol">
          <div className="symbol-a">A</div>
          <div className="symbol-circle"></div>
          <div className="symbol-badge">DEV // BUILDER</div>
        </div>

        <div className="about-copy">
          <p className="about-lead">
            Hi, I'm <strong>{profile.name}.</strong>
          </p>
          <p>
            I'm a developer who builds high-performance digital products, interactive user experiences, and reliable software backends.
          </p>
          <p>
            I focus on turning complex challenges into simple, elegant, and responsive software. From responsive frontend architectures to robust full-stack APIs, I build with attention to detail and performance.
          </p>

          <div className="about-stats-grid">
            {profile.stats.map((st) => (
              <div key={st.label} className="stat-item">
                <span className="stat-val">{st.value}</span>
                <span className="stat-lbl">{st.label}</span>
              </div>
            ))}
          </div>

          <div className="about-line"></div>
          <p className="about-small">
            ALWAYS LEARNING. ALWAYS BUILDING. COMMITTED TO EXCELLENCE.
          </p>
        </div>
      </div>
    </section>
  );
}