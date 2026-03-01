import { PostRepository } from "../contracts/PostRepository";
import { db } from "../firebase/config";
import { Post } from "../firebase/posts";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  Timestamp,
  serverTimestamp 
} from "firebase/firestore";

export class FirestorePostRepository implements PostRepository {
  private collection = "posts";

  async all(): Promise<Post[]> {
    const q = query(
      collection(db, this.collection),
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Post));
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const q = query(collection(db, this.collection), where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    } as Post;
  }

  async create(data: any): Promise<Post> {
    const docRef = await addDoc(collection(db, this.collection), {
      ...data,
      status: 'draft',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data } as Post;
  }
}
