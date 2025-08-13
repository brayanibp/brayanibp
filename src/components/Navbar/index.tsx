"use client";
import Link from "next/link";
import Image from "next/image";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import style from "./navbar.module.css";
import { useEffect, useRef } from "react";

const Navbar = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <nav id="navbar" className={style.nav}>
        <h1 className={style.brand}>
          <figure className={style.icon}>
            <Image src="/assets/icons/logo.png" alt="BrayanIBP Logo" height={45} width={47} priority />
          </figure>
          <span className={style.name}>BrayanIBP</span>
          <span className={style.slogan}>- KEEP CODING, KEEP LEARNING -</span>
        </h1>

        <div className={style.search}>
          <input ref={inputRef} type="search" placeholder="Search" aria-label="Search" />
          <kbd className={style.kbd}>⌘K</kbd>
        </div>

        <ul className={style["nav-ul"]}>
          <li>
            <Link 
              href="/" 
              className={`${style.option} ${style.active}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/blog" 
              className={style.option}
            >
              Blog
            </Link>
          </li>
        </ul>
        <div className={style.actions}>
          <ThemeSwitcher />
        </div>
      </nav>
    </>
  );
}

export default Navbar;