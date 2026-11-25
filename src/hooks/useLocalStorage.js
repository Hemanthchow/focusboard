import { useEffect, useState } from 'react';

function readStored(key, fallback, validate) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback; // nothing saved yet
    const parsed = JSON.parse(raw);
    if (validate && !validate(parsed)) return fallback; // saved data is malformed
    return parsed;
  } catch {
    // Storage blocked, or the stored JSON is invalid.
    return fallback;
  }
}

/**
 * useState that is restored from, and saved to, localStorage.
 * `initialValue` is only used when nothing valid has been saved,
 * so sample data never overwrites a user's saved tasks.
 */
export default function useLocalStorage(key, initialValue, validate) {
  const [value, setValue] = useState(() => readStored(key, initialValue, validate));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable: the app keeps working in memory.
    }
  }, [key, value]);

  return [value, setValue];
}
