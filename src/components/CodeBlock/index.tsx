"use client";
import { useState } from 'react';
import { Highlight, themes } from "prism-react-renderer";

const CodeBlock = ({ children, language }: { children?: string; language?: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (children) {
      await navigator.clipboard.writeText(children);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const code = typeof children === 'string' ? children : String(children || '');

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
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
      <Highlight theme={themes.dracula} code={code} language={language || 'bash'}>
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

export default CodeBlock;
