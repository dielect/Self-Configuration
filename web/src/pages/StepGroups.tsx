import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { WizardState } from "../App";

interface Props {
  state: WizardState;
  update: (partial: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepGroups({ state, update, onNext, onBack }: Props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isProviderUrl = state.inputKind === "provider-url";

  const toggleGroup = (name: string) => {
    const next = state.selectedGroups.includes(name)
      ? state.selectedGroups.filter((g) => g !== name)
      : [...state.selectedGroups, name];
    update({ selectedGroups: next });
  };

  const toggleAll = () => {
    if (state.selectedGroups.length === state.groups.length) {
      update({ selectedGroups: [] });
    } else {
      update({ selectedGroups: [...state.groups] });
    }
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      let res: Response;

      if (isProviderUrl) {
        if (!state.selectedProvider) {
          setError("请选择一个 proxy-provider");
          setLoading(false);
          return;
        }
        if (!state.parsedUrl) {
          setError("缺少订阅地址");
          setLoading(false);
          return;
        }
        res = await fetch("/api/config/update-provider", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            configFile: state.configFile,
            outputName: state.outputName,
            providerName: state.selectedProvider,
            url: state.parsedUrl,
          }),
        });
      } else {
        if (!state.parsedProxy) {
          setError("缺少节点数据，请返回上一步重新解析");
          setLoading(false);
          return;
        }
        if (state.selectedGroups.length === 0) {
          setError("请至少选择一个分组");
          setLoading(false);
          return;
        }
        res = await fetch("/api/config/add-proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            configFile: state.configFile,
            outputName: state.outputName,
            proxy: state.parsedProxy,
            targetGroupNames: state.selectedGroups,
            removeAllProxiesProvider: true,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const summary = isProviderUrl
        ? `已更新 proxy-provider: ${data.providerName}`
        : `新增节点: ${data.proxyName}，写入 ${data.attachedGroups.length} 个分组`;

      update({ result: { outputPath: data.outputPath, summary } });
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
        <h2 className="text-lg font-semibold text-foreground mb-1">
          {isProviderUrl ? "选择 Provider" : "选择策略组"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isProviderUrl
            ? "选择要更新订阅地址的 proxy-provider"
            : "选择要写入节点的策略组"}
        </p>
      </div>

      {isProviderUrl ? (
        <div className="space-y-3">
          <Label>Proxy Provider</Label>
          {state.providers.length === 0 ? (
            <p className="text-sm text-muted-foreground">配置中没有找到 proxy-provider</p>
          ) : (
            <div className="space-y-2">
              {state.providers.map((name) => (
                <motion.label
                  key={name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${
                    state.selectedProvider === name
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-muted hover:bg-muted/80 border border-transparent"
                  }`}
                  onClick={() => update({ selectedProvider: name })}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      state.selectedProvider === name
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  >
                    {state.selectedProvider === name && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-sm text-foreground">{name}</span>
                </motion.label>
              ))}
            </div>
          )}
          <div className="mt-3">
            <Label className="mb-2 block">订阅地址</Label>
            <Input value={state.parsedUrl ?? ""} readOnly className="font-mono text-xs opacity-70" />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {state.groups.length === 0 ? (
            <p className="text-sm text-muted-foreground">配置中没有找到可写入的策略组</p>
          ) : (
            <>
              <motion.label
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={toggleAll}
              >
                <Checkbox
                  checked={state.selectedGroups.length === state.groups.length}
                  onCheckedChange={toggleAll}
                />
                <span className="text-sm font-medium text-foreground">全选</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {state.selectedGroups.length} / {state.groups.length}
                </span>
              </motion.label>

              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {state.groups.map((name, i) => (
                  <motion.label
                    key={name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      state.selectedGroups.includes(name)
                        ? "bg-primary/10"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleGroup(name)}
                  >
                    <Checkbox
                      checked={state.selectedGroups.includes(name)}
                      onCheckedChange={() => toggleGroup(name)}
                    />
                    <span className="text-sm text-foreground">{name}</span>
                  </motion.label>
                ))}
              </div>
            </>
          )}
        </div>
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
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          生成配置
        </Button>
      </div>
    </div>
  );
}
