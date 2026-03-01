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
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply to body and html
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme;
    
    console.log('Theme switched to:', theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ width: 52, height: 28, borderRadius: 14, background: '#252525' }} 
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`${styles.switch} ${theme === 'dark' ? styles.dark : styles.light}`}
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label={`Currently ${theme} mode. Click to switch to ${theme === 'dark' ? 'light' : 'dark'} mode.`}
    >
      <span className={styles.srOnly}>
        Currently {theme} mode. Click to switch to {theme === 'dark' ? 'light' : 'dark'} mode.
      </span>
      <span className={`${styles.thumb} ${theme === 'dark' ? styles.thumbDark : styles.thumbLight}`}>
        {theme === 'dark' ? (
          <Moon size={12} aria-hidden="true" />
        ) : (
          <Sun size={12} aria-hidden="true" />
        )}
      </span>
    </button>
  );
}
