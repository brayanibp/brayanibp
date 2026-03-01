import React from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  language?: string;
}

const CodeBlock = ({ children, language }: CodeBlockProps) => {
  return (
    <pre className={`language-${language} rounded-lg p-4 bg-zinc-900 overflow-x-auto`}>
      <code>{children}</code>
    </pre>
  );
};

export default CodeBlock;
