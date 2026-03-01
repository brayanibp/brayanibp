"use client";

import { useEffect, useState } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import dynamic from "next/dynamic";

// SyntaxHighlighter component
const SyntaxHighlighter = dynamic(() => import("@/components/CodeBlock"), {
  loading: () => <pre className="p-4 bg-zinc-900 rounded-lg">Loading...</pre>,
});

// Diagram component
const Diagram = dynamic(() => import("@/components/Diagram"), {
  loading: () => <div className="p-4 bg-zinc-900 rounded-lg">Loading diagram...</div>,
});

// InlineHighlighter component
const InlineHighlighter = dynamic(() => import("@/components/InlineHighlighter"), {
  loading: () => <code>Loading...</code>,
});

// Custom Image component
const Image = dynamic(() => import("@/components/Image"), {
  loading: () => <div className="p-4 bg-zinc-900 rounded-lg">Loading image...</div>,
});

const components = {
  SyntaxHighlighter,
  Diagram,
  InlineHighlighter,
  Image,
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4 text-white" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-4 text-white border-b border-zinc-800 pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold mt-6 mb-3 text-white" {...props} />,
  p: (props: any) => <p className="text-zinc-300 leading-relaxed mb-4" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-4 text-zinc-300" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-4 text-zinc-300" {...props} />,
  li: (props: any) => <li className="mb-2 text-zinc-300" {...props} />,
  a: (props: any) => <a className="text-blue-500 hover:text-blue-400 underline" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-zinc-400" {...props} />,
  pre: (props: any) => <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-x-auto mb-4" {...props} />,
  code: (props: any) => <code className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />,
  table: (props: any) => <table className="w-full border-collapse mb-4" {...props} />,
  th: (props: any) => <th className="bg-zinc-800 text-left px-4 py-2 font-semibold text-white border border-zinc-700" {...props} />,
  td: (props: any) => <td className="px-4 py-2 border border-zinc-700 text-zinc-300" {...props} />,
  hr: (props: any) => <hr className="border-zinc-800 my-8" {...props} />,
  div: (props: any) => <div className="text-zinc-300" {...props} />,
  strong: (props: any) => <strong className="text-white font-semibold" {...props} />,
  br: (props: any) => <br {...props} />,
};

interface MDXContentProps {
  content: string;
}

export default function MDXContent({ content }: MDXContentProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processMDX = async () => {
      try {
        const serialized = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            format: "mdx",
          },
          scope: {},
        });
        setMdxSource(serialized);
      } catch (err) {
        console.error("MDX serialization error:", err);
        setError("Failed to parse MDX content");
      }
    };

    if (content) {
      processMDX();
    }
  }, [content]);

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
        <p className="text-red-400">{error}</p>
        <pre className="mt-2 text-xs text-zinc-400 overflow-x-auto max-h-64">{content.slice(0, 500)}</pre>
      </div>
    );
  }

  if (!mdxSource) {
    return <div className="p-8 text-zinc-400">Loading content...</div>;
  }

  return (
    <div className="blog-content">
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}