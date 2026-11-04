import styles from "./page.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import PrintButton from "@/components/PrintButton";
import CodeBlock from "@/components/CodeBlock";
import Diagram from "@/components/Diagram";
import InlineHighlighter from "@/components/InlineHighlighter";
import ImageComponent from "@/components/Image";
import remarkGfm from "remark-gfm";
import { compileMDX } from "next-mdx-remote/rsc";
import { getPost, getPostSlugs } from "@/lib/posts";

type Props = {
  params: Promise<{
    post: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();

  return slugs.map((post) => ({ post }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { post: slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const previousData = await parent;
  const previousKeywords = previousData?.keywords || [];

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      images: [post.frontmatter.thumbnailUrl],
    },
    keywords: [...post.frontmatter.tags, ...previousKeywords],
  };
}

const components = {
  pre: CodeBlock,
  Diagram: Diagram,
  InlineHighlighter: InlineHighlighter,
  Image: ImageComponent,
};

const Posts = async ({ params }: Props) => {
  const { post: slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    components,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        format: "mdx",
      },
    },
  });

  return (
    <section className={styles.post}>
      <PrintButton />
      <h1 className="no-print">{post.frontmatter.title}</h1>
      <Image
        className="no-print"
        src={post.frontmatter.thumbnailUrl}
        alt={post.frontmatter.title}
        width={0}
        height={0}
        sizes="100%"
        style={{ width: "100%", height: "auto" }}
      />
      <p className="no-print">{post.frontmatter.description}</p>
      <ul className={`${styles.tags} no-print`}>
        {post.frontmatter.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <br />
      {content}
      <br />
    </section>
  );
};

export default Posts;
