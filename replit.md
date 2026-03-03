# self-configuration

A CLI wizard tool for generating Clash proxy configuration files from VLESS/Shadowsocks proxy URLs and subscription links.

## Architecture

- **Runtime**: Bun 1.2
- **Language**: TypeScript with TSX (React via Ink for terminal UI)
- **No web frontend** - this is a pure CLI/TUI application

## Project Layout

```
src/
  cli.tsx          - Entry point (Ink-based terminal app)
  config/
    mutator.ts     - Clash YAML config read/write operations
  lib/
    vless.ts       - VLESS protocol parser
    ss.ts          - Shadowsocks protocol parser
  parsers/
    registry.ts    - Parser registry (auto-detect protocol)
    ssParser.ts    - SS-specific parser
    vlessParser.ts - VLESS-specific parser
    yamlNodeParser.ts - YAML-based node parser
    types.ts       - Shared types
  ui/
    theme.ts           - Color palette, symbols, animation config
    useAnimationTick.ts - Centralized animation tick (single setInterval)
    Logo.tsx           - Animated gradient ASCII logo
    ScreenCard.tsx     - Card container with animated borders
    AnimatedBorder.tsx - Gradient-shifting border component
    GlowText.tsx       - Color-cycling text component
    StepLine.tsx       - Status indicators with animated spinners
    baseConfigInput.tsx - Base config file path input
    vlessInput.tsx     - Proxy URL/subscription input
    outputNameInput.tsx - Output filename input
    groupSelector.tsx  - Multi-select group picker
    singleSelect.tsx   - Single-select provider picker
  wizard/
    runWizard.ts   - Main wizard flow orchestration
index.ts           - Library exports
Clash.yaml         - Example/template Clash config
```

## Running

```sh
bun run cli
```

This launches an interactive terminal wizard that:
1. Prompts for a base Clash config path (defaults to `Clash.yaml`)
2. Accepts a VLESS/SS proxy URL or subscription provider URL
3. Prompts for an output filename
4. Generates a new Clash YAML config with the proxy added

## Dependencies

- `ink` + `ink-text-input` - Terminal UI rendering
- `react` - Required by Ink
- `yaml` - YAML parsing/serialization
