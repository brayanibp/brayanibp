import dynamic from "next/dynamic";
import styles from "./page.module.css";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import PrintButton from "@/components/PrintButton";
import NotFound from "@/components/NotFound";
import remarkGfm from "remark-gfm";
import { compileMDX } from "next-mdx-remote/rsc";

type Props = {
  params: {
    post: string,
  }
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { post } = params;
  const { frontmatter } = await fetchPost(post);
  
  if (!frontmatter) {
    return {
      title: "Post not found",
      description: "Not found",
      openGraph: {
        title: "Not found",
        description: "Not found",
        images: [frontmatter?.thumbnailUrl],
      },
      keywords: []
    };
  }
  
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
  // check if file exists
  if (!fs.existsSync(path.join(process.cwd(), "src/posts", post + ".mdx"))) {
    return {
      content: null,
      frontmatter: null
    };
  }
  const file = fs.readFileSync(path.join(process.cwd(), "src/posts", post + ".mdx"), "utf8");
  const { content, data } = matter(file);
  
  const { content: mdxContent } = await compileMDX({
    source: content,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: { 
        remarkPlugins: [remarkGfm],
        format: "mdx",
      },
    },
  });
  return {
    content: mdxContent,
    frontmatter: data
  };
};

const components = { 
  SyntaxHighlighter: dynamic(() => import("@/components/CodeBlock"), { 
    ssr: false,
    loading: () => <i>Loading...</i>
  }),
  Diagram: dynamic(() => import("@/components/Diagram"), {
    ssr: false,
    loading: () => <i>Loading...</i>
  }),
  InlineHighlighter: dynamic(() => import("@/components/InlineHighlighter"), {
    ssr: false,
    loading: () => <i>Loading...</i>
  }),
};

const Posts = async ({ params }: { params: { post: string } }) => {
  const { post } = params;

  const { frontmatter, content } = await fetchPost(post);

  if (!frontmatter || !content) {
    return <NotFound />;
  }

  return (
    <section className={styles.post}>
      <PrintButton />
      <h1 className="no-print">{frontmatter.title}</h1>
      <Image className="no-print" src={frontmatter.thumbnailUrl} alt={frontmatter.thumbnailUrl} width={0} height={0} sizes="100%" style={{ width: '100%', height: 'auto' }} />
      <p className="no-print">{frontmatter.description}</p>
      <ul className={`${styles.tags} no-print`}>
        {frontmatter.tags.map((tag: string) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <br />
      {content}
      <br />
    </section>
  );
}

export default Posts;