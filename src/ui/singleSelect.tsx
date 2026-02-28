import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";

type SingleSelectProps = {
  title: string;
  items: string[];
  onSubmit: (value: string) => void;
  onCancel: () => void;
};

function SingleSelect({ title, items, onSubmit, onCancel }: SingleSelectProps) {
  const { exit } = useApp();
  const [cursor, setCursor] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setCursor((prev) => (prev - 1 + items.length) % items.length);
      return;
    }

    if (key.downArrow) {
      setCursor((prev) => (prev + 1) % items.length);
      return;
    }

    if (key.return) {
      const selected = items[cursor];
      if (selected) {
        onSubmit(selected);
        exit();
      }
      return;
    }

    if (key.escape || input.toLowerCase() === "q") {
      onCancel();
      exit();
    }
  });

  return (
    <Box flexDirection="column">
      <Text>{title}</Text>
      {items.map((item, index) => {
        const marker = index === cursor ? "›" : " ";
        return (
          <Text key={item} color={index === cursor ? "cyan" : undefined}>
            {marker} {item}
          </Text>
        );
      })}
      <Text color="gray">↑/↓ 选择，回车确认，q/ESC 取消</Text>
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
