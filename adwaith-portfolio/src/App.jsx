import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import InteractiveBackground from "./components/InteractiveBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Terminal from "./components/Terminal";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false
    });

    lenis.scrollTo(0, { immediate: true });

    lenis.on("scroll", ScrollTrigger.update);
    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <ScrollProgress />
      <InteractiveBackground />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Terminal />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}