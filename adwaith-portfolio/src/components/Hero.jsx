import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { profile } from "../config/profile";

export default function Hero() {
  const heroRef = useRef(null);
  const artworkRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-eyebrow",{y:40,opacity:0,duration:.8})
        .from(".hero-title-line",{y:140,opacity:0,duration:1,stagger:.12},"-=.45")
        .from(".hero-description",{y:30,opacity:0,duration:.7},"-=.5")
        .from(".hero-actions",{y:30,opacity:0,duration:.7},"-=.4")
        .from(".scroll-indicator",{opacity:0,duration:.5},"-=.3");

      gsap.to(artworkRef.current,{y:-18,rotation:4,duration:3,repeat:-1,yoyo:true,ease:"sine.inOut"});
      gsap.to(".orb-inner",{rotation:-360,duration:30,repeat:-1,ease:"none"});
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"});

  return <section id="home" className="hero" ref={heroRef}>
    <div className="hero-noise"></div>
    <div className="hero-content">
      <div className="hero-eyebrow"><span className="orange-dot"></span>HELLO, I'M</div>
      <h1 className="hero-title">
        <span className="hero-title-line">ADWAITH</span>
        <span className="hero-title-line outline-text">AJAY</span>
      </h1>
      <div className="hero-bottom">
        <p className="hero-description">DEVELOPER<br />CREATOR &amp; BUILDER</p>
        <div className="hero-actions">
          <button className="outline-button magnetic" onClick={scrollToContact}>LET'S TALK <span>↗</span></button>
          <a href={profile.github} target="_blank" rel="noreferrer" className="dark-button magnetic">GITHUB <span>↗</span></a>
        </div>
      </div>
    </div>

    <div className="hero-artwork" ref={artworkRef}>
      <div className="orb">
        <div className="orb-inner">
          <span>ADWAITH</span><span>AJAY</span><span>•</span><span>CREATE</span><span>•</span><span>BUILD</span><span>•</span>
        </div>
      </div>
      <div className="orb-center">A</div>
    </div>

    <div className="scroll-indicator"><span>SCROLL TO EXPLORE</span><div className="scroll-line"></div><span>↓</span></div>
  </section>;
}