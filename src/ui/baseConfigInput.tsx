import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import { ScreenCard } from "./ScreenCard";
import StepLine from "./StepLine";
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
      title="Base Config"
      subtitle="输入基础配置文件路径"
      hint="Enter 确认 · q/ESC 取消"
      step={{ current: 1, total: 3 }}
    >
      <Box flexDirection="column">
        <StepLine status="running">选择基础配置文件</StepLine>
        <Box marginTop={1}>
          <Text color={Theme.colors.primary} bold>
            {Theme.symbols.pointer}{" "}
          </Text>
          <TextInput
            value={value}
            onChange={setValue}
            onSubmit={(text) => {
              const trimmed = text.trim();
              if (!trimmed) {
                return;
              }
              onSubmit(trimmed);
              exit();
            }}
          />
        </Box>
        <Box marginTop={1} flexDirection="column">
          <Text color={Theme.colors.dimmer}>
            {Theme.symbols.pointerSmall}{" "}
            <Text color={Theme.colors.dim}>
              示例: Clash.yaml / profiles/B.yaml
            </Text>
          </Text>
        </Box>
      </Box>
    </ScreenCard>
  );
}

export function promptBaseConfigPath(defaultValue: string): Promise<string | null> {
  return new Promise((resolve) => {
    render(
      <BaseConfigInput
        defaultValue={defaultValue}
        onSubmit={(value) => {
          resolve(value);
        }}
        onCancel={() => {
          resolve(null);
        }}
      />,
    );
  });
}
