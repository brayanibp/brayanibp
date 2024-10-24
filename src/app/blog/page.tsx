import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";

const fetchPostsPreviews = () => {
  const fs = require("fs");
  const path = require("path");
  const matter = require("gray-matter");
  const postsDirectory = path.join(process.cwd(), "src/posts");
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map((filename: string) => {
    const markdownFile = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
    const { data } = matter(markdownFile);
    
    return {
      slug: filename.split(".")[0],
      previewData: data,
    };
  });

  return posts;
};

const Blog = () => {
  const posts = fetchPostsPreviews();
  return (
    <>
      <section className={styles.blog}>
        <h2>Recent Posts</h2>
        <ul>
          {posts.map((post: any) => (
            <li key={post.slug}>
              <Link className={styles.preview} href={`/blog/${post.slug}`}>
                <div className={styles["img-container"]}>
                  <Image 
                    src={post.previewData.thumbnailUrl} 
                    alt="Next js Image"
                    fill
                    style={{ objectFit: "cover" }} 
                    sizes="100%"
                  />
                </div>
                <div className={styles.content}>
                  <h3>{post.previewData.title}</h3>
                  <br />
                  <p>{post.previewData.description}</p>
                  <p className={styles.date}>{post.previewData.date}</p>
                  <ul>
                    {post.previewData.tags.map((tag: string) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <span>Read More...</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Blog;