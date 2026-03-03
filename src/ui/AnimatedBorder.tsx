import React, { memo } from "react";
import { Text } from "ink";
import { Theme } from "./theme";
import { useAnimationTick, deriveFrame } from "./useAnimationTick";

type AnimatedBorderProps = {
  width: number;
  position: "top" | "bottom";
};

const BORDER_COLORS = [
  "#D97757",
  "#C4623F",
  "#A85A3E",
  "#8B4D35",
  "#5C5C5C",
  "#8B4D35",
  "#A85A3E",
  "#C4623F",
];

export const AnimatedBorder = memo(function AnimatedBorder({
  width,
  position,
}: AnimatedBorderProps) {
  const tick = useAnimationTick();
  const offset = deriveFrame(tick, BORDER_COLORS.length, 2);

  const left =
    position === "top"
      ? Theme.symbols.corner.topLeft
      : Theme.symbols.corner.bottomLeft;
  const right =
    position === "top"
      ? Theme.symbols.corner.topRight
      : Theme.symbols.corner.bottomRight;
  const line = Theme.symbols.horizontal.repeat(Math.max(2, width));

  const segLen = Math.ceil(line.length / 3);
  const seg1 = line.slice(0, segLen);
  const seg2 = line.slice(segLen, segLen * 2);
  const seg3 = line.slice(segLen * 2);

  const c1 = BORDER_COLORS[offset % BORDER_COLORS.length]!;
  const c2 = BORDER_COLORS[(offset + 2) % BORDER_COLORS.length]!;
  const c3 = BORDER_COLORS[(offset + 4) % BORDER_COLORS.length]!;

  return (
    <Text>
      <Text color={c1}>{left}</Text>
      <Text color={c1}>{seg1}</Text>
      <Text color={c2}>{seg2}</Text>
      <Text color={c3}>{seg3}</Text>
      <Text color={c3}>{right}</Text>
    </Text>
  );
});

export default AnimatedBorder;
