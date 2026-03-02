/**
 * CLI 主题配置
 */
export const Theme = {
  colors: {
    primary: "#D97757",
    secondary: "#5C5C5C",
    success: "#2E8F66",
    error: "#B07D7D",
    warning: "#C9A052",
    text: "#E6E6E6",
    dim: "#737373",
    highlight: "#FFFFFF",
    info: "#4A9EFF",
  },
  symbols: {
    arrow: ">",
    bullet: "•",
    tick: "✓",
    cross: "✗",
    pointer: "❯",
    line: "─",
    corner: {
      topLeft: "╭",
      topRight: "╮",
      bottomLeft: "╰",
      bottomRight: "╯",
    },
    vertical: "│",
    horizontal: "─",
    spinner: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  },
  spacing: {
    small: 1,
    medium: 2,
    large: 4,
  },
} as const;

export type ThemeColors = typeof Theme.colors;
export type ThemeSymbols = typeof Theme.symbols;
