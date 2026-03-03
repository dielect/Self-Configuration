import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`w-8 h-px ${done ? "bg-primary" : "bg-border"} transition-colors`}
              />
            )}
            <motion.div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                done
                  ? "bg-primary/20 text-primary"
                  : active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {done ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{label}</span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
