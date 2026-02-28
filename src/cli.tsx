#!/usr/bin/env bun
import React from "react";
import { render, Text } from "ink";
import { runWizard } from "./wizard/runWizard";

function print(message: string, color: "green" | "red") {
  const app = render(<Text color={color}>{message}</Text>);
  setTimeout(() => app.unmount(), 80);
}

async function main() {
  if (process.argv.length > 2) {
    print("此工具已改为全交互模式。请直接运行: bun run cli", "red");
    return;
  }

  try {
    const message = await runWizard();
    print(message, "green");
  } catch (error) {
    print(error instanceof Error ? error.message : "执行失败", "red");
  }
}

void main();
