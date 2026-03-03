import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import { ScreenCard } from "./ScreenCard";
import { Theme } from "./theme";

type PrimaryInputProps = {
  onSubmit: (value: string) => void;
  onCancel: () => void;
};

function PrimaryInput({ onSubmit, onCancel }: PrimaryInputProps) {
  const { exit } = useApp();
  const [value, setValue] = useState("");

  useInput((input, key) => {
    if (key.escape || input.toLowerCase() === "q") {
      onCancel();
      exit();
    }
  });

  return (
    <ScreenCard
      title="输入节点源"
      subtitle="粘贴订阅链接或节点文本"
      step={{ current: 2, total: 3 }}
      bullets={[
        "支持 https:// 订阅链接",
        "支持 vless://、ss://、YAML、JSON 节点",
      ]}
      hint="Enter 确认 · q/ESC 取消"
    >
      <Text color={Theme.colors.highlight}>{Theme.symbols.arrow} </Text>
      <TextInput
        value={value}
        onChange={setValue}
        onSubmit={(text) => {
          const trimmed = text.trim();
          if (!trimmed) return;
          onSubmit(trimmed);
          exit();
        }}
      />
    </ScreenCard>
  );
}

export function promptPrimaryInput(): Promise<string | null> {
  return new Promise((resolve) => {
    render(
      <PrimaryInput
        onSubmit={(value) => resolve(value)}
        onCancel={() => resolve(null)}
      />,
    );
  });
}
