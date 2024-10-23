"use client";
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeBlock = ({ children, language }: { children: string, language: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000); // Reset the copied state after 2 seconds
  };

  return (
    <div style={{ zIndex: 0, position: 'relative', marginBottom: '1.5rem' }}>
      <CopyToClipboard text={children} onCopy={handleCopy}>
        <button 
          style={{
            zIndex: 0,
            position: 'absolute',
            right: '10px',
            top: '10px',
            background: '#4A5568', /* Dark background for the button */
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </CopyToClipboard>
      <SyntaxHighlighter language={language} style={dracula}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
