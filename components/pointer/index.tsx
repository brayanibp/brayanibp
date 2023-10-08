import { useEffect, useState } from "react";
import { gsap } from "gsap";

export default function Pointer() {
  const [showPointer, setShowPointer] = useState(true);
  // const dispatchPointer = () => {
  //   if (window.innerWidth < 961) {
  //     setShowPointer(false);
  //     return;
  //   }
  //   setShowPointer(true);
  //   return;
  // }
  useEffect(()=>{
    const pointer = document.querySelector('#Pointer');
    // window.addEventListener('load', dispatchPointer);
    // window.addEventListener('resize', dispatchPointer);
    window.addEventListener('mousemove',(event)=>{
      if (window.innerWidth < 961) return;
      const { clientX, clientY } = event;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);
      gsap.to(pointer, {
        '--x':`${x}%`,
        '--y':`${y}%`,
        // left: clientX,
        duration: 0.1,
        ease: 'sine.out'
      });
    });
  },[]);
  return <>
   {
    showPointer && (
      <span id="Pointer" className="white transparent">
        <span className="white medium">
          <span className="white strong">
            <span className="white full"></span>
          </span>
        </span>
      </span>
    )
   }
  </>;
}