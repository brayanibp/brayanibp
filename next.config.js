const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '',
      },
    ],
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-US'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en-US',
    // This is a list of locale domains and the default locale they
    // should handle (these are only required when setting up domain routing)
    // Note: subdomains must be included in the domain value to be matched e.g. "fr.example.com".
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en-US',
      },
    ],
  },
  images: {
    domains: [
      'drive.google.com'
    ]
  },
  transpilePackages: ['gsap'],
  optimizeFonts: true,
}

module.exports = withBundleAnalyzer(nextConfig);
