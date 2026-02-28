# Self-Configuration CLI

面向 Clash 配置的全交互生成工具。

本项目基于 `bun + ink`，通过终端交互完成：

- 输入订阅链接或节点
- 选择分组 / provider
- 生成新的 `.yaml` 配置文件

不会修改基础模板 `Clash.yaml`。

## 功能概览

- 全交互入口：只需要运行 `bun run cli`
- 输入自动识别：
  - `https://...` -> 订阅源模式（更新 `proxy-providers`）
  - `vless://...` / YAML / JSON 节点 -> 本地节点模式（写入 `proxies`）
- 分组多选：上下键移动、空格多选、回车确认、`ALL` 全选
- 输出命名：用户输入名称，固定生成 `名称.yaml`
- 本地节点模式自动清理：
  - 移除 `all-proxies`
  - 移除 `use: [all-proxies]`
  - 为失去 `use` 且没有 `proxies` 的分组自动补 `proxies: [🚀 手动切换]`

## 环境要求

- Bun `>= 1.3.0`

## 快速开始

```bash
bun install
bun run cli
```

启动后按界面提示操作即可。

## 交互流程

1. 输入内容（订阅链接 / 节点）
2. 输入输出文件名（不带扩展名）
3. 根据输入类型自动分流：
   - 订阅链接：选择要更新的 `proxy-provider`（有多个时）
   - 节点：选择要写入的 `proxy-groups`
4. 生成 `名称.yaml`

## 项目结构

```text
src/
├── cli.tsx                  # CLI 入口（全交互）
├── wizard/
│   └── runWizard.ts         # 交互流程编排
├── parsers/                 # 协议解析层（可扩展）
│   ├── types.ts
│   ├── registry.ts
│   ├── vlessParser.ts
│   └── yamlNodeParser.ts
├── config/
│   └── mutator.ts           # Clash YAML 改写层
└── ui/                      # Ink 交互组件
    ├── vlessInput.tsx
    ├── outputNameInput.tsx
    ├── groupSelector.tsx
    └── singleSelect.tsx
```

## 开发命令

```bash
bun run check
```

## 协议扩展开发

当前已支持：

- vless 链接
- YAML/JSON 单节点

后续接入 `vmess` / `socks5` / `tor` 时，建议按 parser 插件方式扩展。

请参考：

- [DEVELOPER_PROTOCOL_GUIDE_CN.md](./DEVELOPER_PROTOCOL_GUIDE_CN.md)

## 设计原则

- 基础模板只读：`Clash.yaml` 永不直接改写
- 输出文件可追溯：每次生成独立文件
- 解析与改写解耦：协议解析层与配置写入层分离，便于扩展与测试

## 常见问题

### 1. 为什么我只输入本地节点，生成文件里没有 `all-proxies`？

这是预期行为。本地节点模式会自动移除 provider 依赖，避免无效引用。

### 2. 可以不使用交互参数吗？

当前版本是纯全交互设计，不再支持命令行参数式流程。

### 3. 会覆盖原始配置吗？

不会。只会生成新的 `*.yaml` 文件。
