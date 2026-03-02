import React, { memo, useEffect, useState } from "react";
import { Box, Text } from "ink";
import { Theme } from "./theme";

type StepStatus = "pending" | "running" | "completed" | "error";

type StepLineProps = {
  status: StepStatus;
  children: React.ReactNode;
};

const LoadingOrb = memo(function LoadingOrb() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % Theme.symbols.spinner.length);
    }, 120);

    return () => clearInterval(timer);
  }, []);

  return <Text color={Theme.colors.primary}>{Theme.symbols.spinner[idx]} </Text>;
});

export const StepLine = memo(function StepLine({ status, children }: StepLineProps) {
  if (status === "running") {
    return (
      <Box>
        <LoadingOrb />
        <Text color={Theme.colors.primary}>{children}</Text>
      </Box>
    );
  }

  if (status === "completed") {
    return (
      <Text color={Theme.colors.success}>
        {Theme.symbols.tick} {children}
      </Text>
    );
  }

  if (status === "error") {
    return (
      <Text color={Theme.colors.error}>
        {Theme.symbols.cross} {children}
      </Text>
    );
  }

  return <Text color={Theme.colors.dim}>○ {children}</Text>;
});

export default StepLine;
