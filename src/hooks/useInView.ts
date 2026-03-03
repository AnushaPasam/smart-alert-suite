import { useEffect, useRef, useState, useMemo } from "react";

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const stableOptions = useMemo(
    () => ({ threshold: 0.1, ...options }),
    [options],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, stableOptions);
    observer.observe(el);
    return () => observer.disconnect();
  }, [stableOptions]);

  return { ref, inView };
}
