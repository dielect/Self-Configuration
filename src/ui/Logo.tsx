import React, { memo, useState, useEffect } from "react";
import { Box, Text } from "ink";
import cfonts from "cfonts";
import gradient from "gradient-string";

const SUNSET_COLORS = ["#ff9966", "#ff5e62", "#ffa34e"];

function generateLogo(): string[] {
  const out = cfonts.render("self", {
    font: "block",
    colors: ["system"],
    rawMode: true,
    space: false,
    maxLength: 200,
  });
  const g = gradient(SUNSET_COLORS);
  const lines = out.string.split("\n").filter((l: string) => l.trim());
  const colored = g.multiline(lines.join("\n"));
  return colored.split("\n");
}

export const Logo = memo(function Logo() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    setLines(generateLogo());
  }, []);

  if (lines.length === 0) return null;

  return (
    <Box flexDirection="column" marginBottom={1}>
      {lines.map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
      <Text color="#ff7a59" dimColor>{"  c o n f i g"}</Text>
    </Box>
  );
});

export default Logo;
