import { Pause, Play, RotateCcw, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type TaskFocusTimerProps = {
  className?: string;
};

export default function TaskFocusTimer({ className }: TaskFocusTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const toggleTimer = () => setIsActive((prev) => !prev);
  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(25 * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progressPercent = ((25 * 60 - secondsLeft) / (25 * 60)) * 100;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border border-border/70 bg-card px-2.5 py-1 text-xs shadow-2xs",
        className,
      )}
    >
      <Target className="size-3.5 text-primary animate-pulse" />
      <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
        {formattedTime}
      </span>
      <div className="h-1 w-12 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <Button
        variant="ghost"
        size="xs"
        onClick={toggleTimer}
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
      >
        {isActive ? <Pause className="size-3" /> : <Play className="size-3" />}
      </Button>
      <Button
        variant="ghost"
        size="xs"
        onClick={resetTimer}
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="size-3" />
      </Button>
    </div>
  );
}
