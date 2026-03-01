import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog-firestore";

export const dynamic = 'force-dynamic';

const Blog = async () => {
  const posts = await getAllPosts();

  return (
    <>
      <section className={styles.blog}>
        <h2>Recent Posts</h2>
        {posts.length === 0 ? (
          <p>No posts found. Add posts in Firebase.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <Link className={styles.preview} href={`/blog/${post.slug}`}>
                  <div className={styles["img-container"]}>
                    <Image 
                      src={post.thumbnailUrl} 
                      alt={post.title}
                      fill
                      style={{ objectFit: "cover" }} 
                      sizes="100%"
                    />
                  </div>
                  <div className={styles.content}>
                    <h3>{post.title}</h3>
                    <br />
                    <p>{post.description}</p>
                    <p className={styles.date}>{post.date}</p>
                    <ul>
                      {post.tags.map((tag: string) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                    <span>Read More...</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default Blog;
