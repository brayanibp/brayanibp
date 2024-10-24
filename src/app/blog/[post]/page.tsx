import styles from "./page.module.css";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import CodeBlock from "@/components/CodeBlock";
import Diagram from "@/components/Diagram";
import PrintButton from "@/components/PrintButton";

type Props = {
  params: {
    post: string,
  }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { post } = params;
  const { frontmatter } = await fetchPost(post);
  const previousData = await parent;
  // const previousImages = previousData?.openGraph?.images || [];
  const previousKeywords = previousData?.keywords || [];
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      images: [frontmatter.thumbnailUrl],
    },
    keywords: [...(frontmatter.tags || []), ...previousKeywords]
  };
}

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

  return (
    <section className={styles.post}>
      <h1 className="no-print">{frontmatter.title}</h1>
      <Image className="no-print" src={frontmatter.thumbnailUrl} alt={frontmatter.thumbnailUrl} width={0} height={0} sizes="100%" style={{ width: '100%', height: 'auto' }} />
      <p className="no-print">{frontmatter.description}</p>
      <ul className={`${styles.tags} no-print`}>
        {frontmatter.tags.map((tag: string) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <br />
      <MDXRemote source={content} components={{ SyntaxHighlighter: CodeBlock, Diagram }} />
      <br />
      <PrintButton />
    </section>
  );
}

export default Posts;