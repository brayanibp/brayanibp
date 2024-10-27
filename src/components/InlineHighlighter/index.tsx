import style from './inline-highlighter.module.css';

type InlineHighlighterProps = {
  children: string;
}

export default function InlineHighlighter({ children }: InlineHighlighterProps) {
  return (
    <code className={style['inline-highlight']}>
      {children}
    </code>
  );
}