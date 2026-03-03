import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import TextInput from "ink-text-input";
import { ScreenCard } from "./ScreenCard";
import StepLine from "./StepLine";
import { Theme } from "./theme";
import { useAnimationTick, deriveFrame } from "./useAnimationTick";

type PrimaryInputProps = {
  onSubmit: (value: string) => void;
  onCancel: () => void;
};

function PrimaryInput({ onSubmit, onCancel }: PrimaryInputProps) {
  const { exit } = useApp();
  const [value, setValue] = useState("");
  const tick = useAnimationTick();
  const barIdx = deriveFrame(tick, Theme.symbols.pulse.length, 2);

  useInput((input, key) => {
    if (key.escape || input.toLowerCase() === "q") {
      onCancel();
      exit();
    }
  });

  const lengthColor =
    value.length === 0
      ? Theme.colors.dimmer
      : value.length < 10
        ? Theme.colors.warning
        : Theme.colors.success;

  const pulseChar = Theme.symbols.pulse[barIdx] ?? Theme.symbols.pulse[0];

  return (
    <ScreenCard
      title="Input Source"
      subtitle="粘贴订阅链接或节点文本"
      hint="Enter 确认 · q/ESC 取消"
      step={{ current: 2, total: 3 }}
    >
      <Box flexDirection="column">
        <StepLine status="running">等待输入</StepLine>
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
            <Text color={Theme.colors.dim}>支持 https:// 订阅链接</Text>
          </Text>
          <Text color={Theme.colors.dimmer}>
            {Theme.symbols.pointerSmall}{" "}
            <Text color={Theme.colors.dim}>
              支持 vless://、ss://、YAML、JSON 节点
            </Text>
          </Text>
        </Box>
        <Box marginTop={1}>
          <Text color={Theme.colors.dimmer}>{pulseChar} </Text>
          <Text color={lengthColor}>长度: {value.length}</Text>
        </Box>
      </Box>
    </ScreenCard>
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
