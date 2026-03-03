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
  ui/              - Ink-based interactive UI components
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
