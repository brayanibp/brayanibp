import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function useTheme(): [string|null, Dispatch<SetStateAction<string|null>>]
{
  const [theme, setTheme] = useState<string|null>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      return;
    }

    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (userPrefersDark) {
      setTheme('dark');
      return;
    }
  }, []);

  useEffect(() => {
    if (!theme) {
      return;
    }
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
}
