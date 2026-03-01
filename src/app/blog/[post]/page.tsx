import dynamic from "next/dynamic";
import styles from "./page.module.css";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import PrintButton from "@/components/PrintButton";
import NotFound from "@/components/NotFound";
import remarkGfm from "remark-gfm";
import { compileMDX } from "next-mdx-remote/rsc";
import { getPostBySlug } from "@/lib/blog-firestore";

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

const components = { 
  SyntaxHighlighter: dynamic(() => import("@/components/CodeBlock"), { 
    loading: () => <i>Loading...</i>
  }),
  Diagram: dynamic(() => import("@/components/Diagram"), {
    loading: () => <i>Loading...</i>
  }),
  InlineHighlighter: dynamic(() => import("@/components/InlineHighlighter"), {
    loading: () => <i>Loading...</i>
  }),
  Image: dynamic(() => import("@/components/Image"), {
    loading: () => <i>Loading...</i>
  }),
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
        remarkPlugins: [remarkGfm],
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
