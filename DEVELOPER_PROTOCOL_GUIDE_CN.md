# Self-Configuration 协议接入开发文档

本文档面向二次开发者，说明如何在当前全交互 CLI 架构中接入新的代理协议（如 `vmess`、`socks5`）。

## 1. 当前架构

核心目录：

- `src/parsers/`：协议解析层（输入字符串 -> Clash 节点对象）
- `src/config/mutator.ts`：配置改写层（写入 `proxies` / `proxy-providers` / 分组）
- `src/wizard/runWizard.ts`：交互流程编排
- `src/ui/`：交互组件（输入框、选择器）
- `src/cli.tsx`：CLI 入口（只调用 `runWizard`）

调用链：

1. 用户在界面输入内容（订阅链接 / 节点）
2. `ParserRegistry` 判断输入类型
3. 如果是节点，路由到具体协议 parser
4. `mutator` 把节点写入新 YAML 并处理分组/provider 清理

## 2. 协议接入最小步骤

以新增 `vmess` 为例。

### 步骤 1：新增 parser 文件

新建 `src/parsers/vmessParser.ts`，实现 `ProtocolParser` 接口。

接口定义在：`src/parsers/types.ts`

```ts
export interface ProtocolParser {
  readonly id: string;
  canHandle(input: string): boolean;
  parse(input: string): ProxyNode;
}
```

要求：

- `canHandle` 只负责识别本协议输入
- `parse` 负责校验并返回 Clash 可写入节点对象（必须包含 `name/type/server/port` 等关键字段）
- 抛错信息用中文，便于终端直接提示

### 步骤 2：注册到 parser registry

修改 `src/parsers/registry.ts`，把新 parser 加入 `createDefaultRegistry()`：

```ts
return new ParserRegistry([
  new VlessParser(),
  new VmessParser(),
  new YamlNodeParser(),
]);
```

注意顺序：

- 专用 parser 放前面
- `YamlNodeParser` 保持最后（它是兜底 parser）

### 步骤 3：无需改 CLI 主流程

协议接入后，`runWizard()` 会自动通过 registry 调用新 parser。

通常不需要改：

- `src/cli.tsx`
- `src/wizard/runWizard.ts`

除非你要新增交互步骤（例如协议专属参数确认）。

## 3. Clash 节点对象规范

`mutator` 层会做基础校验与去重，协议 parser 需要尽量输出标准 Clash 结构。

最低推荐字段：

- `name: string`
- `type: string`
- `server: string`
- `port: number`

按协议补充：

- `vmess`: `uuid`, `alterId`, `cipher`, `network`, `tls`, `ws-opts`...
- `socks5`: `username`, `password`, `udp`

## 4. provider 与本地节点模式

当前策略：

- 输入 `https://...`：按订阅链接处理，更新 `proxy-providers`
- 输入节点（vless/yaml/...）：写入 `proxies`，并自动清理 `all-proxies` 及其 `use` 引用

该逻辑在 `src/config/mutator.ts`，新增协议通常不需要改这部分。

## 5. 二次开发常见扩展点

### 5.1 增加协议专属交互

位置：`src/wizard/runWizard.ts`

建议方式：

1. 在识别到某协议后，进入协议专属 UI 步骤
2. 组合用户输入后再喂给 parser 或直接构造节点

### 5.2 支持批量导入

建议在 wizard 新增“多行输入/文件导入”步骤，然后循环调用：

- `registry.parseProxyNode()`
- `addProxyToClashConfig()`

注意去重报错策略（失败即中断 or 收集错误后继续）。

### 5.3 调整输出命名规则

目前规则在 `runWizard.ts`：用户输入名称 -> 固定生成 `名称.yaml`。

## 6. 开发检查清单

每次新增协议后至少检查：

1. 识别正确：`canHandle` 命中该协议输入
2. 解析正确：关键字段存在且类型正确
3. 生成正确：节点写入 `proxies`
4. 分组正确：选择的 `proxy-groups[].proxies` 被写入节点名
5. provider 逻辑正确：本地节点模式下无 `all-proxies` 残留
6. 编译通过：`bun run check`

## 7. 参考模板（可复制）

```ts
// src/parsers/exampleParser.ts
import type { ProtocolParser, ProxyNode } from "./types";

export class ExampleParser implements ProtocolParser {
  readonly id = "example";

  canHandle(input: string): boolean {
    return input.trim().startsWith("example://");
  }

  parse(input: string): ProxyNode {
    const raw = input.trim();
    // TODO: 解析 raw

    return {
      name: "example-node",
      type: "example",
      server: "127.0.0.1",
      port: 1234,
    };
  }
}
```

## 8. 建议的提交粒度

建议一个协议一个提交，最小包含：

1. parser 文件
2. registry 注册
3. 必要测试或手工验证记录
4. 文档更新（本文件追加支持协议列表）

---

如果你准备先接入 `vmess`，建议下一步先实现：

1. `src/parsers/vmessParser.ts`
2. registry 注册
3. 用一个真实 `vmess://` 链接跑通全流程
