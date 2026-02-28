export type ProxyNode = Record<string, unknown>;

export interface ProtocolParser {
  readonly id: string;
  canHandle(input: string): boolean;
  parse(input: string): ProxyNode;
}
