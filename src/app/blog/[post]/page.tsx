import styles from "./page.module.css";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import SyntaxHighlighter from "@/components/CodeBlock";
import Diagram from "@/components/Diagram";
import { getPostBySlug } from "@/lib/blog-firestore";
import remarkGfm from "remark-gfm";

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

// Mapear el componente pre para usar SyntaxHighlighter
const components = {
  pre: (props: any) => {
    // El contenido viene en props.children
    return <SyntaxHighlighter {...props} />;
  },
  SyntaxHighlighter,
  Diagram,
};

const Posts = async ({ params }: { params: Promise<{ post: string }> }) => {
  const { post } = await params;
  const postData = await getPostBySlug(post);

  if (!postData || !postData.content) {
    return (
      <section className={styles.post}>
        <h1>Post not found</h1>
        <p>The requested post could not be found.</p>
      </section>
    );
  }

  return (
    <section className={styles.post}>
      <h1>{postData.title}</h1>
      <Image src={postData.thumbnailUrl} alt={postData.thumbnailUrl} width={0} height={0} sizes="100%" style={{ width: '100%', height: 'auto' }} />
      <p>{postData.description}</p>
      <ul className={styles.tags}>
        {postData.tags.map((tag: string) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <br />
      <MDXRemote 
        source={postData.content} 
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          }
        }}
      />
    </section>
  );
}

export default Posts;
