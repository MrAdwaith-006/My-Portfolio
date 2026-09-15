import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile } from "../config/profile";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const linksRef = useRef([]);
  const socialRef = useRef(null);

  const navItems = [
    { label: "HOME", id: "home" },
    { label: "ABOUT", id: "about" },
    { label: "TERMINAL", id: "terminal" },
    { label: "PROJECTS", id: "projects" },
    { label: "SKILLS", id: "skills" },
    { label: "CONTACT", id: "contact" }
  ];

  const openMenu = () => setOpen(true);

  const closeMenu = () => {
    const tl = gsap.timeline({ onComplete: () => setOpen(false) });
    tl.to(linksRef.current, {
      y: 60,
      opacity: 0,
      duration: 0.3,
      stagger: 0.03,
      ease: "power3.in"
    })
      .to(socialRef.current, { opacity: 0, y: 15, duration: 0.2 }, "-=0.15")
      .to(
        menuRef.current,
        { clipPath: "inset(0 0 100% 0)", duration: 0.55, ease: "power4.inOut" },
        "-=0.1"
      );
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const tl = gsap.timeline();
    tl.set(menuRef.current, { clipPath: "inset(0 0 100% 0)" })
      .to(menuRef.current, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.65,
        ease: "power4.inOut"
      })
      .to(
        linksRef.current,
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power4.out" },
        "-=0.25"
      )
      .to(
        socialRef.current,
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
        "-=0.25"
      );
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const navigate = (id) => {
    if (open) closeMenu();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, open ? 500 : 0);
  };

  return (
    <>
      <header className="navbar">
        <a
          href="#home"
          className="nav-logo magnetic"
          onClick={(e) => {
            e.preventDefault();
            navigate("home");
          }}
        >
          <span className="logo-text">{profile.name.toUpperCase()}</span>
          <span className="logo-dot"></span>
        </a>

        <div className="nav-desktop-links">
          {navItems.slice(1).map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className="nav-item-link magnetic"
            >
              <span>{item.label}</span>
              <span className="nav-underline"></span>
            </button>
          ))}
        </div>

        <button
          className="menu-button magnetic"
          onClick={openMenu}
          aria-label="Open navigation menu"
        >
          <span>MENU</span>
          <div className="menu-icon">
            <i></i>
            <i></i>
          </div>
        </button>
      </header>

      {open && (
        <div className="fullscreen-menu" ref={menuRef}>
          <div className="menu-top">
            <span className="menu-brand">{profile.name.toUpperCase()} // PORTFOLIO</span>
            <button
              className="close-button magnetic"
              onClick={closeMenu}
              aria-label="Close navigation"
            >
              <span>CLOSE</span>
              <span className="close-x">×</span>
            </button>
          </div>

          <nav className="menu-links">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                ref={(el) => (linksRef.current[index] = el)}
                onClick={() => navigate(item.id)}
                className="menu-link"
              >
                <span className="menu-num">0{index + 1}</span>
                <span className="menu-txt">{item.label}</span>
                <span className="menu-arrow">↗</span>
              </button>
            ))}
          </nav>

          <div className="menu-bottom" ref={socialRef}>
            <div className="menu-socials-group">
              <span className="menu-bottom-title">GET IN TOUCH</span>
              <a href={`mailto:${profile.email}`} className="menu-email">
                {profile.email}
              </a>
            </div>
            <div className="menu-socials-group">
              <span className="menu-bottom-title">FIND ONLINE</span>
              <div className="menu-social-links">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="menu-social magnetic"
                >
                  GITHUB ↗
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="menu-social magnetic"
                >
                  LINKEDIN ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}