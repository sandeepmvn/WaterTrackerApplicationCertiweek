import { useEffect, useState } from 'react';

export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }

    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue !== null) {
        return JSON.parse(storedValue);
      }
    } catch {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }

    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
