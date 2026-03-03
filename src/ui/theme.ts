export const Theme = {
  colors: {
    primary: "#D97757",
    accent: "#E8A87C",
    success: "#2E8F66",
    successBright: "#45C98E",
    error: "#D9A0A0",
    warning: "#C9A052",
    text: "#E6E6E6",
    dim: "#737373",
    dimmer: "#4A4A4A",
    highlight: "#FFFFFF",
    info: "#4A9EFF",
  },
  symbols: {
    star: "✳",
    bullet: "•",
    tick: "✓",
    cross: "✗",
    pointer: "❯",
    arrow: ">",
    circle: "●",
    circleOpen: "○",
    spinner: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  },
} as const;

export type ThemeColors = typeof Theme.colors;
export type ThemeSymbols = typeof Theme.symbols;
