"use client";

import { useState, useEffect, ReactNode } from "react";
import { Highlight, themes } from "prism-react-renderer";

// SyntaxHighlighter que maneja el template literal de MDX
const SyntaxHighlighter = ({ children, language, style, ...props }: { 
  children?: ReactNode; 
  language?: string;
  style?: any;
  [key: string]: any;
}) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    let extractedCode = "";
    
    // El template literal {`code`} se pasa de forma diferente en MDX
    // Primero intentamos obtener el valor directamente
    if (typeof children === 'string') {
      extractedCode = children;
    } 
    // Si es un objeto, buscamos en cualquier propiedad
    else if (children && typeof children === 'object') {
      // Buscar recursively en el objeto
      const findString = (obj: any): string | null => {
        if (!obj) return null;
        if (typeof obj === 'string') return obj;
        if (typeof obj === 'number') return String(obj);
        if (Array.isArray(obj)) {
          for (const item of obj) {
            const found = findString(item);
            if (found) return found;
          }
        }
        if (typeof obj === 'object') {
          for (const value of Object.values(obj)) {
            const found = findString(value);
            if (found) return found;
          }
        }
        return null;
      };
      
      extractedCode = findString(children) || "";
    }
    
    // Limpiar el código
    if (extractedCode) {
      // Remover backticks del inicio y final
      extractedCode = extractedCode.replace(/^```[\s\S]*?```$/, ''); // código bloque
      extractedCode = extractedCode.replace(/^`/, '').replace(/`$/, ''); // backticks simples
      extractedCode = extractedCode.trim();
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
      <div className="bg-zinc-900 p-4 rounded-lg my-4 border border-zinc-700">
        <p className="text-yellow-500 text-sm mb-2">Empty code block</p>
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
