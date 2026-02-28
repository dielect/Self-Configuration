import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import TextInput from "ink-text-input";

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

  return (
    <Box flexDirection="column">
      <Text>请输入输出文件名（只输入名称，不含扩展名）</Text>
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
      <Text color="gray">结果将保存为: 名称.yaml</Text>
    </Box>
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
