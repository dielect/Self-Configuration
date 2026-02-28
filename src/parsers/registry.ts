import type { ProtocolParser, ProxyNode } from "./types";
import { VlessParser } from "./vlessParser";
import { YamlNodeParser } from "./yamlNodeParser";

export type DetectedInputKind = "provider-url" | "proxy-node";

export class ParserRegistry {
  constructor(private readonly parsers: ProtocolParser[]) {}

  detectKind(input: string): DetectedInputKind {
    if (/^https?:\/\//i.test(input.trim())) {
      return "provider-url";
    }
    return "proxy-node";
  }

  parseProxyNode(input: string): ProxyNode {
    const parser = this.parsers.find((item) => item.canHandle(input));
    if (!parser) {
      throw new Error("未找到可用解析器。");
    }

    return parser.parse(input);
  }
}

export function createDefaultRegistry(): ParserRegistry {
  return new ParserRegistry([new VlessParser(), new YamlNodeParser()]);
}
