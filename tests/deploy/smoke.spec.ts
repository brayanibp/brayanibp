import { expect, test } from "@playwright/test";

test("deployment serves public pages", async ({ request }) => {
  for (const route of ["/", "/blog", "/privacy-policy"]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
  }
});

test("deployment has security headers", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  const csp =
    headers["content-security-policy"] ??
    headers["content-security-policy-report-only"];

  expect(csp).toBeTruthy();
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).not.toContain("'unsafe-eval'");

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("deployment serves SRI-protected scripts", async ({ page }) => {
  await page.goto("/");

  const scripts = page.locator("script[integrity]");
  expect(await scripts.count()).toBeGreaterThan(0);
});

test("deployment returns 404 for unknown and traversal routes", async ({ request }) => {
  expect((await request.get("/blog/does-not-exist")).status()).toBe(404);
  expect((await request.get("/blog/..%2f..%2fpackage")).status()).toBe(404);
  expect((await request.get("/does-not-exist")).status()).toBe(404);
});

test("deployment contact API fails safely", async ({ request }) => {
  const wrongType = await request.post("/api/send_email", {
    headers: { "content-type": "text/plain" },
    data: "{}",
  });
  expect(wrongType.status()).toBe(415);

  const invalid = await request.post("/api/send_email", {
    headers: { "content-type": "application/json" },
    data: { email: "not-an-email", message: "", captcha: "" },
  });
  expect(invalid.status()).toBe(400);

  const crossOrigin = await request.post("/api/send_email", {
    headers: {
      "content-type": "application/json",
      origin: "https://evil.example",
    },
    data: {
      email: "person@example.com",
      message: "hello",
      captcha: "test",
      website: "",
    },
  });
  expect(crossOrigin.status()).toBe(403);

  const get = await request.get("/api/send_email");
  expect(get.status()).toBe(405);
});
