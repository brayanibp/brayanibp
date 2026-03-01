"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from 'lucide-react';
import styles from "./theme-switcher.module.css";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.switch} ${theme === 'dark' ? styles.dark : styles.light}`}
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className={styles.srOnly}>Toggle theme</span>
      <span className={`${styles.thumb} ${theme === 'dark' ? styles.thumbDark : styles.thumbLight}`}>
        {theme === 'dark' ? (
          <Moon size={14} className={styles.icon} />
        ) : (
          <Sun size={14} className={styles.icon} />
        )}
      </span>
    </button>
  );
}
