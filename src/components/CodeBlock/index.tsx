"use client";

import { Highlight, themes } from "prism-react-renderer";
import React, { useState } from "react";

// SyntaxHighlighter for MDX - handles content from MDX children
export default function SyntaxHighlighter({ children, language = "bash" }: { children?: React.ReactNode; language?: string }) {
  const [copied, setCopied] = useState(false);
  
  // Extract text from children
  let code = "";
  try {
    if (typeof children === 'string') {
      code = children;
    } else if (React.isValidElement(children)) {
      const childElement = children as React.ReactElement<any>;
      if (childElement.props && typeof childElement.props.children === 'string') {
        code = childElement.props.children;
      } else if (childElement.props && Array.isArray(childElement.props.children)) {
        code = childElement.props.children.join('');
      } else {
        // Try to get any string prop
        const props = childElement.props;
        if (props) {
          const stringProps = Object.values(props).filter(v => typeof v === 'string');
          if (stringProps.length > 0) {
            code = stringProps[0] as string;
          }
        }
      }
    }
  } catch (e) {
    console.error('Error extracting code:', e);
  }
  
  // Fallback: try to get any string from children
  if (!code && children) {
    code = String(children);
  }

  const lang = (language?.replace("language-", "") || "bash").trim() || "bash";

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code) {
    return (
      <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-zinc-400 my-4">
        No code to display
      </pre>
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
