"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from 'lucide-react';
import styles from "./theme-switcher.module.css";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [debugInfo, setDebugInfo] = useState('');

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(initialTheme as 'light' | 'dark');
    setDebugInfo(`Init: ${initialTheme}, saved: ${savedTheme}`);
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    console.log('[ThemeSwitcher] Applying theme:', theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme;
    document.body.style.backgroundColor = theme === 'light' ? '#ffffff' : '#000000';
    setDebugInfo(`Applied: ${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('[ThemeSwitcher] Toggle:', theme, '->', newTheme);
    setTheme(newTheme);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
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
      {/* Debug info - remove in production */}
      <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{debugInfo}</span>
    </div>
  );
}