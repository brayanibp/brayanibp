import Link from "next/link";
import style from "./navbar.module.css";
import Image from "next/image";

const Navbar = () => {
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
        <ul className={style["nav-ul"]}>
          <li>
            <Link href="/" className={style.option + " " + style.active}>Home</Link>
          </li>
          <li>
            <Link href="/blog" className={style.option}>Blog</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;