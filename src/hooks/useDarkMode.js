import { useState, useEffect } from 'react';

const DARK_MODE_OVERRIDE_KEY = 'darkModeOverride';
const LEGACY_DARK_MODE_KEY = 'darkMode';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(DARK_MODE_OVERRIDE_KEY);
    if (stored === null) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return stored === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (localStorage.getItem(LEGACY_DARK_MODE_KEY) !== null) {
      localStorage.removeItem(LEGACY_DARK_MODE_KEY);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => {
      const override = localStorage.getItem(DARK_MODE_OVERRIDE_KEY);
      if (override === null) {
        setIsDark(event.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggle = () => {
    const next = !isDark;
    localStorage.setItem(DARK_MODE_OVERRIDE_KEY, String(next));
    setIsDark(next);
  };

  return [isDark, toggle];
}
