import React, { useState, useEffect, useRef } from 'react';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number; // In milliseconds, default 1000ms (1 second)
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 1000,
  prefix = '',
  suffix = '',
  separator = false,
  className = ''
}) => {
  const [count, setCount] = useState<number>(start);
  const containerRef = useRef<HTMLSpanElement>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;

    const startCounting = () => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      let startTime: number | null = null;
      let frameId: number;

      // Professional ease-out curve (smooth fast start, gentle landing within 1s)
      const easeOutQuad = (t: number): number => {
        return t * (2 - t);
      };

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuad(progress);

        const currentVal = Math.round(start + (end - start) * eased);
        setCount(currentVal);

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          setCount(end);
          isAnimatingRef.current = false;
        }
      };

      frameId = requestAnimationFrame(step);

      return () => {
        cancelAnimationFrame(frameId);
        isAnimatingRef.current = false;
      };
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounting();
        } else {
          // Reset count when leaving viewport so it counts up again upon re-entry
          setCount(start);
          isAnimatingRef.current = false;
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      isAnimatingRef.current = false;
    };
  }, [end, start, duration]);

  const formattedNumber = separator ? count.toLocaleString() : count;

  return (
    <span ref={containerRef} className={`inline-block tabular-nums ${className}`}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
