import { parseSsToClashProxy } from "../lib/ss";
import type { ProtocolParser, ProxyNode } from "./types";

export class SsParser implements ProtocolParser {
  readonly id = "ss";

  canHandle(input: string): boolean {
    return input.trim().startsWith("ss://");
  }

  parse(input: string): ProxyNode {
    return parseSsToClashProxy(input.trim()) as ProxyNode;
  }
}
