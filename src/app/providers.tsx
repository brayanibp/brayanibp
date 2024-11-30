"use client";
import { MDXProvider } from "@mdx-js/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <MDXProvider>{children}</MDXProvider>;
}