import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      slug: doc.id,
      ...doc.data(),
    })) as BlogPost[];
  } catch (error) {
    console.error("Error fetching posts from Firestore:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const postRef = doc(db, "posts", slug);
    const snapshot = await getDoc(postRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return {
      slug: snapshot.id,
      ...snapshot.data(),
    } as BlogPost;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}
