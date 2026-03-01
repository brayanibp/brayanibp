"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import React from "react";

// Handle MDX SyntaxHighlighter component with clipboard
function SyntaxHighlighter(props: { children?: any; language?: string; style?: any; className?: string }) {
  const { children, language = "text", style: _style, className: _className } = props;
  const [copied, setCopied] = useState(false);
  
  let code = "";
  if (typeof children === "string") {
    code = children;
  } else if (children && typeof children === "object") {
    const childStr = String(children);
    code = childStr;
  }
  
  const lang = (language?.replace("language-", "") || "bash").trim() || "bash";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

export default SyntaxHighlighter;
