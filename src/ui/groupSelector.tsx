import React, { useMemo, useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import { Logo } from "./Logo";
import { BorderBox } from "./BorderBox";
import { Theme } from "./theme";
import { useAnimationTick, deriveFrame } from "./useAnimationTick";

type GroupSelectorProps = {
  groups: string[];
  onSubmit: (selected: string[]) => void;
  onCancel: () => void;
};

function GroupSelector({ groups, onSubmit, onCancel }: GroupSelectorProps) {
  const { exit } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const tick = useAnimationTick();
  const spinIdx = deriveFrame(tick, Theme.symbols.spinner.length, 1);
  const rows = useMemo(() => ["ALL", ...groups], [groups]);

  const allSelected =
    groups.length > 0 && groups.every((name) => selected.has(name));

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : rows.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) =>
        prev < rows.length - 1 ? prev + 1 : 0,
      );
    } else if (input === " ") {
      setSelected((prev) => {
        const next = new Set(prev);
        const current = rows[selectedIndex];
        if (current === "ALL") {
          if (allSelected) { next.clear(); }
          else { for (const g of groups) next.add(g); }
          return next;
        }
        if (current && next.has(current)) next.delete(current);
        else if (current) next.add(current);
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
    current === "ALL"
      ? "全选或全不选策略组"
      : `将节点名写入: ${current}`;

  return (
    <Box flexDirection="column" width={76}>
      <Logo />

      <BorderBox>
        <Text>
          <Text color={Theme.colors.primary}>{Theme.symbols.star} </Text>
          <Text color={Theme.colors.highlight} bold>选择策略组</Text>
        </Text>
        <Text color={Theme.colors.dim}>  选择要写入节点名的策略组</Text>
      </BorderBox>

      <Box marginTop={1} paddingLeft={1}>
        <Text color={Theme.colors.primary}>{Theme.symbols.star} </Text>
        <Text color={Theme.colors.dim}>↑↓ 导航 · Space 多选 · Enter 确认</Text>
      </Box>

      <Box marginTop={1}>
        <BorderBox>
          <Box flexDirection="column">
            {rows.map((row, index) => {
              const isSelected = index === selectedIndex;
              const checked = row === "ALL" ? allSelected : selected.has(row);
              const label = row === "ALL" ? "ALL" : row;

              return (
                <Box key={row}>
                  <Text color={isSelected ? Theme.colors.primary : Theme.colors.dimmer}>
                    {isSelected ? Theme.symbols.pointer : " "}{" "}
                  </Text>
                  <Text
                    color={checked ? Theme.colors.successBright : Theme.colors.dimmer}
                    bold={checked}
                  >
                    {checked ? Theme.symbols.circle : Theme.symbols.circleOpen}{" "}
                  </Text>
                  <Text
                    color={isSelected ? Theme.colors.highlight : Theme.colors.text}
                    bold={isSelected}
                  >
                    {label}
                  </Text>
                </Box>
              );
            })}
          </Box>
        </BorderBox>
      </Box>

      <Box marginTop={1} paddingLeft={1}>
        <Text color={Theme.colors.dim}>
          {Theme.symbols.spinner[spinIdx]} {currentDesc} · 已选 </Text>
        <Text color={selected.size > 0 ? Theme.colors.primary : Theme.colors.dimmer} bold>
          {selected.size}
        </Text>
        <Text color={Theme.colors.dim}> 项</Text>
      </Box>
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
        onSubmit={(selected) => resolve(selected)}
        onCancel={() => resolve(null)}
      />,
    );
  });
}
