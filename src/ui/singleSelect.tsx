import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import { ScreenCard } from "./ScreenCard";
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
    <ScreenCard
      title="Provider Selector"
      subtitle={title}
      hint="↑↓ 导航 · Enter 确认 · q 取消"
    >
      <Box flexDirection="column">
        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Box key={item}>
              <Text
                color={
                  isSelected ? Theme.colors.primaryBright : Theme.colors.dim
                }
              >
                {isSelected ? Theme.symbols.pointer : " "}{" "}
              </Text>
              {isSelected ? (
                <Text color={Theme.colors.glow} bold>
                  {Theme.symbols.diamond}{" "}
                </Text>
              ) : (
                <Text color={Theme.colors.dimmer}>
                  {Theme.symbols.diamondSmall}{" "}
                </Text>
              )}
              <Text
                color={
                  isSelected ? Theme.colors.primaryBright : Theme.colors.text
                }
                bold={isSelected}
              >
                {item}
              </Text>
            </Box>
          );
        })}

        <Box marginTop={1}>
          <Text color={Theme.colors.dimmer}>
            {Theme.symbols.pointerSmall}{" "}
          </Text>
          <Text color={Theme.colors.accent}>当前: {current}</Text>
        </Box>
      </Box>
    </ScreenCard>
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
        onSubmit={(value) => {
          resolve(value);
        }}
        onCancel={() => {
          resolve(null);
        }}
      />,
    );
  });
}
