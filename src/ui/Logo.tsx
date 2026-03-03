import React, { memo, useState, useEffect } from "react";
import { Box, Text } from "ink";
import cfonts from "cfonts";
import gradient from "gradient-string";

const SUNSET_COLORS = ["#ff9966", "#ff5e62", "#ffa34e"];
const CONFIG_LABEL = "c o n f i g";

function generateLogo(): string[] {
  const out = cfonts.render("self", {
    font: "block",
    colors: ["system"],
    rawMode: true,
    space: false,
    maxLength: 200,
  });
  const raw = out.string.split("\n").filter((l: string) => l.trim());
  const lastIdx = raw.length - 1;
  raw[lastIdx] = raw[lastIdx].trimEnd() + "  " + CONFIG_LABEL;
  const g = gradient(SUNSET_COLORS);
  return g.multiline(raw.join("\n")).split("\n");
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
    </Box>
  );
});

export default Logo;
