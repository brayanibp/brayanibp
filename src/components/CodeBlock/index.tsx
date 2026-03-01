"use client";

import { Highlight, themes } from "prism-react-renderer";
import React, { useState } from "react";

// SyntaxHighlighter for MDX - handles content from MDX children
export default function SyntaxHighlighter({ children, language = "bash" }: { children?: React.ReactNode; language?: string }) {
  const [copied, setCopied] = useState(false);
  
  // Extract text from children - handle various MDX patterns
  let code = "";
  try {
    if (typeof children === 'string') {
      code = children;
    } else if (children && typeof children === 'object') {
      // Handle template literal pattern: {`code`}
      // This comes as an object with a "props" containing the string value
      const childObj = children as any;
      
      // Check if it's a React element with $$typeof symbol
      if (childObj.$$typeof) {
        // It's a React element - extract from props
        if (childObj.props && typeof childObj.props.children === 'string') {
          code = childObj.props.children;
        } else if (childObj.props && Array.isArray(childObj.props.children)) {
          code = childObj.props.children.join('').replace(/[\n\r]/g, '');
        }
      } else {
        // Try direct props access
        if (childObj.props?.children) {
          if (typeof childObj.props.children === 'string') {
            code = childObj.props.children;
          }
        }
        
        // Try to find any string property
        if (!code) {
          const values = Object.values(childObj).filter((v: unknown) => typeof v === 'string' && (v as string).length > 5) as string[];
          if (values.length > 0) {
            code = values[0];
          }
        }
      }
    }
    
    // Clean up the code - remove template literal markers if present
    code = code.replace(/^```[\s\S]*?```$/, '').trim();
    
    // If still empty, try to extract from the raw input
    if (!code && children) {
      const str = String(children);
      // Check for template literal content
      const match = str.match(/`([^`]*)`/);
      if (match) {
        code = match[1];
      }
    }
  } catch (e) {
    console.error('Error extracting code:', e);
  }

  const lang = (language?.replace("language-", "") || "bash").trim() || "bash";

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!code || code.length < 2) {
    return (
      <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-zinc-400 my-4 overflow-x-auto">
        {/* Debug: show what we got */}
        {children ? JSON.stringify(children).slice(0, 200) : 'No children'}
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
