import { describe, expect, it } from "vitest";
import { getPost, getPostSlugs, postFrontmatterSchema } from "@/lib/posts";

const validFrontmatter = {
  title: "A test post",
  date: "Oct 23, 2024",
  description: "A short description",
  thumbnailUrl: "https://drive.google.com/uc?export=view&id=abc123",
  tags: ["test", "nextjs"],
};

describe("postFrontmatterSchema", () => {
  it("accepts valid frontmatter", () => {
    expect(postFrontmatterSchema.safeParse(validFrontmatter).success).toBe(true);
  });

  it("accepts a Date parsed from YAML", () => {
    expect(
      postFrontmatterSchema.safeParse({
        ...validFrontmatter,
        date: new Date("2024-10-23"),
      }).success,
    ).toBe(true);
  });

  it("rejects non-HTTPS thumbnails", () => {
    expect(
      postFrontmatterSchema.safeParse({
        ...validFrontmatter,
        thumbnailUrl: "http://drive.google.com/uc?id=abc123",
      }).success,
    ).toBe(false);
  });

  it("rejects missing or oversized fields", () => {
    expect(
      postFrontmatterSchema.safeParse({
        ...validFrontmatter,
        title: "",
      }).success,
    ).toBe(false);

    expect(
      postFrontmatterSchema.safeParse({
        ...validFrontmatter,
        tags: Array.from({ length: 31 }, (_, index) => `tag-${index}`),
      }).success,
    ).toBe(false);
  });
});

describe("getPost", () => {
  it("loads a known post", async () => {
    const post = await getPost("build_a_blog_with_nextjs");

    expect(post).not.toBeNull();
    expect(post?.frontmatter.title).toContain("Build A Blog");
    expect(post?.frontmatter.tags.length).toBeGreaterThan(0);
  });

  it("returns null for an unknown post", async () => {
    await expect(getPost("does-not-exist")).resolves.toBeNull();
  });

  it("rejects path traversal attempts", async () => {
    await expect(getPost("../package")).resolves.toBeNull();
    await expect(getPost("..%2f..%2fpackage")).resolves.toBeNull();
    await expect(getPost("build_a_blog_with_nextjs/../../package")).resolves.toBeNull();
  });

  it("lists post slugs without path separators", async () => {
    const slugs = await getPostSlugs();

    expect(slugs).toContain("build_a_blog_with_nextjs");
    expect(slugs.every((slug) => !slug.includes("/") && !slug.includes("\\"))).toBe(true);
  });
});
