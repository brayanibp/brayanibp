"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";

// SyntaxHighlighter según el artículo de PeterLunch
const SyntaxHighlighter = ({ children, className, ...props }: { 
  children?: any; 
  className?: string;
  [key: string]: any;
}) => {
  const [copied, setCopied] = useState(false);
  
  // Extraer código y lenguaje según el artículo
  const code = children?.props?.children || children || "";
  const language = className?.replace("language-", "").trim() || "bash";

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative my-4 overflow-x-auto rounded-lg border border-zinc-800 bg-[#1a1a1a]">
      {/* Language label + Copy button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700 bg-zinc-800/50">
        <span className="text-xs text-zinc-400 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-2 py-1 rounded transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      
      {/* Code with line numbers */}
      <Highlight theme={themes.vsDark} code={String(code)} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4 overflow-x-auto text-sm`} style={{ ...style, margin: 0 }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                <span className="table-cell pr-4 text-zinc-600 text-right select-none w-8">{i + 1}</span>
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default SyntaxHighlighter;
