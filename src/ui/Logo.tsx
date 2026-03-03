import React, { memo } from "react";
import { Box, Text } from "ink";
import { useAnimationTick, deriveFrame } from "./useAnimationTick";

const ASCII_LINES = [
  "█▀▀ █▀▀ █   █▀▀   █▀▀ █▀█ █▄ █ █▀▀ █ █▀▀",
  "▀▀█ ██▄ █▄▄ █▀    █▄▄ █▄█ █ ▀█ █▀  █ █▄█",
  "▀▀▀ ▀▀▀ ▀▀▀ ▀     ▀▀▀ ▀▀▀ ▀  ▀ ▀   ▀  ▀▀",
];

const GRADIENT = [
  "#F0956D",
  "#D97757",
  "#A85A3E",
  "#D97757",
  "#F0956D",
  "#E8A87C",
];

export const Logo = memo(function Logo() {
  const tick = useAnimationTick();
  const offset = deriveFrame(tick, GRADIENT.length, 3);

  return (
    <Box flexDirection="column" alignItems="center" marginBottom={1}>
      {ASCII_LINES.map((line, i) => {
        const colorIdx = (i + offset) % GRADIENT.length;
        return (
          <Text key={i} color={GRADIENT[colorIdx]} bold>
            {line}
          </Text>
        );
      })}
    </Box>
  );
});

export default Logo;
