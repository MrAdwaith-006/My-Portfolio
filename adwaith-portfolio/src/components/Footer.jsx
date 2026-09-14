import React from "react";
import { profile } from "../config/profile";

export default function Footer() {
  const scrollTop=()=>window.scrollTo({top:0,behavior:"smooth"});
  return <footer className="footer">
    <div className="footer-top"><span>ADWAITH AJAY</span><button className="back-top magnetic" onClick={scrollTop}>BACK TO TOP ↑</button></div>
    <div className="footer-big"><span>BUILT</span><span className="outline-text">WITH</span><span>CURIOSITY.</span></div>
    <div className="footer-bottom">
      <span>© 2026 ADWAITH AJAY</span>
      <a href={profile.github} target="_blank" rel="noreferrer" className="magnetic">GITHUB ↗</a>
      <a href={`mailto:${profile.email}`} className="magnetic">EMAIL ↗</a>
    </div>
  </footer>;
}