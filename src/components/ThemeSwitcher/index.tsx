"use client";
import { useEffect } from "react";
import { Moon, Sun } from 'lucide-react';
import styles from "./theme-switcher.module.css";
import useTheme from "@/hooks/useThemeHook";

export default function Component() {
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    document.body.dataset.theme = theme ?? "dark";
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  }

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.switch} ${theme === "dark" ? styles.dark : styles.light}`}
      role="switch"
      aria-checked={theme === "dark"}
    >
      <span className={styles.srOnly}>Toggle theme</span>
      <span className={`${styles.thumb} ${theme === "dark" ? styles.thumbDark : styles.thumbLight}`}>
        {theme === "dark" ? (
          <Moon className={styles.icon} />
        ) : (
          <Sun className={styles.icon} />
        )}
      </span>
    </button>
  );
}