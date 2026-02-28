import { parse as parseYaml } from "yaml";
import type { ProtocolParser, ProxyNode } from "./types";

export class YamlNodeParser implements ProtocolParser {
  readonly id = "yaml-node";

  canHandle(_input: string): boolean {
    return true;
  }

  parse(input: string): ProxyNode {
    let parsed: unknown;

    try {
      parsed = parseYaml(input.trim());
    } catch {
      throw new Error("节点输入格式不正确，支持 vless:// 或 YAML/JSON 单节点对象。");
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("节点输入必须是单个对象。");
    }

    const node = parsed as Record<string, unknown>;

    if (typeof node.name !== "string" || !node.name.trim()) {
      throw new Error("节点缺少 name 字段。");
    }

    if (typeof node.type !== "string" || !node.type.trim()) {
      throw new Error("节点缺少 type 字段。");
    }

    if (typeof node.server !== "string" || !node.server.trim()) {
      throw new Error("节点缺少 server 字段。");
    }

    const portRaw = node.port;
    if (typeof portRaw === "string") {
      const port = Number(portRaw);
      if (Number.isNaN(port)) {
        throw new Error("节点 port 字段不是有效数字。");
      }
      node.port = port;
    }

    if (typeof node.port !== "number") {
      throw new Error("节点缺少 port 字段。");
    }

    return node;
  }
}
