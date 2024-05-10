import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrayanIBP",
  keywords: ["brayanibp", "developer", "fullstack", "frontend", "backend", "dev", "development", "brayan", "bernal", "brayan bernal", "brayan bernal dev", "back-end", "full-stack", "front-end", "brayan isaac bernal pérez", "brayan isaac bernal perez", "brayanibo", "desarrollador", "web", "mobile"],
  description: "I am a Full-Stack Developer with +5 years of experience with Node.js, React.js | Angular, Redux, RxJS, MySQL, GCP and Firebase. I have worked in health insurance companies, software development companies and emerging startups, but also have a B2 English level."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
        <Analytics mode={'production'} />
      </body>
    </html>
  );
}
