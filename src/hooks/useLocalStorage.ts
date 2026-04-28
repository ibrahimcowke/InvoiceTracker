import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get initial value from localStorage or use provided initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Listen for changes emitted by other components or tabs
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        } else {
          setStoredValue(initialValue);
        }
      } catch (error) {
        console.error(`Error reading from local storage on sync for key "${key}"`);
      }
    };

    // Custom event listener for same-tab synchronization
    window.addEventListener(`local-storage-${key}`, handleStorageChange);
    // Standard storage event listener for cross-tab synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === key) handleStorageChange();
    });

    return () => {
      window.removeEventListener(`local-storage-${key}`, handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage and dispatches a custom event.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new Event(`local-storage-${key}`));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
