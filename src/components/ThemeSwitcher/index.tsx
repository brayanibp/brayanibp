"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from 'lucide-react';
import styles from "./theme-switcher.module.css";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.switch} ${theme === 'dark' ? styles.dark : styles.light}`}
      style={{ width: 48, height: 28, padding: 2, cursor: 'pointer' }}
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span 
        className={`${styles.thumb} ${theme === 'dark' ? styles.thumbDark : styles.thumbLight}`}
      >
        {theme === 'dark' ? (
          <Moon size={12} aria-hidden="true" />
        ) : (
          <Sun size={12} aria-hidden="true" />
        )}
      </span>
    </button>
  );
}
