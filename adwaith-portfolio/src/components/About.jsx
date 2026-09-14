import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-heading span",{y:100,opacity:0,duration:1,stagger:.12,ease:"power4.out",scrollTrigger:{trigger:".about-heading",start:"top 80%"}});
      gsap.from(".about-copy",{y:70,opacity:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:".about-copy",start:"top 82%"}});
      gsap.from(".about-symbol",{scale:.5,rotation:-20,opacity:0,duration:1.2,ease:"back.out(1.7)",scrollTrigger:{trigger:".about-symbol",start:"top 80%"}});
      gsap.to(".about-symbol",{y:-30,rotation:8,ease:"none",scrollTrigger:{trigger:".about",start:"top bottom",end:"bottom top",scrub:1}});
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return <section className="about section" id="about" ref={sectionRef}>
    <div className="section-number">01 / ABOUT</div>
    <div className="about-heading"><span>A LITTLE</span><span className="orange-text">ABOUT</span><span>ME.</span></div>
    <div className="about-layout">
      <div className="about-symbol"><div className="symbol-a">A</div><div className="symbol-circle"></div></div>
      <div className="about-copy">
        <p className="about-lead">Hi, I'm <strong>Adwaith Ajay.</strong></p>
        <p>I'm a developer who enjoys turning ideas into useful digital experiences.</p>
        <p>I enjoy learning new technologies, experimenting with ideas and building things that feel simple, useful and thoughtfully designed.</p>
        <div className="about-line"></div>
        <p className="about-small">ALWAYS LEARNING.<br />ALWAYS BUILDING.</p>
      </div>
    </div>
  </section>;
}