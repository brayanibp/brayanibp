import dynamic from "next/dynamic";
import styles from "./page.module.css";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import PrintButton from "@/components/PrintButton";
import NotFound from "@/components/NotFound";
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

// Client component to render MDX content
const MDXContent = dynamic(() => import("@/components/MDXContent"), {
  loading: () => <div className="p-8 text-zinc-400">Loading content...</div>
});

const Posts = async ({ params }: { params: Promise<{ post: string }> }) => {
  const { post } = await params;
  const postData = await getPostBySlug(post);

  if (!postData || !postData.content) {
    return <NotFound />;
  }

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
      <MDXContent content={postData.content} />
      <br />
    </section>
  );
}

export default Posts;