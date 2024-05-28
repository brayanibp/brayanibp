import Link from "next/link";
import styles from "../page.module.css";

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
  console.log(posts);
  return (
    <>
      <section className={styles.main}>
        <h2>My Blog</h2>
        <ul>
          {posts.map((post: any) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.previewData.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Blog;