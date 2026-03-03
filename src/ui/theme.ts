export const Theme = {
  colors: {
    primary: "#D97757",
    primaryBright: "#F0956D",
    primaryDim: "#A85A3E",
    accent: "#E8A87C",
    secondary: "#5C5C5C",
    success: "#2E8F66",
    successBright: "#45C98E",
    error: "#D9A0A0",
    errorBright: "#F0B8B8",
    warning: "#C9A052",
    text: "#E6E6E6",
    dim: "#737373",
    dimmer: "#4A4A4A",
    border: "#3A3A3A",
    highlight: "#FFFFFF",
    info: "#4A9EFF",
    muted: "#888888",
  },
  symbols: {
    star: "✳",
    bullet: "•",
    tick: "✓",
    cross: "✗",
    pointer: "❯",
    arrow: ">",
    corner: {
      topLeft: "╭",
      topRight: "╮",
      bottomLeft: "╰",
      bottomRight: "╯",
    },
    vertical: "│",
    horizontal: "─",
    circle: "●",
    circleOpen: "○",
    spinner: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  },
} as const;

export type ThemeColors = typeof Theme.colors;
export type ThemeSymbols = typeof Theme.symbols;
