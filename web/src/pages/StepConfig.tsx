import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WizardState } from "../App";

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
  onNext: () => void;
}

export function StepConfig({ state, update, onNext }: Props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/config/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      update({ configFile: data.file, configDisplayName: data.name });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!state.configFile) {
      setError("请先上传配置文件");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/config/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configFile: state.configFile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      update({ groups: data.groups, providers: data.providers });
      onNext();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">选择基础配置</h2>
        <p className="text-sm text-muted-foreground">上传 Clash 配置文件作为基础模板</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">上传配置文件</Label>
          <input
            ref={fileRef}
            type="file"
            accept=".yaml,.yml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-colors p-8 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {state.configDisplayName
                ? `已选择: ${state.configDisplayName}`
                : "点击上传 .yaml / .yml 文件"}
            </span>
          </motion.button>
        </div>

        {state.configDisplayName && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-sm"
          >
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-foreground">{state.configDisplayName}</span>
            <span className="text-muted-foreground ml-auto">已就绪</span>
          </motion.div>
        )}

        <div>
          <Label className="mb-2 block">输出文件名</Label>
          <Input
            value={state.outputName}
            onChange={(e) => update({ outputName: e.target.value })}
            placeholder="output.yaml"
          />
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={loading || !state.configFile}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          下一步
        </Button>
      </div>
    </div>
  );
}
