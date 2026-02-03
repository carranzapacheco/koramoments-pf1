"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  threshold?: number; // cuánto del elemento debe ser visible para activar
  once?: boolean;     // si solo se anima la primera vez
};

export const ScrollReveal = ({
  children,
  className = "",
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={`
        transition-opacity transition-transform duration-700 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
