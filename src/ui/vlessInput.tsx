import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import TextInput from "ink-text-input";

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
    <Box flexDirection="column">
      <Text>请输入订阅链接或节点（回车确认，q/ESC 取消）</Text>
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
      <Text color="gray">支持: https://订阅链接 / vless://链接 / YAML/JSON 节点</Text>
    </Box>
  );
}

export function promptPrimaryInput(): Promise<string | null> {
  return new Promise((resolve) => {
    render(
      <PrimaryInput
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
