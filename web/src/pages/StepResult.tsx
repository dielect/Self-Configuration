import { motion } from "framer-motion";
import { CheckCircle2, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WizardState } from "../App";

interface Props {
  state: WizardState;
  onReset: () => void;
}

export function StepResult({ state, onReset }: Props) {
  const handleDownload = async () => {
    if (!state.outputName) return;
    try {
      const res = await fetch("/api/config/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outputName: state.outputName }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = state.outputName || "output.yaml";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent
    }
  };

  return (
    <div className="space-y-8 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center"
      >
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h2 className="text-xl font-semibold text-foreground">配置生成完成</h2>
        <p className="text-sm text-muted-foreground">{state.result?.summary}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center gap-3"
      >
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4" />
          下载配置文件
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="w-4 h-4" />
          重新开始
        </Button>
      </motion.div>
    </div>
  );
}
