"use client";

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
  },
});

type DiagramProps = {
  children?: any;
  chart?: string;
};

export default function Diagram({ children, chart }: DiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  
  let diagramCode = '';
  if (typeof children === 'string') {
    diagramCode = children;
  } else if (chart) {
    diagramCode = chart;
  } else if (children) {
    diagramCode = String(children);
  }

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current || !diagramCode) return;
      
      try {
        // Clean the code - remove any template literal syntax
        const cleanCode = diagramCode.trim().replace(/^{|`}$/g, '').trim();
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, cleanCode);
        containerRef.current.innerHTML = svg;
        setError(false);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(true);
      }
    };

    if (diagramCode) {
      renderDiagram();
    }
  }, [diagramCode]);

  if (!diagramCode) return null;

  if (error) {
    return (
      <div className="my-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
        <p className="text-red-400 text-sm">Failed to render diagram</p>
        <pre className="mt-2 text-xs text-zinc-400 overflow-x-auto">{diagramCode}</pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="mermaid-diagram my-6 p-4 bg-zinc-900 rounded-lg overflow-x-auto flex justify-center"
    />
  );
}
