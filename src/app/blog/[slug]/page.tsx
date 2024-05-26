import styles from "../../page.module.css";

const Page = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  return (
    <section className={styles.main}>
      <h1>Blog Dynamic Route test {slug}</h1>
    </section>
  );
}

export default Page;