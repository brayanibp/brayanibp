"use client";
import { useEffect } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
});

type DiagramProps = {
  readonly children?: string;
  readonly chart?: string;
};

export default function Diagram({ children, chart }: DiagramProps) {
  useEffect(() => {
    mermaid.contentLoaded();
  }, []);

  return <div className="mermaid">
    {children ?? chart}
  </div>;
}
