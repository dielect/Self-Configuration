import React from "react";
import { Box, Text } from "ink";
import { Logo } from "./Logo";
import { AnimatedBorder } from "./AnimatedBorder";
import { GlowText } from "./GlowText";
import { Theme } from "./theme";
import { useAnimationTick, deriveFrame } from "./useAnimationTick";

type ScreenCardProps = {
  title: string;
  subtitle?: string;
  hint?: string;
  children: React.ReactNode;
  step?: { current: number; total: number };
};

export function ScreenCard({
  title,
  subtitle,
  hint,
  children,
  step,
}: ScreenCardProps) {
  const tick = useAnimationTick();
  const spinIdx = deriveFrame(tick, Theme.symbols.spinner.length, 1);
  const breatheIdx = deriveFrame(tick, Theme.symbols.breathe.length, 4);

  const spin = Theme.symbols.spinner[spinIdx] ?? Theme.symbols.spinner[0];
  const breatheChar =
    Theme.symbols.breathe[breatheIdx] ?? Theme.symbols.breathe[0];

  const cardWidth = 76;

  const stepLabel = step ? ` [${step.current}/${step.total}]` : "";

  return (
    <Box flexDirection="column" width={cardWidth + 4}>
      <Logo />
      <Box marginTop={1} />
      <AnimatedBorder width={cardWidth} position="top" />

      <Text>
        <Text color={Theme.colors.dimmer}>{Theme.symbols.vertical}</Text>
        <Text color={Theme.colors.primary}> {spin} </Text>
        <Text color={Theme.colors.highlight} bold>
          {title}
        </Text>
        {step ? (
          <Text color={Theme.colors.dim}>{stepLabel}</Text>
        ) : null}
      </Text>

      {subtitle ? (
        <Text>
          <Text color={Theme.colors.dimmer}>{Theme.symbols.vertical}</Text>
          <Text color={Theme.colors.dim}>   </Text>
          <Text color={Theme.colors.accent}>{subtitle}</Text>
        </Text>
      ) : null}

      <Text color={Theme.colors.dimmer}>{Theme.symbols.vertical}</Text>

      <Box paddingLeft={2} flexDirection="column">
        {children}
      </Box>

      <Text color={Theme.colors.dimmer}>{Theme.symbols.vertical}</Text>

      {hint ? (
        <Text>
          <Text color={Theme.colors.dimmer}>{Theme.symbols.vertical}</Text>
          <Text color={Theme.colors.dim}>
            {" "}
            <GlowText colors={Theme.colors.gradientWarm} speed={5}>
              {breatheChar}
            </GlowText>{" "}
            {hint}
          </Text>
        </Text>
      ) : null}

      <AnimatedBorder width={cardWidth} position="bottom" />
    </Box>
  );
}
