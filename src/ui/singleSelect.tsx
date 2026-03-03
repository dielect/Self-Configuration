import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import { Logo } from "./Logo";
import { Theme } from "./theme";

type SingleSelectProps = {
  title: string;
  items: string[];
  onSubmit: (value: string) => void;
  onCancel: () => void;
};

function SingleSelect({ title, items, onSubmit, onCancel }: SingleSelectProps) {
  const { exit } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) =>
        prev < items.length - 1 ? prev + 1 : 0,
      );
    } else if (key.return) {
      const selected = items[selectedIndex];
      if (selected) {
        onSubmit(selected);
        exit();
      }
    } else if (key.escape || input.toLowerCase() === "q") {
      onCancel();
      exit();
    }
  });

  const current = items[selectedIndex] ?? "";

  return (
    <Box flexDirection="column">
      <Logo />

      <Box
        borderStyle="round"
        borderColor={Theme.colors.border}
        paddingLeft={1}
        paddingRight={1}
        flexDirection="column"
      >
        <Text>
          <Text color={Theme.colors.primary} bold>{Theme.symbols.star} </Text>
          <Text color={Theme.colors.highlight} bold>选择 Provider</Text>
        </Text>
        <Text color={Theme.colors.dim}>  {title}</Text>
      </Box>

      <Box marginTop={1} paddingLeft={1}>
        <Text color={Theme.colors.primary}>{Theme.symbols.star} </Text>
        <Text color={Theme.colors.dim}>↑↓ 导航 · Enter 确认 · q 取消</Text>
      </Box>

      <Box
        marginTop={1}
        borderStyle="round"
        borderColor={Theme.colors.border}
        paddingLeft={1}
        paddingRight={1}
        flexDirection="column"
      >
        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Box key={item}>
              <Text color={isSelected ? Theme.colors.primary : Theme.colors.dimmer}>
                {isSelected ? Theme.symbols.pointer : " "}{" "}
              </Text>
              <Text
                color={isSelected ? Theme.colors.highlight : Theme.colors.text}
                bold={isSelected}
              >
                {item}
              </Text>
            </Box>
          );
        })}
      </Box>

      <Box marginTop={1} paddingLeft={1}>
        <Text color={Theme.colors.dim}>当前: {current}</Text>
      </Box>
    </Box>
  );
}

export function promptSingleSelect(
  title: string,
  items: string[],
): Promise<string | null> {
  return new Promise((resolve) => {
    render(
      <SingleSelect
        title={title}
        items={items}
        onSubmit={(value) => resolve(value)}
        onCancel={() => resolve(null)}
      />,
    );
  });
}
