import React, { useMemo, useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import { ScreenCard } from "./ScreenCard";
import { Theme } from "./theme";

type GroupSelectorProps = {
  groups: string[];
  onSubmit: (selected: string[]) => void;
  onCancel: () => void;
};

function GroupSelector({ groups, onSubmit, onCancel }: GroupSelectorProps) {
  const { exit } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const rows = useMemo(() => ["ALL", ...groups], [groups]);

  const allSelected = groups.length > 0 && groups.every((name) => selected.has(name));

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : rows.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => (prev < rows.length - 1 ? prev + 1 : 0));
    } else if (input === " ") {
      setSelected((prev) => {
        const next = new Set(prev);
        const current = rows[selectedIndex];

        if (current === "ALL") {
          if (allSelected) {
            next.clear();
          } else {
            for (const g of groups) {
              next.add(g);
            }
          }
          return next;
        }

        if (current && next.has(current)) {
          next.delete(current);
        } else if (current) {
          next.add(current);
        }

        return next;
      });
    } else if (key.return) {
      onSubmit([...selected]);
      exit();
    } else if (key.escape || input.toLowerCase() === "q") {
      onCancel();
      exit();
    }
  });

  const current = rows[selectedIndex] ?? "";
  const currentDesc =
    current === "ALL" ? "全选或全不选策略组" : `将节点名写入: ${current}`;

  return (
    <ScreenCard
      title="Group Selector"
      subtitle="选择要写入节点名的策略组"
      hint="↑↓ 导航 · Space 多选 · Enter 确认"
    >
      <Box flexDirection="column">
        {rows.map((row, index) => {
          const isSelected = index === selectedIndex;
          const checked = row === "ALL" ? allSelected : selected.has(row);
          const label = row === "ALL" ? "ALL" : row;

          return (
            <Box key={row}>
              <Text color={isSelected ? Theme.colors.primary : Theme.colors.dim}>
                {isSelected ? Theme.symbols.pointer : " "}{" "}
              </Text>
              <Text color={checked ? Theme.colors.success : Theme.colors.secondary}>
                {checked ? "[x]" : "[ ]"}
              </Text>
              <Text color={isSelected ? Theme.colors.highlight : Theme.colors.text} bold={isSelected}>
                {" "}{label}
              </Text>
            </Box>
          );
        })}

        <Box marginTop={1}>
          <Text color={Theme.colors.dim}>↳ {currentDesc}</Text>
        </Box>
        <Box>
          <Text color={Theme.colors.secondary}>已选 {selected.size} 项</Text>
        </Box>
      </Box>
    </ScreenCard>
  );
}

export function promptGroupSelection(groups: string[]): Promise<string[] | null> {
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
