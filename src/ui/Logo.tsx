import React, { memo } from "react";
import { Box, Text } from "ink";
import { Theme } from "./theme";
import { useAnimationTick, deriveFrame } from "./useAnimationTick";

const LOGO_LINES = [
  "┏━━━┓╋╋╋╋╋╋╋╋┏━━━┓╋╋╋╋╋╋┏━━━┓╋╋╋╋╋╋╋",
  "┃╋╋╋┃╋╋╋╋╋╋╋╋┃╋╋╋┃╋╋╋╋╋╋┃╋╋╋┃╋╋╋╋╋╋╋",
  "┗━━━┓┏━━━┓╋╋╋┃╋╋╋┃╋╋╋╋╋╋┃╋╋╋┃╋╋╋╋╋╋╋",
  "╋╋╋╋┃┃╋╋╋┃╋╋╋┃╋╋╋┃╋╋╋╋╋╋┃╋╋╋┃╋╋╋╋╋╋╋",
  "┗━━━┛┗━━━┛╋╋╋┗━━━┛╋╋╋╋╋╋┗━━━┛╋╋╋╋╋╋╋",
];

const ASCII_LINES = [
  " ___       _  __    ___             __ _       ",
  "/ __| ___ | |/ _|  / __|___ _ _  / _(_)__ _ ",
  "\\__ \\/ -_)| |  _| | (__/ _ \\ ' \\|  _| / _` |",
  "|___/\\___||_|_|    \\___\\___/_||_|_| |_\\__, |",
  "                                      |___/ ",
];

const GRADIENT = [
  "#F0956D",
  "#E8A87C",
  "#D97757",
  "#C4623F",
  "#A85A3E",
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
