import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer>
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