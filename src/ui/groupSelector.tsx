import React, { useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";

type GroupSelectorProps = {
  groups: string[];
  onSubmit: (selected: string[]) => void;
  onCancel: () => void;
};

function GroupSelector({ groups, onSubmit, onCancel }: GroupSelectorProps) {
  const { exit } = useApp();
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const rows = ["ALL", ...groups];

  const allSelected =
    groups.length > 0 && groups.every((name) => selected.has(name));

  useInput((input, key) => {
    if (key.upArrow) {
      setCursor((prev) => (prev - 1 + rows.length) % rows.length);
      return;
    }

    if (key.downArrow) {
      setCursor((prev) => (prev + 1) % rows.length);
      return;
    }

    if (input === " ") {
      setSelected((prev) => {
        const next = new Set(prev);
        const currentRow = rows[cursor];

        if (currentRow === "ALL") {
          if (allSelected) {
            next.clear();
          } else {
            for (const name of groups) {
              next.add(name);
            }
          }

          return next;
        }

        if (currentRow && next.has(currentRow)) {
          next.delete(currentRow);
        } else if (currentRow) {
          next.add(currentRow);
        }

        return next;
      });
      return;
    }

    if (key.return) {
      onSubmit([...selected]);
      exit();
      return;
    }

    if (key.escape || input.toLowerCase() === "q") {
      onCancel();
      exit();
    }
  });

  return (
    <Box flexDirection="column">
      <Text>
        请选择要写入节点名的策略组（↑/↓移动，空格多选，回车确认，q退出）
      </Text>
      {rows.map((row, index) => {
        const checked = row === "ALL" ? allSelected : selected.has(row);
        const marker = index === cursor ? "›" : " ";
        const label = row === "ALL" ? "[ALL] 全选/全不选" : row;

        return (
          <Text key={row} color={index === cursor ? "cyan" : undefined}>
            {marker} [{checked ? "x" : " "}] {label}
          </Text>
        );
      })}
      <Text color="gray">当前已选 {selected.size} 项</Text>
    </Box>
  );
}

export function promptGroupSelection(
  groups: string[],
): Promise<string[] | null> {
  return new Promise((resolve) => {
    render(
      <GroupSelector
        groups={groups}
        onSubmit={(selected) => {
          resolve(selected);
        }}
        onCancel={() => {
          resolve(null);
        }}
      />,
    );
  });
}
