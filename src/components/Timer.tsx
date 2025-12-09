import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/taskUtils';
import { cn } from '@/lib/utils';

interface TimerProps {
  isActive: boolean;
  totalTime: number;
  currentSessionStart?: Date;
  onStart: () => void;
  onPause: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Timer = ({
  isActive,
  totalTime,
  currentSessionStart,
  onStart,
  onPause,
  size = 'md',
}: TimerProps) => {
  const [displayTime, setDisplayTime] = useState(totalTime);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && currentSessionStart) {
      interval = setInterval(() => {
        const currentDuration = Math.floor(
          (new Date().getTime() - new Date(currentSessionStart).getTime()) / 1000
        );
        setDisplayTime(totalTime + currentDuration);
      }, 1000);
    } else {
      setDisplayTime(totalTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentSessionStart, totalTime]);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl md:text-5xl',
  };

  const buttonSizes = {
    sm: 'icon' as const,
    md: 'iconLg' as const,
    lg: 'iconXl' as const,
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className={cn(
          'font-mono font-bold tracking-wider transition-all duration-300',
          sizeClasses[size],
          isActive ? 'text-primary' : 'text-foreground'
        )}
      >
        {formatTime(displayTime)}
      </div>
      
      <Button
        variant={isActive ? 'timer' : 'timerPaused'}
        size={buttonSizes[size]}
        onClick={isActive ? onPause : onStart}
        className={cn(
          'rounded-full transition-all duration-300',
          isActive && 'animate-pulse-ring'
        )}
      >
        {isActive ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>
    </div>
  );
};
