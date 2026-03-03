import React, { memo } from "react";
import { Box, Text } from "ink";
import { Theme } from "./theme";
import { useAnimationTick, deriveFrame } from "./useAnimationTick";

type StepStatus = "pending" | "running" | "completed" | "error";

type StepLineProps = {
  status: StepStatus;
  children: React.ReactNode;
};

export const StepLine = memo(function StepLine({
  status,
  children,
}: StepLineProps) {
  const tick = useAnimationTick();
  const spinIdx = deriveFrame(tick, Theme.symbols.spinner.length, 1);

  if (status === "running") {
    return (
      <Box>
        <Text color={Theme.colors.primary}>
          {Theme.symbols.spinner[spinIdx]}{" "}
        </Text>
        <Text color={Theme.colors.text}>{children}</Text>
      </Box>
    );
  }

  if (status === "completed") {
    return (
      <Box>
        <Text color={Theme.colors.successBright} bold>
          {Theme.symbols.tick}{" "}
        </Text>
        <Text color={Theme.colors.text}>{children}</Text>
      </Box>
    );
  }

  if (status === "error") {
    return (
      <Box>
        <Text color={Theme.colors.error} bold>
          {Theme.symbols.cross}{" "}
        </Text>
        <Text color={Theme.colors.text}>{children}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text color={Theme.colors.dim}>{Theme.symbols.circleOpen} </Text>
      <Text color={Theme.colors.dim}>{children}</Text>
    </Box>
  );
});

export default StepLine;
