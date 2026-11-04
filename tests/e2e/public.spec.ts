import { readdir } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

async function getPostSlugs() {
  const postsDirectory = path.join(process.cwd(), "src", "posts");
  const files = await readdir(postsDirectory);

  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length));
}

test("public pages return 200", async ({ request }) => {
  for (const route of ["/", "/blog", "/privacy-policy"]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
  }
});

test("every blog post renders", async ({ request }) => {
  const slugs = await getPostSlugs();
  expect(slugs.length).toBeGreaterThan(0);

  for (const slug of slugs) {
    const response = await request.get(`/blog/${slug}`);
    expect(response.status(), slug).toBe(200);
  }
});

test("unknown routes return 404", async ({ request }) => {
  const unknownPost = await request.get("/blog/does-not-exist");
  expect(unknownPost.status()).toBe(404);

  const traversal = await request.get("/blog/..%2f..%2fpackage");
  expect(traversal.status()).toBe(404);

  const unknownPage = await request.get("/does-not-exist");
  expect(unknownPage.status()).toBe(404);
});
