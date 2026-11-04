"use client";
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
});

type DiagramProps = {
  readonly children?: string;
  readonly chart?: string;
};

export default function Diagram({ children, chart }: DiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const source = children ?? chart ?? "";

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.textContent = source;

    mermaid
      .run({ nodes: [containerRef.current] })
      .catch((error) => {
        console.error("Mermaid render failed", error);
      });
  }, [source]);

  return <div ref={containerRef} className="mermaid" />;
}
