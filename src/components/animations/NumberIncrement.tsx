import { useState, useEffect } from "react";

interface NumberCounterProps {
  endValue: number;
  duration?: number; // Duration in milliseconds
}

export default function NumberCounter({ endValue, duration = 1000 }: NumberCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = endValue / (duration / 60); // 60 FPS approximation
    const stepTime = Math.abs(Math.floor(duration / (endValue || 1))); // Avoid division by zero

    const counter = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(counter);
      } else {
        setCount(Math.ceil(start));
      }
    }, stepTime);

    return () => clearInterval(counter); // Cleanup on unmount
  }, [endValue, duration]);

  // Format the count with US number formatting, no decimals
  return <>{count.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</>;
}