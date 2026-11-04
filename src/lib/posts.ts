import { cache } from 'react';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

const postsDirectory = path.join(process.cwd(), 'src', 'posts');
const postSlugPattern = /^[a-z0-9][a-z0-9-_]*$/i;

export const postFrontmatterSchema = z.object({
  title: z.string().min(1).max(200),
  date: z.union([z.string().max(100), z.date()]),
  description: z.string().min(1).max(1000),
  thumbnailUrl: z
    .string()
    .url()
    .max(2048)
    .refine((value) => value.startsWith('https://'), 'thumbnailUrl must use HTTPS'),
  tags: z.array(z.string().min(1).max(64)).max(30),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
};

function isPostSlug(slug: string): boolean {
  return postSlugPattern.test(slug);
}

function getPostPath(slug: string): string | null {
  if (!isPostSlug(slug)) {
    return null;
  }

  const resolved = path.resolve(postsDirectory, `${slug}.mdx`);
  if (!resolved.startsWith(`${postsDirectory}${path.sep}`)) {
    return null;
  }

  return resolved;
}

export async function getPostSlugs(): Promise<string[]> {
  const entries = await readdir(postsDirectory, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => entry.name.slice(0, -'.mdx'.length))
    .filter(isPostSlug)
    .sort();
}

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const filePath = getPostPath(slug);
  if (!filePath) {
    return null;
  }

  try {
    const file = await readFile(filePath, 'utf8');
    const { content, data } = matter(file);
    const parsed = postFrontmatterSchema.safeParse(data);

    if (!parsed.success) {
      console.error(`Invalid frontmatter in ${slug}.mdx`, parsed.error.flatten());
      return null;
    }

    return {
      slug,
      frontmatter: parsed.data,
      content,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }

    console.error(`Unable to read ${slug}.mdx`, error);
    return null;
  }
});
