import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  limit: vi.fn(),
  send: vi.fn(),
}));

vi.mock("@upstash/ratelimit", () => {
  class Ratelimit {
    static slidingWindow = vi.fn(() => ({ type: "sliding" }));
    static fixedWindow = vi.fn(() => ({ type: "fixed" }));
    limit = mocks.limit;
  }

  return { Ratelimit };
});

vi.mock("@upstash/redis", () => ({
  Redis: class Redis {},
}));

vi.mock("resend", () => ({
  Resend: class Resend {
    emails = { send: mocks.send };
  },
}));

const validBody = {
  email: "person@example.com",
  message: "Hello from the test suite",
  captcha: "test-captcha-token",
  website: "",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function makeRequest(
  body: unknown,
  options: { headers?: Record<string, string>; raw?: string } = {},
) {
  return new NextRequest("http://localhost:3000/api/send_email", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://brayanibp.dev",
      "x-forwarded-for": "203.0.113.10",
      ...options.headers,
    },
    body: options.raw ?? JSON.stringify(body),
  });
}

async function getPostHandler() {
  return (await import("@/app/api/send_email/route")).POST;
}

beforeEach(() => {
  vi.resetModules();
  mocks.limit.mockReset();
  mocks.send.mockReset();
  mocks.limit.mockResolvedValue({
    success: true,
    limit: 3,
    remaining: 2,
    reset: Date.now() + 10_000,
    pending: Promise.resolve(),
  });
  mocks.send.mockResolvedValue({ data: { id: "email_1" }, error: null });

  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "redis-token");
  vi.stubEnv("RECAPTCHA_SECRET_KEY", "recaptcha-secret");
  vi.stubEnv("RESEND_SECRET_KEY", "resend-secret");
  vi.stubEnv("RATE_LIMIT_SALT", "rate-limit-salt");
  vi.stubEnv("NODE_ENV", "test");
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      jsonResponse({ success: true, hostname: "brayanibp.dev" }),
    ),
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("POST /api/send_email", () => {
  it("rejects unsupported content types", async () => {
    const POST = await getPostHandler();
    const response = await POST(
      makeRequest(validBody, { headers: { "content-type": "text/plain" } }),
    );

    expect(response.status).toBe(415);
  });

  it("rejects malformed JSON", async () => {
    const POST = await getPostHandler();
    const response = await POST(makeRequest(null, { raw: "{" }));

    expect(response.status).toBe(400);
  });

  it("rejects invalid payloads", async () => {
    const POST = await getPostHandler();
    const response = await POST(
      makeRequest({ email: "not-an-email", message: "", captcha: "" }),
    );

    expect(response.status).toBe(400);
  });

  it("rejects oversized payloads", async () => {
    const POST = await getPostHandler();
    const response = await POST(
      makeRequest({
        ...validBody,
        message: "x".repeat(20_000),
      }),
    );

    expect(response.status).toBe(413);
  });

  it("rejects cross-origin requests", async () => {
    const POST = await getPostHandler();
    const response = await POST(
      makeRequest(validBody, { headers: { origin: "https://evil.example" } }),
    );

    expect(response.status).toBe(403);
  });

  it("rejects failed captcha verification", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ success: false })),
    );

    const POST = await getPostHandler();
    const response = await POST(makeRequest(validBody));

    expect(response.status).toBe(422);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("rejects captcha responses from an unexpected hostname", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({ success: true, hostname: "evil.example" }),
      ),
    );

    const POST = await getPostHandler();
    const response = await POST(makeRequest(validBody));

    expect(response.status).toBe(422);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("returns 429 when rate limited", async () => {
    mocks.limit.mockResolvedValue({
      success: false,
      limit: 3,
      remaining: 0,
      reset: Date.now() + 10_000,
      pending: Promise.resolve(),
    });

    const POST = await getPostHandler();
    const response = await POST(makeRequest(validBody));

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("sends a valid message", async () => {
    const POST = await getPostHandler();
    const response = await POST(makeRequest(validBody));

    expect(response.status).toBe(200);
    expect(mocks.send).toHaveBeenCalledTimes(1);

    const sent = mocks.send.mock.calls[0]?.[0] as {
      from: string;
      to: string[];
      replyTo: string;
      subject: string;
      text: string;
    };

    expect(sent.from).toContain("hello@brayanibp.dev");
    expect(sent.replyTo).toBe(validBody.email);
    expect(sent.subject).toBe("Portfolio contact");
    expect(sent.text).toContain(validBody.message);
  });

  it("silently accepts honeypot submissions without sending email", async () => {
    const POST = await getPostHandler();
    const response = await POST(
      makeRequest({ ...validBody, website: "https://spam.example" }),
    );

    expect(response.status).toBe(200);
    expect(mocks.send).not.toHaveBeenCalled();
    expect(mocks.limit).not.toHaveBeenCalled();
  });

  it("returns 502 when the email provider fails", async () => {
    mocks.send.mockResolvedValue({
      data: null,
      error: { name: "send_error" },
    });

    const POST = await getPostHandler();
    const response = await POST(makeRequest(validBody));

    expect(response.status).toBe(502);
  });

  it("fails closed when rate limiting is not configured in production", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");

    const POST = await getPostHandler();
    const response = await POST(makeRequest(validBody));

    expect(response.status).toBe(503);
    expect(mocks.send).not.toHaveBeenCalled();
  });
});
