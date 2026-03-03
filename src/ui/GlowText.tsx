import React, { memo } from "react";
import { Text } from "ink";
import { Theme } from "./theme";
import { useAnimationTick, deriveFrame } from "./useAnimationTick";

type GlowTextProps = {
  children: string;
  colors?: readonly string[];
  speed?: number;
  bold?: boolean;
};

export const GlowText = memo(function GlowText({
  children,
  colors = Theme.colors.gradientWarm,
  speed = 4,
  bold = false,
}: GlowTextProps) {
  const tick = useAnimationTick();
  const idx = deriveFrame(tick, colors.length, speed);
  const color = colors[idx] ?? colors[0];

  return (
    <Text color={color} bold={bold}>
      {children}
    </Text>
  );
});

export default GlowText;
