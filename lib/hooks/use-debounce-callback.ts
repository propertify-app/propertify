import { useCallback, useRef } from 'react';

export function useDebounceCallback<T extends Record<string, any>>(
  callback: (updates: T) => void,
  delay: number
) {
  const timer = useRef<NodeJS.Timeout>();
  const pendingUpdates = useRef<T>({} as T);

  const debouncedCallback = useCallback((updates: Partial<T>) => {
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      callback(pendingUpdates.current);
      pendingUpdates.current = {} as T;
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
}
