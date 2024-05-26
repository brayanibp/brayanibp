import type { MDXComponents } from 'mdx/types';
import SyntaxHighlighter from "react-syntax-highlighter";
 
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    SyntaxHighlighter,
  }
}