import { db } from "./config";
import { 
  collection, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  doc,
  Timestamp 
} from "firebase/firestore";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown supported
  category: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published';
}

const COLLECTION_NAME = "posts";

/**
 * Recupera todos los posts publicados ordenados por fecha descendente
 * Optimizado para ISR (Incremental Static Regeneration)
 */
export async function getAllPosts(): Promise<Post[]> {
  const postsQuery = query(
    collection(db, COLLECTION_NAME),
    where("status", "==", "published"),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(postsQuery);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Post;
  });
}

/**
 * Recupera un post específico por su slug (URL)
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(collection(db, COLLECTION_NAME), where("slug", "==", slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  const docData = querySnapshot.docs[0];
  const data = docData.data();
  
  return {
    id: docData.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Post;
}
