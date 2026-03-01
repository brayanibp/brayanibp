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
  // MDX pasa el código como children.props.children
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
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          background: '#4A5568',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 10
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <Highlight theme={themes.dracula} code={String(code)} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ ...style, padding: '1rem', borderRadius: '0.5rem', margin: '1rem 0' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span style={{ display: 'inline-block', width: '2em', textAlign: 'right', marginRight: '1em', color: '#666', userSelect: 'none' }}>
                  {i + 1}
                </span>
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
};

export default SyntaxHighlighter;
