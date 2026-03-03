import { useRef, useCallback, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
) {
  const lastCall = useRef(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = new Date().getTime();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    },
    [callback, delay],
  );
}
