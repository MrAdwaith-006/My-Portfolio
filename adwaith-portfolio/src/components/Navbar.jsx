import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { profile } from "../config/profile";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const linksRef = useRef([]);
  const socialRef = useRef(null);

  const openMenu = () => setOpen(true);

  const closeMenu = () => {
    const tl = gsap.timeline({ onComplete: () => setOpen(false) });
    tl.to(linksRef.current, { y: 80, opacity: 0, duration: .35, stagger: .04, ease: "power3.in" })
      .to(socialRef.current, { opacity: 0, y: 20, duration: .25 }, "-=.15")
      .to(menuRef.current, { clipPath: "inset(0 0 100% 0)", duration: .65, ease: "power4.inOut" }, "-=.15");
  };

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const tl = gsap.timeline();
    tl.set(menuRef.current, { clipPath: "inset(0 0 100% 0)" })
      .to(menuRef.current, { clipPath: "inset(0 0 0% 0)", duration: .75, ease: "power4.inOut" })
      .to(linksRef.current, { y: 0, opacity: 1, duration: .7, stagger: .08, ease: "power4.out" }, "-=.3")
      .to(socialRef.current, { y: 0, opacity: 1, duration: .5, ease: "power3.out" }, "-=.3");
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navigate = (id) => {
    closeMenu();
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 700);
  };

  return <>
    <header className="navbar">
      <a href="#home" className="nav-logo magnetic" onClick={(e) => { e.preventDefault(); navigate("home"); }}>
        ADWAITH AJAY
      </a>
      <button className="menu-button magnetic" onClick={openMenu} aria-label="Open navigation">
        <span>MENU</span>
        <div className="menu-icon"><i></i><i></i><i></i></div>
      </button>
    </header>

    {open && <div className="fullscreen-menu" ref={menuRef}>
      <div className="menu-top">
        <span>ADWAITH AJAY</span>
        <button className="close-button" onClick={closeMenu} aria-label="Close navigation">CLOSE <span>×</span></button>
      </div>
      <nav className="menu-links">
        {[["HOME","home"],["ABOUT","about"],["CONTACT","contact"]].map(([label,id],index) =>
          <button key={id} ref={el => linksRef.current[index] = el} onClick={() => navigate(id)} className="menu-link">
            <span>0{index+1}</span>{label}
          </button>
        )}
      </nav>
      <div className="menu-bottom" ref={socialRef}>
        <span>FIND ME ONLINE</span>
        <a href={profile.github} target="_blank" rel="noreferrer" className="menu-social magnetic">GITHUB ↗</a>
      </div>
    </div>}
  </>;
}