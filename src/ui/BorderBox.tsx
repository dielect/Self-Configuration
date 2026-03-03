import React from "react";
import { Box, Text } from "ink";
import { Theme } from "./theme";

type BorderBoxProps = {
  children: React.ReactNode;
  width?: number;
};

function hLine(w: number): string {
  return Theme.symbols.horizontal.repeat(Math.max(2, w));
}

export function BorderBox({ children, width = 70 }: BorderBoxProps) {
  const line = hLine(width);
  const top = `${Theme.symbols.corner.topLeft}${line}${Theme.symbols.corner.topRight}`;
  const bottom = `${Theme.symbols.corner.bottomLeft}${line}${Theme.symbols.corner.bottomRight}`;

  return (
    <Box flexDirection="column">
      <Text color={Theme.colors.border}>{top}</Text>
      {React.Children.map(children, (child) => (
        <Box>
          <Text color={Theme.colors.border}>{Theme.symbols.vertical} </Text>
          <Box flexGrow={1}>{child}</Box>
        </Box>
      ))}
      <Text color={Theme.colors.border}>{bottom}</Text>
    </Box>
  );
}
