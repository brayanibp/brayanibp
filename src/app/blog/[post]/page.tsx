import styles from "../../page.module.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";

const fetchPost = async (post: string) => {
  const fs = require("fs");
  const path = require("path");
  const matter = require("gray-matter");
  const file = fs.readFileSync(path.join(process.cwd(), "src/posts", post + ".mdx"), "utf8");
  const { content, data } = matter(file);
  return {
    content,
    frontmatter: data
  };
};

const Posts = async ({ params }: { params: { post: string } }) => {
  const { post } = params;

  const { frontmatter, content } = await fetchPost(post);

  console.log(frontmatter);

  return (
    <section className={styles.main}>
      <h1>{frontmatter.title}</h1>
      <Image src={frontmatter.thumbnailUrl} width={600} height={400} alt={frontmatter.thumbnailUrl} />
      <p>{frontmatter.description}</p>
      <ul>
        {frontmatter.tags.map((tag: string) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <br />
      <MDXRemote source={content} components={{ SyntaxHighlighter }} />
    </section>
  );
}

export default Posts;