import { Post } from "../firebase/posts";

export interface PostRepository {
  all(): Promise<Post[]>;
  findBySlug(slug: string): Promise<Post | null>;
  create(data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post>;
}
