import { useEffect, useState } from "react";

const TICK_INTERVAL = 80;
let globalTick = 0;
let listeners: Set<(tick: number) => void> = new Set();
let timer: ReturnType<typeof setInterval> | null = null;

function startGlobalTimer() {
  if (timer) return;
  timer = setInterval(() => {
    globalTick++;
    for (const fn of listeners) {
      fn(globalTick);
    }
  }, TICK_INTERVAL);
}

function stopGlobalTimer() {
  if (timer && listeners.size === 0) {
    clearInterval(timer);
    timer = null;
  }
}

export function useAnimationTick(): number {
  const [tick, setTick] = useState(globalTick);

  useEffect(() => {
    listeners.add(setTick);
    startGlobalTimer();
    return () => {
      listeners.delete(setTick);
      stopGlobalTimer();
    };
  }, []);

  return tick;
}

export function deriveFrame(tick: number, length: number, divisor: number): number {
  return Math.floor(tick / divisor) % length;
}
