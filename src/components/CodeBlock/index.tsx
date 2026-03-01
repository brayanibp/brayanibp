"use client";
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeBlock = ({ children, language }: { children?: string; language?: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // Ensure children is a string
  const codeContent = typeof children === 'string' ? children : String(children || '');

  return (
    <div style={{ zIndex: 0, position: 'relative', marginBottom: '1.5rem' }}>
      <CopyToClipboard text={codeContent} onCopy={handleCopy}>
        <button 
          style={{
            zIndex: 10,
            position: 'absolute',
            right: '10px',
            top: '10px',
            background: '#4A5568',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </CopyToClipboard>
      <SyntaxHighlighter 
        language={language || 'bash'} 
        style={dracula}
        customStyle={{
          margin: '1rem 0',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}
      >
        {codeContent}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
