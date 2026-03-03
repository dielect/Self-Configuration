import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Link, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { WizardState } from "../App";

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepInput({ state, update, onNext, onBack }: Props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleParse = async () => {
    if (!state.input.trim()) {
      setError("请输入节点链接或订阅地址");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: state.input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.kind === "proxy-node") {
        update({ inputKind: "proxy-node", parsedProxy: data.proxy, parsedUrl: null });
      } else {
        update({ inputKind: "provider-url", parsedUrl: data.url, parsedProxy: null });
      }
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
        <h2 className="text-lg font-semibold text-foreground mb-1">输入节点信息</h2>
        <p className="text-sm text-muted-foreground">
          粘贴 VLESS / Shadowsocks 链接，或订阅地址
        </p>
      </div>

      <div className="space-y-3">
        <Label>节点链接 / 订阅 URL</Label>
        <Textarea
          value={state.input}
          onChange={(e) => update({ input: e.target.value })}
          placeholder={"vless://...\nss://...\nhttps://subscribe.example.com/..."}
          rows={5}
          className="font-mono text-xs"
        />
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="w-3 h-3" />
            <span>支持 VLESS / SS 协议</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link className="w-3 h-3" />
            <span>支持 HTTP(S) 订阅链接</span>
          </div>
        </div>
      </div>

      {state.parsedProxy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-md bg-muted p-3"
        >
          <p className="text-xs text-muted-foreground mb-1">解析结果</p>
          <pre className="text-xs text-foreground overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(state.parsedProxy, null, 2)}
          </pre>
        </motion.div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          上一步
        </Button>
        <Button onClick={handleParse} disabled={loading || !state.input.trim()}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          解析并继续
        </Button>
      </div>
    </div>
  );
}
