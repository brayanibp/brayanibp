"use client";

import { Highlight, themes } from "prism-react-renderer";
import React, { useState, useEffect } from "react";
import { useMDXContent } from "@/components/MDXContent/context";

// SyntaxHighlighter for MDX - using MDX context to get content
export default function SyntaxHighlighter({ 
  children, 
  language = "bash",
  ...props 
}: { 
  children?: React.ReactNode; 
  language?: string;
  [key: string]: any;
}) {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  
  useEffect(() => {
    // Try multiple ways to extract code from children
    let extractedCode = "";
    
    // Method 1: Direct string
    if (typeof children === 'string') {
      extractedCode = children;
    }
    // Method 2: React element with props
    else if (React.isValidElement(children)) {
      const childEl = children as React.ReactElement<any>;
      // Check for children prop
      if (childEl.props?.children) {
        if (typeof childEl.props.children === 'string') {
          extractedCode = childEl.props.children;
        } else if (Array.isArray(childEl.props.children)) {
          extractedCode = childEl.props.children.join('');
        }
      }
      // Check for any string prop (like in template literals)
      if (!extractedCode) {
        const strProps = Object.values(childEl.props || {}).filter(
          (v): v is string => typeof v === 'string' && v.length > 0
        );
        if (strProps.length > 0) {
          extractedCode = strProps[0];
        }
      }
    }
    // Method 3: Try to get from props directly
    else if (props && typeof props === 'object') {
      const values = Object.values(props).filter(
        (v): v is string => typeof v === 'string' && v.length > 0
      );
      if (values.length > 0) {
        extractedCode = values[0];
      }
    }
    
    // Clean up the code
    if (extractedCode) {
      extractedCode = extractedCode
        .replace(/^```[\s\S]*?```$/, '') // Remove markdown code blocks
        .replace(/^`/, '')              // Remove leading backtick
        .replace(/`$/, '')              // Remove trailing backtick
        .trim();
    }
    
    setCode(extractedCode);
  }, [children, props]);

  const lang = (language?.replace("language-", "") || "bash").trim() || "bash";

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) {
    // Debug: show what we received
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 my-4">
        <p className="text-zinc-500 text-sm mb-2">Debug: No code extracted</p>
        <pre className="text-xs text-zinc-400 overflow-x-auto">
          {JSON.stringify({ 
            childrenType: typeof children,
            hasChildren: !!children,
            props: Object.keys(props || {})
          }, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="relative group my-4">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Copy code"
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
      <Highlight theme={themes.nightOwl} code={code.trim()} language={lang as any}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} rounded-lg p-4 overflow-x-auto text-sm border border-zinc-800`} style={{ ...style, background: "#1a1a1a" }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="inline-block w-8 text-zinc-600 select-none text-right mr-4">{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
