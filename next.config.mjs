import createMDX from '@next/mdx';

const isDev = process.env.NODE_ENV === 'development';
const isPreview = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production');

const csp = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    isDev ? "'unsafe-eval'" : '',
    'https://www.google.com',
    'https://www.gstatic.com',
    'https://va.vercel-scripts.com',
    isPreview ? 'https://vercel.live' : '',
  ]
    .filter(Boolean)
    .join(' '),
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://drive.google.com https://lh3.googleusercontent.com https://www.gstatic.com",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    'https://vitals.vercel-insights.com',
    'https://va.vercel-scripts.com',
    'https://www.google.com',
    'https://www.gstatic.com',
    isDev ? 'ws: wss:' : '',
    isPreview ? 'https://vercel.live' : '',
  ]
    .filter(Boolean)
    .join(' '),
  `frame-src https://www.google.com https://recaptcha.google.com${isPreview ? ' https://vercel.live' : ''}`,
  "worker-src 'self' blob:",
  "media-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const cspHeaderName = process.env.CSP_REPORT_ONLY === 'true'
  ? 'Content-Security-Policy-Report-Only'
  : 'Content-Security-Policy';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  experimental: {
    sri: {
      algorithm: 'sha256',
    },
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: cspHeaderName, value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'X-XSS-Protection', value: '0' },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  // Add markdown extensions here, as desired
  extension: /\.mdx?$/,
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [],
    providerImportSource: '@mdx-js/react',
  },
});

export default withMDX(nextConfig);
