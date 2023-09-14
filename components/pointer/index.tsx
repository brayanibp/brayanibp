import { useEffect } from "react";
import { gsap } from "gsap";

export default function Pointer() {
  useEffect(()=>{
    const pointer = document.querySelector('#Pointer');
    window.addEventListener('mousemove',(event)=>{
      const { clientX, clientY } = event;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);
      gsap.to(pointer, {
        '--x':`${x}%`,
        '--y':`${y}%`,
        // left: clientX,
        duration: 0.3,
        ease: 'sine.out'
      });
    });
  },[]);
  return <>
    <span id="Pointer" className="white transparent">
      <span className="white medium">
        <span className="white strong">
          <span className="white full"></span>
        </span>
      </span>
    </span>
  </>;
}