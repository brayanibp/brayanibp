import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW = '10 m';
const RATE_LIMIT_REQUESTS = 3;
const GLOBAL_RATE_LIMIT_WINDOW = '1 h';
const GLOBAL_RATE_LIMIT_REQUESTS = 30;

const contactSchema = z.object({
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(1).max(5000),
  captcha: z.string().min(1).max(4096),
  website: z.string().max(200).optional().default(''),
});

type RecaptchaResponse = {
  success: boolean;
  hostname?: string;
  challenge_ts?: string;
};

let rateLimit: Ratelimit | null | undefined;
let globalRateLimit: Ratelimit | null | undefined;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

function getRateLimits(): { perIp: Ratelimit; global: Ratelimit } | null {
  if (rateLimit !== undefined && globalRateLimit !== undefined) {
    return rateLimit && globalRateLimit ? { perIp: rateLimit, global: globalRateLimit } : null;
  }

  const redis = getRedis();
  if (!redis) {
    rateLimit = null;
    globalRateLimit = null;
    return null;
  }

  rateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW),
    analytics: false,
    prefix: 'ratelimit:contact:ip',
  });

  globalRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(GLOBAL_RATE_LIMIT_REQUESTS, GLOBAL_RATE_LIMIT_WINDOW),
    analytics: false,
    prefix: 'ratelimit:contact:global',
  });

  return { perIp: rateLimit, global: globalRateLimit };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || 'local-development';

  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const previewOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const allowedOrigins = new Set(
    [
      process.env.NEXT_PUBLIC_SITE_URL,
      'https://brayanibp.dev',
      'https://www.brayanibp.dev',
      ...(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production' && previewOrigin
        ? [previewOrigin]
        : []),
      ...(process.env.NODE_ENV === 'development'
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
        : []),
    ].filter((value): value is string => Boolean(value)),
  );

  if (origin && !allowedOrigins.has(origin)) {
    return false;
  }

  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'same-site' && fetchSite !== 'none') {
    return false;
  }

  return true;
}

function jsonResponse(body: unknown, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function getRetryAfter(reset: number): string {
  return String(Math.max(0, Math.ceil((reset - Date.now()) / 1000)));
}

async function verifyCaptcha(captcha: string, ip: string): Promise<RecaptchaResponse | null> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error('Missing RECAPTCHA_SECRET_KEY');
    return null;
  }

  const params = new URLSearchParams({
    secret,
    response: captcha,
  });

  if (ip !== 'unknown') {
    params.set('remoteip', ip);
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as RecaptchaResponse;
  } catch (error) {
    console.error('reCAPTCHA verification failed', error instanceof Error ? error.name : 'unknown');
    return null;
  }
}

async function sendContactEmail(email: string, message: string): Promise<boolean> {
  const apiKey = process.env.RESEND_SECRET_KEY;
  if (!apiKey) {
    console.error('Missing RESEND_SECRET_KEY');
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'BrayanIBP <hello@brayanibp.dev>',
      to: [process.env.CONTACT_TO_EMAIL || 'brayanbernal0710@gmail.com'],
      replyTo: email,
      subject: 'Portfolio contact',
      text: `From: ${email}\n\n${message}`,
    });

    if (error) {
      console.error('Resend send failed', error.name);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Resend send failed', error instanceof Error ? error.name : 'unknown');
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return jsonResponse({ error: 'Forbidden' }, 403);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return jsonResponse({ error: 'Unsupported content type' }, 415);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'Request too large' }, 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse({ error: 'Invalid request' }, 400);
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'Request too large' }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: 'Invalid request' }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse({ error: 'Invalid request' }, 400);
  }

  const { email, message, captcha, website } = parsed.data;

  // Honeypot: real users never fill this field.
  if (website) {
    return jsonResponse({ ok: true });
  }

  const ip = getClientIp(request);
  const limits = getRateLimits();

  if (!limits) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Rate limiting disabled: UPSTASH_REDIS_REST_URL/TOKEN are not configured');
    } else {
      console.error('Rate limiting is not configured');
      return jsonResponse({ error: 'Contact form is temporarily unavailable' }, 503);
    }
  } else {
    const ipKey = hashIp(ip);

    try {
      const [ipResult, globalResult] = await Promise.all([
        limits.perIp.limit(ipKey),
        limits.global.limit('all'),
      ]);

      if (!ipResult.success || !globalResult.success) {
        const reset = Math.max(ipResult.reset, globalResult.reset);
        return jsonResponse(
          { error: 'Too many requests. Please try again later.' },
          429,
          { 'Retry-After': getRetryAfter(reset) },
        );
      }
    } catch (error) {
      console.error('Rate limit check failed', error instanceof Error ? error.name : 'unknown');
      return jsonResponse({ error: 'Contact form is temporarily unavailable' }, 503);
    }
  }

  const captchaResult = await verifyCaptcha(captcha, ip);
  if (!captchaResult) {
    return jsonResponse({ error: 'Captcha verification unavailable' }, 502);
  }

  if (!captchaResult.success) {
    return jsonResponse({ error: 'Captcha verification failed' }, 422);
  }

  const allowedHosts = new Set(
    [
      'brayanibp.dev',
      'www.brayanibp.dev',
      ...(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production' && process.env.VERCEL_URL
        ? [process.env.VERCEL_URL]
        : []),
      ...(process.env.NODE_ENV === 'development' ? ['localhost', '127.0.0.1'] : []),
    ],
  );

  if (captchaResult.hostname && !allowedHosts.has(captchaResult.hostname)) {
    return jsonResponse({ error: 'Captcha verification failed' }, 422);
  }

  const sent = await sendContactEmail(email, message);
  if (!sent) {
    return jsonResponse({ error: 'Unable to send message' }, 502);
  }

  return jsonResponse({ ok: true });
}
