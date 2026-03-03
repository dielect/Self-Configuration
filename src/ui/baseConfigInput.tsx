import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import { ScreenCard } from "./ScreenCard";
import { Theme } from "./theme";

type BaseConfigInputProps = {
  defaultValue: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
};

function BaseConfigInput({ defaultValue, onSubmit, onCancel }: BaseConfigInputProps) {
  const { exit } = useApp();
  const [value, setValue] = useState(defaultValue);

  useInput((input, key) => {
    if (key.escape || input.toLowerCase() === "q") {
      onCancel();
      exit();
    }
  });

  return (
    <ScreenCard
      title="选择基础配置"
      subtitle="指定 Clash 基础配置文件路径"
      step={{ current: 1, total: 3 }}
      bullets={[
        "默认使用当前目录下的 Clash.yaml",
        "支持相对路径或绝对路径",
      ]}
      hint="Enter 确认 · q/ESC 取消"
    >
      <Box>
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
      </Box>
    </ScreenCard>
  );
}

export function promptBaseConfigPath(defaultValue: string): Promise<string | null> {
  return new Promise((resolve) => {
    render(
      <BaseConfigInput
        defaultValue={defaultValue}
        onSubmit={(value) => resolve(value)}
        onCancel={() => resolve(null)}
      />,
    );
  });
}
