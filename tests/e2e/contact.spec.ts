import { expect, test } from "@playwright/test";

const validBody = {
  email: "person@example.com",
  message: "Hello from the E2E suite",
  captcha: "test-captcha-token",
  website: "",
};

test("contact API rejects unsupported content types", async ({ request }) => {
  const response = await request.post("/api/send_email", {
    headers: { "content-type": "text/plain" },
    data: "{}",
  });

  expect(response.status()).toBe(415);
});

test("contact API rejects malformed and invalid payloads", async ({ request }) => {
  const malformed = await request.post("/api/send_email", {
    headers: { "content-type": "application/json" },
    data: "{",
  });
  expect(malformed.status()).toBe(400);

  const invalid = await request.post("/api/send_email", {
    headers: { "content-type": "application/json" },
    data: { email: "not-an-email", message: "", captcha: "" },
  });
  expect(invalid.status()).toBe(400);
});

test("contact API rejects oversized payloads", async ({ request }) => {
  const response = await request.post("/api/send_email", {
    headers: { "content-type": "application/json" },
    data: { ...validBody, message: "x".repeat(20_000) },
  });

  expect(response.status()).toBe(413);
});

test("contact API rejects cross-origin requests", async ({ request }) => {
  const response = await request.post("/api/send_email", {
    headers: {
      "content-type": "application/json",
      origin: "https://evil.example",
    },
    data: validBody,
  });

  expect(response.status()).toBe(403);
});

test("contact API silently accepts honeypot submissions", async ({ request }) => {
  const response = await request.post("/api/send_email", {
    headers: { "content-type": "application/json" },
    data: { ...validBody, website: "https://spam.example" },
  });

  expect(response.status()).toBe(200);
});

test("contact API only accepts POST", async ({ request }) => {
  const response = await request.get("/api/send_email");
  expect(response.status()).toBe(405);
});
