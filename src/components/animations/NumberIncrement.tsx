import { useState, useEffect } from "react";

interface NumberCounterProps {
  endValue: any;
  duration?: number; // Duration in milliseconds
}

export default function NumberCounter({ endValue, duration = 1000 }: NumberCounterProps) {
  const [count, setCount] = useState(0);

  const convertToInteger = (value: any): number => {
    if (value === null || value === undefined) {
      return 0;
    }
    
    // Convert to string if it's not already
    const stringValue = String(value);
    // Remove any non-numeric characters except decimal point
    const numericString = stringValue.replace(/[^0-9.-]/g, '');
    
    // Parse the numeric string
    const parsedValue = parseFloat(numericString);
    return isNaN(parsedValue) ? 0 : Math.floor(parsedValue);
  };

  useEffect(() => {
    let start = 0;
    const finalValue = convertToInteger(endValue);
    const increment = finalValue / (duration / 60); // 60 FPS approximation
    const stepTime = Math.abs(Math.floor(duration / (finalValue || 1))); // Avoid division by zero

    const counter = setInterval(() => {
      start += increment;
      if (start >= finalValue) {
        setCount(finalValue);
        clearInterval(counter);
      } 
      else {
        setCount(Math.ceil(start));
      }
    }, stepTime);

    return () => clearInterval(counter); // Cleanup on unmount
  }, [endValue, duration]);

  // Format the count with commas using toLocaleString
  return <>{count.toLocaleString()}</>;
}