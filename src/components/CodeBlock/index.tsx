"use client";

import { Highlight, themes } from "prism-react-renderer";

// Simple CodeBlock for MDX - handles content passed as children string
function CodeBlock(props: { children?: any; language?: string; className?: string }) {
  const { children, language = "text" } = props;
  
  let code = "";
  if (typeof children === "string") {
    code = children;
  } else if (children) {
    code = String(children);
  }
  
  const lang = (language?.replace("language-", "") || "text").trim() || "text";

  return (
    <Highlight theme={themes.nightOwl} code={code.trim()} language={lang as any}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${className} rounded-lg p-4 overflow-x-auto text-sm my-4`} style={{ ...style, background: "#1a1a1a" }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              <span className="inline-block w-8 text-zinc-600 select-none text-right mr-4">{i + 1}</span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

export default CodeBlock;
