import { useCallback, useRef } from "react";

/**
 * Custom hook that throttles a callback function
 * @param callback - The function to throttle
 * @param delay - The delay in milliseconds (default: 200ms)
 * @returns The throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 200
): (...args: Parameters<T>) => void {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(
          () => {
            callback(...args);
            lastRun.current = Date.now();
          },
          delay - timeSinceLastRun
        );
      }
    },
    [callback, delay]
  );
}
