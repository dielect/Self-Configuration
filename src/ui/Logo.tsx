import React, { memo } from "react";
import { Box, Text } from "ink";
import { Theme } from "./theme";
import { useAnimationTick, deriveFrame } from "./useAnimationTick";

const LOGO_LINES = [
  "███████╗███████╗██╗     ███████╗",
  "██╔════╝██╔════╝██║     ██╔════╝",
  "███████╗█████╗  ██║     █████╗  ",
  "╚════██║██╔══╝  ██║     ██╔══╝  ",
  "███████║███████╗███████╗██║     ",
  "╚══════╝╚══════╝╚══════╝╚═╝    ",
];

const SUBTITLE = " CONFIG";

const GRADIENT_COLORS = [
  "#F0956D",
  "#E8A87C",
  "#D97757",
  "#C4623F",
  "#A85A3E",
  "#C4623F",
  "#D97757",
  "#E8A87C",
];

export const Logo = memo(function Logo() {
  const tick = useAnimationTick();
  const offset = deriveFrame(tick, GRADIENT_COLORS.length, 3);

  return (
    <Box flexDirection="column" marginBottom={0}>
      {LOGO_LINES.map((line, i) => {
        const colorIdx = (i + offset) % GRADIENT_COLORS.length;
        const color = GRADIENT_COLORS[colorIdx]!;
        return (
          <Text key={i} color={color} bold>
            {line}
          </Text>
        );
      })}
      <Text color={Theme.colors.glow} bold dimColor>
        {"                               "}
        <Text color={Theme.colors.accent}>{SUBTITLE}</Text>
      </Text>
    </Box>
  );
});

export default Logo;
