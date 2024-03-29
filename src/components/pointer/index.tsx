import { useEffect } from "react";
import { gsap } from "gsap/all";

export default function Pointer() {
  useEffect(()=>{
    const pointer = document.querySelector('#Pointer');
    window.addEventListener('mousemove',(event)=>{
      if (window.innerWidth < 961) return;
      const { clientX, clientY } = event;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);
      gsap.to(pointer, {
        '--x':`${x}%`,
        '--y':`${y}%`,
        duration: 0.0,
        ease: 'sine.out'
      });
    });
  },[]);
  return <>
    <span id="Pointer" className="white transparent"></span>
  </>;
}