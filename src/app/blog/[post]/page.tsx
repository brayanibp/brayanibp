import dynamic from "next/dynamic";
import styles from "./page.module.css";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import PrintButton from "@/components/PrintButton";
import NotFound from "@/components/NotFound";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { compileMDX } from "next-mdx-remote/rsc";
import { getPostBySlug } from "@/lib/blog-firestore";
import React from "react";

type Props = {
  params: {
    post: string,
  }
}

export async function generateMetadata({ params }: { params: Promise<{ post: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const { post } = await params;
  const postData = await getPostBySlug(post);
  
  if (!postData) {
    return {
      title: "Post not found",
      description: "Not found",
    };
  }
  
  const previousData = await parent;
  const previousKeywords = previousData?.keywords || [];
  return {
    title: postData.title,
    description: postData.description,
    openGraph: {
      title: postData.title,
      description: postData.description,
      images: [postData.thumbnailUrl],
    },
    keywords: [...(postData.tags || []), ...previousKeywords]
  };
}

// Wrapper to properly handle SyntaxHighlighter content
function SyntaxHighlighterWrapper(props: { children?: any; language?: string; style?: any }) {
  const { children, language = "bash" } = props;
  const CodeBlock = dynamic(() => import("@/components/CodeBlock"), { 
    loading: () => <pre className="p-4 bg-zinc-900 rounded-lg">Loading...</pre>
  });
  
  return <CodeBlock language={language}>{children}</CodeBlock>;
}

// Wrapper for Diagram
function DiagramWrapper(props: { children?: any; chart?: string }) {
  const Diagram = dynamic(() => import("@/components/Diagram"), {
    loading: () => <div className="p-4 bg-zinc-900 rounded-lg">Loading diagram...</div>
  });
  
  return <Diagram>{props.children || props.chart}</Diagram>;
}

const components = { 
  SyntaxHighlighter: SyntaxHighlighterWrapper,
  Diagram: DiagramWrapper,
  InlineHighlighter: dynamic(() => import("@/components/InlineHighlighter"), {
    loading: () => <code>Loading...</code>
  }),
  Image: dynamic(() => import("@/components/Image"), {
    loading: () => <div className="p-4 bg-zinc-900 rounded-lg">Loading image...</div>
  }),
  // Add standard HTML elements with custom styles
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4 text-white" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4 text-white border-b border-zinc-800 pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold mt-6 mb-3 text-white" {...props} />,
  p: (props: any) => <p className="text-zinc-300 leading-relaxed mb-4" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-4 text-zinc-300" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4 text-zinc-300" {...props} />,
  li: (props: any) => <li className="mb-2 text-zinc-300" {...props} />,
  a: (props: any) => <a className="text-blue-500 hover:text-blue-400 underline" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-zinc-400" {...props} />,
  pre: (props: any) => <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto mb-4" {...props} />,
  code: (props: any) => <code className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />,
  table: (props: any) => <table className="w-full border-collapse mb-4" {...props} />,
  th: (props: any) => <th className="bg-zinc-800 text-left px-4 py-2 font-semibold text-white border border-zinc-700" {...props} />,
  td: (props: any) => <td className="px-4 py-2 border border-zinc-700 text-zinc-300" {...props} />,
  hr: (props: any) => <hr className="border-zinc-800 my-8" {...props} />,
};

const Posts = async ({ params }: { params: Promise<{ post: string }> }) => {
  const { post } = await params;
  const postData = await getPostBySlug(post);

  if (!postData || !postData.content) {
    return <NotFound />;
  }

  // Compile MDX content
  const { content: mdxContent } = await compileMDX({
    source: postData.content,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: { 
        remarkPlugins: [remarkGfm, remarkMath],
        format: "mdx",
      },
    },
  });

  return (
    <section className={styles.post}>
      <PrintButton />
      <h1 className="no-print">{postData.title}</h1>
      <Image className="no-print" src={postData.thumbnailUrl} alt={postData.thumbnailUrl} width={0} height={0} sizes="100%" style={{ width: '100%', height: 'auto' }} />
      <p className="no-print">{postData.description}</p>
      <ul className={`${styles.tags} no-print`}>
        {postData.tags.map((tag: string) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <br />
      {mdxContent}
      <br />
    </section>
  );
}

export default Posts;
