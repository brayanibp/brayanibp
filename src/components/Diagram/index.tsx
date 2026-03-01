"use client";

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
});

type DiagramProps = {
  children?: any;
  chart?: string;
};

export default function Diagram({ children, chart }: DiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get the diagram code from children or chart prop
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
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, diagramCode);
        containerRef.current.innerHTML = svg;
      } catch (error) {
        console.error('Mermaid render error:', error);
        containerRef.current.innerHTML = `<pre class="text-red-400 p-4">${diagramCode}</pre>`;
      }
    };

    renderDiagram();
  }, [diagramCode]);

  if (!diagramCode) return null;

  return (
    <div 
      ref={containerRef} 
      className="mermaid-diagram my-6 p-4 bg-zinc-900 rounded-lg overflow-x-auto flex justify-center"
    />
  );
}
