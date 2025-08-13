import style from './button.module.css';

type ButtonProps = {
    text: string;
    action: () => void;
    className?: string;
}

export default function Button({ text, action, className }: ButtonProps) {
    return (
        <button className={`${style['button']} ${className}`} onClick={action}>
            {text}
        </button>
    );
}
