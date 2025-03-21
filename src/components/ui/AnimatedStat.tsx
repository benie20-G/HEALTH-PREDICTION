
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  className?: string;
  icon?: React.ReactNode;
}

const AnimatedStat: React.FC<AnimatedStatProps> = ({
  value,
  suffix = '',
  label,
  duration = 1000,
  className,
  icon
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (value <= 0) {
      setDisplayValue(0);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const nextValue = Math.floor(progress * value);
      
      setDisplayValue(nextValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return (
    <div className={cn("text-center", className)}>
      <div className="flex items-center justify-center mb-2">
        {icon && <div className="mr-2">{icon}</div>}
        <div className="health-stat">{displayValue}{suffix}</div>
      </div>
      <p className="text-sm text-health-foreground/70">{label}</p>
    </div>
  );
};

export default AnimatedStat;
