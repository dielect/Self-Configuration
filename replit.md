# self-configuration

A CLI wizard tool and web app for generating Clash proxy configuration files from VLESS/Shadowsocks proxy URLs and subscription links.

## Architecture

- **Runtime**: Bun 1.2
- **Language**: TypeScript with TSX
- **CLI**: Ink (React for terminal) - interactive TUI wizard
- **Web**: React + Vite + Tailwind CSS v4 + Framer Motion + shadcn/ui-style components
- **Server**: Hono (lightweight HTTP framework on Bun)

## Project Layout

```
src/                    # Shared core logic (CLI + Web)
  cli.tsx               - CLI entry point (Ink-based terminal app)
  config/
    mutator.ts          - Clash YAML config read/write operations
  lib/
    vless.ts            - VLESS protocol parser
    ss.ts               - Shadowsocks protocol parser
  parsers/
    registry.ts         - Parser registry (auto-detect protocol)
    ssParser.ts         - SS-specific parser
    vlessParser.ts      - VLESS-specific parser
    yamlNodeParser.ts   - YAML-based node parser
    types.ts            - Shared types
  ui/                   - CLI UI components (Ink/React terminal)
    theme.ts            - Color palette, symbols
    useAnimationTick.ts - Centralized animation tick
    Logo.tsx            - Block font ASCII logo with sunset gradient
    ScreenCard.tsx      - Card layout (no borders)
    StepLine.tsx        - Status indicators
    baseConfigInput.tsx - Base config file path input
    vlessInput.tsx      - Proxy URL/subscription input
    outputNameInput.tsx - Output filename input
    groupSelector.tsx   - Multi-select group picker
    singleSelect.tsx    - Single-select provider picker
  wizard/
    runWizard.ts        - Main CLI wizard flow

server/                 # Backend API
  index.ts              - Hono server (port 3001)
                          Endpoints: /api/parse, /api/config/groups,
                          /api/config/add-proxy, /api/config/update-provider,
                          /api/config/upload, /api/config/download

web/                    # Frontend (React + Vite)
  index.html            - HTML entry
  vite.config.ts        - Vite config (proxy /api -> :3001)
  tsconfig.json         - Web-specific TS config
  src/
    main.tsx            - React entry
    App.tsx             - Wizard state machine + step routing
    index.css           - Tailwind CSS v4 + custom theme tokens
    lib/utils.ts        - cn() utility (clsx + tailwind-merge)
    components/
      Logo.tsx          - Block font logo with Framer Motion animation
      StepIndicator.tsx - Step progress bar
      ui/               - shadcn/ui-style components
        button.tsx, input.tsx, textarea.tsx,
        checkbox.tsx, label.tsx
    pages/
      StepConfig.tsx    - Step 1: Upload/select base config
      StepInput.tsx     - Step 2: Paste proxy link or subscription URL
      StepGroups.tsx    - Step 3: Select proxy groups or provider
      StepResult.tsx    - Step 4: Success + download

index.ts               - Library exports
Clash.yaml             - Example/template Clash config
```

## Running

### CLI
```sh
bun run cli
```

### Web App
```sh
bun run dev
```
This starts the Hono API server (port 3001) and Vite dev server (port 5000) concurrently.

## Dependencies

### Core
- `yaml` - YAML parsing/serialization with comment preservation

### CLI
- `ink` + `ink-text-input` - Terminal UI rendering
- `oh-my-logo` / `cfonts` / `gradient-string` - Logo rendering

### Web
- `react` + `react-dom` - UI framework
- `vite` + `@vitejs/plugin-react` - Build tool
- `tailwindcss` v4 + `@tailwindcss/vite` - Styling
- `framer-motion` - Animations
- `hono` - Backend API server
- `lucide-react` - Icons
- `@radix-ui/*` - Accessible UI primitives
- `class-variance-authority` + `clsx` + `tailwind-merge` - Class utilities

## Design

- Dark theme (zinc-950 background)
- Primary color: `#d97757` (warm orange)
- Sunset gradient: `#ff9966` → `#ff5e62` → `#ffa34e`
- No border-based card designs - uses spacing and subtle backgrounds
- Framer Motion for step transitions and micro-interactions
