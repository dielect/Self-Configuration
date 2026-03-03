import React from "react";
import { Box, Text } from "ink";
import { Logo } from "./Logo";
import { BorderBox } from "./BorderBox";
import { Theme } from "./theme";
import { useAnimationTick, deriveFrame } from "./useAnimationTick";

type ScreenCardProps = {
  title: string;
  subtitle?: string;
  hint?: string;
  bullets?: string[];
  children: React.ReactNode;
  step?: { current: number; total: number };
};

export function ScreenCard({
  title,
  subtitle,
  hint,
  bullets,
  children,
  step,
}: ScreenCardProps) {
  const tick = useAnimationTick();
  const spinIdx = deriveFrame(tick, Theme.symbols.spinner.length, 1);
  const spin = Theme.symbols.spinner[spinIdx] ?? Theme.symbols.spinner[0];

  const stepLabel = step ? ` (${step.current}/${step.total})` : "";

  return (
    <Box flexDirection="column" width={76}>
      <Logo />

      <BorderBox>
        <Text>
          <Text color={Theme.colors.primary}>{Theme.symbols.star} </Text>
          <Text color={Theme.colors.highlight} bold>{title}</Text>
          {step ? (
            <Text color={Theme.colors.dim}>{stepLabel}</Text>
          ) : null}
        </Text>
        {subtitle ? (
          <Box marginTop={0}>
            <Text color={Theme.colors.dim}>  {subtitle}</Text>
          </Box>
        ) : null}
      </BorderBox>

      {bullets && bullets.length > 0 ? (
        <Box flexDirection="column" marginTop={1} paddingLeft={1}>
          {bullets.map((b, i) => (
            <Text key={i} color={Theme.colors.dim}>
              {Theme.symbols.bullet} {b}
            </Text>
          ))}
        </Box>
      ) : null}

      {hint ? (
        <Box marginTop={1} paddingLeft={1}>
          <Text color={Theme.colors.primary}>{Theme.symbols.star} </Text>
          <Text color={Theme.colors.dim}>{hint}</Text>
        </Box>
      ) : null}

      <Box marginTop={1}>
        <BorderBox>
          <Box flexDirection="column">
            <Box>
              <Text color={Theme.colors.primary}>{spin} </Text>
              {children}
            </Box>
          </Box>
        </BorderBox>
      </Box>
    </Box>
  );
}
