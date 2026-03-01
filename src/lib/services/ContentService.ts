import { PostRepository } from "../contracts/PostRepository";
import { FirestorePostRepository } from "../repositories/FirestorePostRepository";

export class ContentService {
  constructor(private repository: PostRepository = new FirestorePostRepository()) {}

  async getLatestArticles(limit: number = 5) {
    const posts = await this.repository.all();
    return posts.slice(0, limit);
  }

  async getPostDetails(slug: string) {
    return await this.repository.findBySlug(slug);
  }
}
