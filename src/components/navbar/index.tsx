import Link from "next/link";
import { useEffect } from "react";
import Social from "../social";
import sectionsObserver from "@/utils/observer";
import Image from "next/image";

export default function Navbar() {
  useEffect(()=>{
    if (window.innerWidth < 426) return;
    const currentObserver = sectionsObserver();
    () => {
      currentObserver.disconnect();
    }
  },[]);
  return (
    <>
      <nav id="Navbar">
        <h1 className="brand">
          <figure className="icon">
            <Image src="/assets/icons/logo.png" alt="BrayanIBP Logo" height={90} width={94} priority />
          </figure>
          <span className="name">BrayanIBP</span>
          <span className="slogan">- KEEP CODING, KEEP LEARNING -</span>
        </h1>
        <h2 className="job"><span></span>Developer</h2>
        <ul className="navbar-menu">
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
          <li className="section" about="Contact">
            <span></span>
            <Link href='#Contact'>Contact Me</Link>
          </li>
        </ul>
        <Social></Social>
      </nav>
    </>
  )
}