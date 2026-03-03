import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import { ScreenCard } from "./ScreenCard";
import StepLine from "./StepLine";
import { Theme } from "./theme";

type OutputNameInputProps = {
  onSubmit: (value: string) => void;
  onCancel: () => void;
};

function OutputNameInput({ onSubmit, onCancel }: OutputNameInputProps) {
  const { exit } = useApp();
  const [value, setValue] = useState("");

  useInput((input, key) => {
    if (key.escape || input.toLowerCase() === "q") {
      onCancel();
      exit();
    }
  });

  const preview = (value.trim() || "<name>") + ".yaml";
  const hasValue = value.trim().length > 0;

  return (
    <ScreenCard
      title="Output Profile"
      subtitle="输入输出文件名（不含扩展名）"
      hint="固定后缀: .yaml"
      step={{ current: 3, total: 3 }}
    >
      <Box flexDirection="column">
        <StepLine status="running">配置输出路径</StepLine>
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
        <Box marginTop={1}>
          <Text color={Theme.colors.dimmer}>
            {Theme.symbols.pointerSmall}{" "}
          </Text>
          <Text color={hasValue ? Theme.colors.info : Theme.colors.dim}>
            {Theme.symbols.diamond} {preview}
          </Text>
        </Box>
      </Box>
    </ScreenCard>
  );
}

export function promptOutputName(): Promise<string | null> {
  return new Promise((resolve) => {
    render(
      <OutputNameInput
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
