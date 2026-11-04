import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
import { getPost, getPostSlugs, type Post } from "@/lib/posts";

const fetchPostsPreviews = async (): Promise<Post[]> => {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPost(slug)));

  return posts.filter((post): post is Post => post !== null);
};

const Blog = async () => {
  const posts = await fetchPostsPreviews();

  return (
    <>
      <section className={styles.blog}>
        <h2>Recent Posts</h2>
        <ul>
          {posts.map((post) => {
            const { frontmatter, slug } = post;

            return (
              <li key={slug}>
                <Link className={styles.preview} href={`/blog/${slug}`}>
                  <div className={styles["img-container"]}>
                    <Image
                      src={frontmatter.thumbnailUrl}
                      alt={frontmatter.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="100%"
                    />
                  </div>
                  <div className={styles.content}>
                    <h3>{frontmatter.title}</h3>
                    <br />
                    <p>{frontmatter.description}</p>
                    <p className={styles.date}>{frontmatter.date.toString()}</p>
                    <ul>
                      {frontmatter.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <span>Read More...</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};

export default Blog;
