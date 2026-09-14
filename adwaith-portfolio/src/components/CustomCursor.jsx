import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef=useRef(null);

  useEffect(()=>{
    const cursor=cursorRef.current;
    if(!cursor || window.matchMedia("(pointer: coarse)").matches) return;

    const move=e=>gsap.to(cursor,{x:e.clientX,y:e.clientY,duration:.15,ease:"power2.out"});
    const enter=()=>gsap.to(cursor,{scale:2.5,duration:.3,ease:"power3.out"});
    const leave=()=>gsap.to(cursor,{scale:1,duration:.3,ease:"power3.out"});

    window.addEventListener("mousemove",move);
    const interactive=document.querySelectorAll("a,button,input,textarea");
    interactive.forEach(el=>{el.addEventListener("mouseenter",enter);el.addEventListener("mouseleave",leave);});
    return ()=>{
      window.removeEventListener("mousemove",move);
      interactive.forEach(el=>{el.removeEventListener("mouseenter",enter);el.removeEventListener("mouseleave",leave);});
    };
  },[]);

  return <div className="custom-cursor" ref={cursorRef}></div>;
}