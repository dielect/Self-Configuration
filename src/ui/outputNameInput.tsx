import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import { ScreenCard } from "./ScreenCard";
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

  return (
    <ScreenCard
      title="输出文件名"
      subtitle="输入文件名（不含扩展名）"
      step={{ current: 3, total: 3 }}
      bullets={[`预览: ${preview}`]}
      hint="固定后缀 .yaml · Enter 确认"
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

export function promptOutputName(): Promise<string | null> {
  return new Promise((resolve) => {
    render(
      <OutputNameInput
        onSubmit={(value) => resolve(value)}
        onCancel={() => resolve(null)}
      />,
    );
  });
}
