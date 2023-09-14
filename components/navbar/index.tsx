import Link from "next/link";
import { useEffect } from "react";
import Social from "../social";

export default function Navbar() {
  useEffect(()=>{
    const options = document.querySelectorAll('#Navbar ul li');
    options.forEach((option, index)=>{
      option.addEventListener('click',(event: Event)=>{
        const target = event.currentTarget as Element;
        document.querySelector('#Navbar ul .section.active')?.classList.remove('active');
        target.classList.add('active');
      });
      window.addEventListener('scroll',(event)=>{
        console.log('innerHeight',window.innerHeight);
        console.log((event.currentTarget as Element).scrollTop);
      })
    });

  },[]);
  return (
    <>
      <nav id="Navbar">
        <h1 className="name">Brayan Bernal</h1>
        <h2 className="job"><span></span>Developer</h2>
        <ul>
          <li className="section active" about="About">
            <span></span>
            <Link href='#About'>About Me</Link>
          </li>
          <li className="section" about="Experience">
            <span></span>
            <Link href='#Experience'>Experience</Link>
          </li>
          <li className="section" about="Projects">
            <span></span>
            <Link href='#Projects'>Projects</Link>
          </li>
          {/* <li className="section" about="Contact">
            <span></span>
            <Link href='#Contact'>Contact Me</Link>
          </li> */}
        </ul>
        <Social></Social>
      </nav>
    </>
  )
}