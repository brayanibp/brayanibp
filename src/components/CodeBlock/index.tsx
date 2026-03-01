"use client";

import { useState, useEffect, ReactNode } from "react";
import { Highlight, themes } from "prism-react-renderer";

// Wrapper para SyntaxHighlighter que maneja el template literal con debug
const SyntaxHighlighter = ({ children, language, style, ...props }: { 
  children?: ReactNode; 
  language?: string;
  style?: any;
  [key: string]: any;
}) => {
  const [code, setCode] = useState("");
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    let extractedCode = "";
    
    // Debug what's coming in
    setDebug({
      type: typeof children,
      isString: typeof children === 'string',
      isObject: typeof children === 'object',
      hasProps: children && typeof children === 'object' ? 'props' in children : false,
      preview: typeof children === 'string' ? children.slice(0, 50) : String(children).slice(0, 50)
    });
    
    // Handle template literal {`code`}
    if (typeof children === 'string') {
      extractedCode = children;
    } else if (children && typeof children === 'object') {
      const childObj = children as any;
      
      // Try props.children first
      if (childObj.props?.children) {
        extractedCode = String(childObj.props.children);
      } 
      // Try any string property
      else {
        const values = Object.values(childObj).filter((v): v is string => typeof v === 'string' && v.length > 0);
        if (values.length > 0) {
          extractedCode = values[0];
        }
      }
    }
    
    // Clean up - remove backticks if present
    if (extractedCode) {
      extractedCode = extractedCode.replace(/^`/, '').replace(/`$/, '').trim();
    }
    
    setCode(extractedCode);
  }, [children]);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
    }
  };

  if (!code) {
    return (
      <div className="bg-zinc-900 p-4 rounded-lg my-4">
        <p className="text-yellow-500 text-sm mb-2">Debug - No code extracted:</p>
        <pre className="text-xs text-zinc-400 overflow-x-auto">
          {JSON.stringify(debug, null, 2)}
        </pre>
      </div>
    );
  }

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
        Copy
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

export default SyntaxHighlighter;
