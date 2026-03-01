import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainLayout } from "@/components/Navigation/MainLayout";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brayan Bernal | Senior Software Engineer",
  description: "Senior Software Engineer & Tech Architect portfolio showcasing engineering, logistics, and technical leadership.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
