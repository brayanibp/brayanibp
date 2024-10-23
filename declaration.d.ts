// declaration.d.ts
declare module 'react-syntax-highlighter/dist/esm/languages/hljs' {
  type Language = {
    name: string;
    aliases?: string[];
    keywords: {
      keyword: string;
      literal: string;
      built_in: string;
    };
    contains: Array<any>;
    illegal?: string;
  }

  // Named exports for specific languages
  export const javascript: Language;
  export const php: Language;
  export const bash: Language;
  export const python: Language;
  export const markdown: Language;
  export const json: Language;

  type Languages = {
    [language: string]: Language;
  }

  const languages: Languages;

  export default languages;
}

