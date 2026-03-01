"use client";
import { useEffect, useState, useCallback } from "react";
import { Moon, Sun } from 'lucide-react';
import styles from "./theme-switcher.module.css";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme;
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    console.log('Toggle clicked, current:', theme);
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [theme]);

  if (!mounted) {
    return (
      <button
        className={`${styles.switch} ${styles.dark}`}
        style={{ width: 48, height: 28, cursor: 'default' }}
        aria-hidden="true"
      >
        <span className={`${styles.thumb} ${styles.thumbDark}`} style={{ transform: 'translateX(22px)' }}>
          <Moon size={12} />
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      onTouchEnd={toggleTheme}
      className={`${styles.switch} ${theme === 'dark' ? styles.dark : styles.light}`}
      style={{ minWidth: 48, minHeight: 28, padding: 2 }}
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className={styles.srOnly}>
        {theme === 'dark' ? 'Dark mode' : 'Light mode'}
      </span>
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
