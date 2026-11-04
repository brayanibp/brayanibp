import { expect, test } from "@playwright/test";

test("security headers are present and production-safe", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  const csp =
    headers["content-security-policy"] ??
    headers["content-security-policy-report-only"];

  expect(csp).toBeTruthy();
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("base-uri 'self'");
  expect(csp).toContain("form-action 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).not.toContain("'unsafe-eval'");

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin-allow-popups");
  expect(headers["cross-origin-resource-policy"]).toBe("same-origin");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("static HTML is cached and protected", async ({ request }) => {
  const response = await request.get("/blog");
  const headers = response.headers();

  expect(response.status()).toBe(200);
  expect(headers["cache-control"] ?? "").toContain("s-maxage");
});

test("Next.js scripts use Subresource Integrity", async ({ page }) => {
  await page.goto("/");

  const scripts = page.locator("script[integrity]");
  await expect(scripts.first()).toBeAttached();
  expect(await scripts.count()).toBeGreaterThan(0);
});

test("unknown and traversal paths are 404", async ({ request }) => {
  expect((await request.get("/blog/does-not-exist")).status()).toBe(404);
  expect((await request.get("/blog/..%2f..%2fpackage")).status()).toBe(404);
});
