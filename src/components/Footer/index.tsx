import Link from "next/link";
import style from "./footer.module.css";

const Footer = () => {
  return (
    <>
      <footer className={style["footer"]}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/">Blog</Link>
          </li>
        </ul>

        <ul>
          <li>Articles</li>
        </ul>
      </footer>
    </>
  );
}

export default Footer;