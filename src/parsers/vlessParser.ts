import { parseVlessToClashProxy } from "../lib/vless";
import type { ProtocolParser, ProxyNode } from "./types";

export class VlessParser implements ProtocolParser {
  readonly id = "vless";

  canHandle(input: string): boolean {
    return input.trim().startsWith("vless://");
  }

  parse(input: string): ProxyNode {
    return parseVlessToClashProxy(input.trim()) as ProxyNode;
  }
}
