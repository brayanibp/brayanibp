import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";
// import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  adjustFontFallback: true, 
  fallback: ["Arial", "sans-serif"]
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#101120' }
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://brayanibp.dev"),
  title: "BrayanIBP",
  authors: [
    {
      name: "Brayan Bernal",
      url: "https://brayanibp.dev"
    }
  ],
  creator: "Brayan Bernal",
  publisher: "Brayan Bernal",
  keywords: ["brayanibp", "developer", "fullstack", "frontend", "backend", "dev", "development", "brayan", "bernal", "brayan bernal", "brayan bernal dev", "back-end", "full-stack", "front-end", "brayan isaac bernal pérez", "brayan isaac bernal perez", "brayanibo", "desarrollador", "web", "mobile"],
  description: "I am a Full-Stack Developer with +5 years of experience with Node.js, React.js | Angular, Redux, RxJS, MySQL, GCP and Firebase. I have worked in health insurance companies, software development companies and emerging startups, but also have a B2 English level.",
  openGraph: {
    title: "BrayanIBP",
    description: "I am a Full-Stack Developer with +5 years of experience with Node.js, React.js | Angular, Redux, RxJS, MySQL, GCP and Firebase. I have worked in health insurance companies, software development companies and emerging startups, but also have a B2 English level.",
    type: "website",
    url: "https://brayanibp.dev",
    siteName: "BrayanIBP",
    locale: "en_US",
    images: [
      {
        url: `${ process.env.NEXT_PUBLIC_SITE_PREVIEW_URL || 'https://drive.google.com/uc?export=view&id=1vjScY6Rp0p7w8sZf0q-ZEBXu2B_mI58L'}`,
        width: 800,
        height: 600,
        alt: "BrayanIBP"
      }
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/android-chrome-512x512.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/android-chrome-32x32.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/android-chrome-16x16.png"
      },
    ],
  },
  alternates: {
    canonical: 'https://brayanibp.dev',
    // languages: {
    //   'en-US': 'https://nextjs.org/en-US',
    //   'es-VE': 'https://nextjs.org/es-VE',
    // },
    // media: {
    //   'only screen and (max-width: 600px)': 'https://nextjs.org/mobile',
    // },
    // types: {
    //   'application/rss+xml': 'https://nextjs.org/rss',
    // },
  },
  archives: ["https://v1.brayanibp.dev"],
  category: "technology",
  verification: {
    google: "75jwz6yeL2o54tRNmCKC1D08v5ZdbS9LoGZqOiW_hBY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <Navbar />
        <Providers>
          {children}
        </Providers>
        {/* <Footer /> */}
        <Analytics mode={'production'} />
        <SpeedInsights />
      </body>
    </html>
  );
}
