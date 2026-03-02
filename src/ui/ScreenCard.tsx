import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import { Logo } from "./Logo";
import { Theme } from "./theme";

type ScreenCardProps = {
  title: string;
  subtitle?: string;
  hint?: string;
  children: React.ReactNode;
};

function line(width: number): string {
  return Theme.symbols.horizontal.repeat(Math.max(2, width));
}

export function ScreenCard({ title, subtitle, hint, children }: ScreenCardProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev + 1) % Theme.symbols.spinner.length);
    }, 120);

    return () => clearInterval(timer);
  }, []);

  const spin = Theme.symbols.spinner[tick] ?? Theme.symbols.spinner[0];
  const top = `${Theme.symbols.corner.topLeft}${line(76)}${Theme.symbols.corner.topRight}`;
  const bottom = `${Theme.symbols.corner.bottomLeft}${line(76)}${Theme.symbols.corner.bottomRight}`;

  return (
    <Box flexDirection="column" width={84}>
      <Logo />
      <Text color={Theme.colors.dim}>{top}</Text>
      <Text color={Theme.colors.dim}>
        {Theme.symbols.vertical} <Text color={Theme.colors.primary}>{spin}</Text>{" "}
        <Text color={Theme.colors.highlight} bold>{title}</Text>
      </Text>
      {subtitle ? (
        <Text color={Theme.colors.dim}>
          {Theme.symbols.vertical} <Text color={Theme.colors.text}>{subtitle}</Text>
        </Text>
      ) : null}
      <Text color={Theme.colors.dim}>{Theme.symbols.vertical}</Text>
      <Box paddingLeft={2} flexDirection="column">
        {children}
      </Box>
      <Text color={Theme.colors.dim}>{Theme.symbols.vertical}</Text>
      {hint ? (
        <Text color={Theme.colors.dim}>
          {Theme.symbols.vertical} {hint}
        </Text>
      ) : null}
      <Text color={Theme.colors.dim}>{bottom}</Text>
    </Box>
  );
}
