"use client";
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  children?: any;
}

const CodeBlock = ({ children }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000); // Reset the copied state after 2 seconds

    const fallbackCopy = () => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        // Clipboard access can be unavailable in some browsers.
      }
    };

    try {
      if (!navigator.clipboard) {
        fallbackCopy();
        return;
      }

      void navigator.clipboard.writeText(textToCopy).catch(fallbackCopy);
    } catch {
      fallbackCopy();
    }
  };

  // If children is a <code> block (standard MDX pre -> code structure)
  let codeText = '';
  let language = 'typescript';

  if (children && children.props && children.type === 'code') {
    codeText = children.props.children || '';
    const className = children.props.className || '';
    const match = /language-(\w+)/.exec(className);
    if (match) {
      language = match[1];
    }
  } else if (children && children.props && children.props.children && children.props.children.type === 'code') {
    // Sometimes it's wrapped in another element
    const codeEl = children.props.children;
    codeText = codeEl.props.children || '';
    const className = codeEl.props.className || '';
    const match = /language-(\w+)/.exec(className);
    if (match) {
      language = match[1];
    }
  } else {
    // Fallback for direct string children
    codeText = children || '';
  }

  const textToCopy = Array.isArray(codeText) ? codeText.join('') : String(codeText).trim();

  return (
    <div style={{ zIndex: 0, position: 'relative', marginBottom: '1.5rem' }}>
      <button
        type="button"
        data-copy-code
        onClick={handleCopy}
        style={{
          zIndex: 10,
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
      <SyntaxHighlighter language={language} style={dracula}>
        {textToCopy}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
