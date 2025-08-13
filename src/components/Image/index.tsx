import Image from "next/image";
import styles from "./image.module.css";

export default function ImageComponent({ src, alt, width, height }: { src: string, alt: string, width: number, height: number }) {
  return <Image src={src} alt={alt} width={width} height={height} className={styles.image} />
}
