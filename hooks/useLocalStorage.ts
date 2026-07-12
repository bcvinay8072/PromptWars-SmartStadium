import { useState, useCallback } from 'react';

/**
 * Custom hook that syncs React state with localStorage for persistence.
 * @template T - Type of the stored value
 * @param {string} key - localStorage key
 * @param {T} initialValue - Default value if nothing stored
 * @returns {[T, (v: T | ((prev: T) => T)) => void]} The current value and a setter function
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(next));
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
