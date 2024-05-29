import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";

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
      <section className={styles.blog}>
        <h2>Recent Posts</h2>
        <ul>
          {posts.map((post: any) => (
            <li key={post.slug}>
              <Link className={styles.preview} href={`/blog/${post.slug}`}>
                <Image src={post.previewData.thumbnailUrl} width={0} height={0} alt="Next js Image" sizes="100%" style={{ width: '40%', height: 'auto' }}/>
                <div>
                  <h3>{post.previewData.title}</h3>
                  <br />
                  <p>{post.previewData.description}</p>
                  <p className={styles.date}>{post.previewData.date}</p>
                  <br />
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