import React from "react";
import { profile } from "../config/profile";

export default function Footer() {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="footer-brand-name">{profile.name.toUpperCase()}</span>
          <span className="footer-role">{profile.role.toUpperCase()}</span>
        </div>
        <button className="back-top magnetic" onClick={scrollTop}>
          <span>BACK TO TOP</span>
          <span className="top-arrow">↑</span>
        </button>
      </div>

      <div className="footer-big">
        <span>BUILT</span>
        <span className="outline-text">WITH</span>
        <span>CURIOSITY.</span>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          <span>© {new Date().getFullYear()} {profile.name.toUpperCase()}. ALL RIGHTS RESERVED.</span>
        </div>
        <div className="footer-links">
          <a href={profile.github} target="_blank" rel="noreferrer" className="footer-link magnetic">
            GITHUB ↗
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="footer-link magnetic">
            LINKEDIN ↗
          </a>
          <a href={`mailto:${profile.email}`} className="footer-link magnetic">
            EMAIL ↗
          </a>
        </div>
      </div>
    </footer>
  );
}