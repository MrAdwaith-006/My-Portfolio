import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../config/profile";
gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);
  const [form,setForm] = useState({name:"",email:"",message:""});
  const [submitted,setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-heading span",{y:130,opacity:0,duration:1,stagger:.12,ease:"power4.out",scrollTrigger:{trigger:".contact-heading",start:"top 80%"}});
      gsap.from(".contact-form",{y:80,opacity:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:".contact-form",start:"top 85%"}});
      gsap.from(".contact-orb",{scale:.5,rotation:-30,opacity:0,duration:1.2,ease:"back.out(1.5)",scrollTrigger:{trigger:".contact-orb",start:"top 80%"}});
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleChange = e => setForm({...form,[e.target.name]:e.target.value});

  const handleSubmit = e => {
    e.preventDefault();
    if(!form.name || !form.email || !form.message){ alert("Please fill in all fields."); return; }
    const subject=encodeURIComponent(`Message from ${form.name}`);
    const body=encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    setSubmitted(true);
    window.location.href=`mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return <section className="contact section" id="contact" ref={sectionRef}>
    <div className="section-number">02 / CONTACT</div>
    <div className="contact-heading"><span>LET'S</span><span className="outline-text">TALK.</span></div>
    <div className="contact-layout">
      <div className="contact-intro">
        <p>HAVE AN IDEA, QUESTION OR JUST WANT TO SAY HELLO?</p>
        <a href={`mailto:${profile.email}`} className="contact-email magnetic">{profile.email}</a>
        <a href={profile.github} target="_blank" rel="noreferrer" className="github-link magnetic">GITHUB ↗</a>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label><span>01 — NAME</span><input type="text" name="name" placeholder="YOUR NAME" value={form.name} onChange={handleChange}/></label>
        <label><span>02 — EMAIL</span><input type="email" name="email" placeholder="YOUR EMAIL" value={form.email} onChange={handleChange}/></label>
        <label><span>03 — MESSAGE</span><textarea name="message" placeholder="YOUR MESSAGE" rows="4" value={form.message} onChange={handleChange}></textarea></label>
        <button type="submit" className="submit-button magnetic">{submitted ? "OPENING MAIL..." : "SEND MESSAGE ↗"}</button>
      </form>
    </div>
    <div className="contact-orb"><div>SAY<br />HELLO</div></div>
  </section>;
}