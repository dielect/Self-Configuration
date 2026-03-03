import React, { memo } from "react";
import { Box, Text } from "ink";
import { Theme } from "./theme";
import { useAnimationTick, deriveFrame } from "./useAnimationTick";

type StepStatus = "pending" | "running" | "completed" | "error";

type StepLineProps = {
  status: StepStatus;
  children: React.ReactNode;
};

const SPIN_COLORS = [
  "#F0956D",
  "#D97757",
  "#A85A3E",
  "#D97757",
];

const AnimatedSpinner = memo(function AnimatedSpinner() {
  const tick = useAnimationTick();
  const idx = deriveFrame(tick, Theme.symbols.spinner.length, 1);
  const colorIdx = deriveFrame(tick, SPIN_COLORS.length, 2);
  const color = SPIN_COLORS[colorIdx]!;

  return (
    <Text color={color} bold>
      {Theme.symbols.spinner[idx]}{" "}
    </Text>
  );
});

const PulseIcon = memo(function PulseIcon() {
  const tick = useAnimationTick();
  const idx = deriveFrame(tick, Theme.symbols.glow.length, 4);

  return (
    <Text color={Theme.colors.glow}>
      {Theme.symbols.glow[idx]}{" "}
    </Text>
  );
});

export const StepLine = memo(function StepLine({
  status,
  children,
}: StepLineProps) {
  if (status === "running") {
    return (
      <Box>
        <AnimatedSpinner />
        <Text color={Theme.colors.primaryBright}>{children}</Text>
      </Box>
    );
  }

  if (status === "completed") {
    return (
      <Box>
        <Text color={Theme.colors.successBright} bold>
          {Theme.symbols.tick}{" "}
        </Text>
        <Text color={Theme.colors.success}>{children}</Text>
      </Box>
    );
  }

  if (status === "error") {
    return (
      <Box>
        <Text color={Theme.colors.errorBright} bold>
          {Theme.symbols.cross}{" "}
        </Text>
        <Text color={Theme.colors.error}>{children}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <PulseIcon />
      <Text color={Theme.colors.dim}>{children}</Text>
    </Box>
  );
});

export default StepLine;
