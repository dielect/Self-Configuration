export type ClashProxy = {
  [key: string]: unknown;
  name: string;
  type: "vless";
  server: string;
  port: number;
  uuid: string;
};

function decodeSegment(value: string | null): string {
  if (!value) {
    return "";
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function parseVlessToClashProxy(vlessUrlRaw: string): ClashProxy {
  const trimmed = vlessUrlRaw.trim();

  if (!trimmed.startsWith("vless://")) {
    throw new Error("输入不是有效的 vless 链接（缺少 vless:// 前缀）。");
  }

  const url = new URL(trimmed);
  const uuid = decodeSegment(url.username);
  const server = url.hostname;
  const port = Number(url.port || "443");

  if (!uuid || !server || Number.isNaN(port)) {
    throw new Error("vless 链接缺少关键字段（uuid / host / port）。");
  }

  const nodeName = decodeSegment(url.hash.replace(/^#/, "")) || `vless-${server}`;
  const network = (url.searchParams.get("type") || "tcp").toLowerCase();
  const security = (url.searchParams.get("security") || "none").toLowerCase();

  const proxy: ClashProxy = {
    name: nodeName,
    type: "vless",
    server,
    port,
    uuid,
    udp: true,
  };

  const flow = url.searchParams.get("flow");
  if (flow) {
    proxy.flow = flow;
  }

  if (network !== "tcp") {
    proxy.network = network;
  }

  const sni = url.searchParams.get("sni") || url.searchParams.get("servername");
  if (sni) {
    proxy.servername = decodeSegment(sni);
  }

  const alpn = url.searchParams.get("alpn");
  if (alpn) {
    proxy.alpn = alpn.split(",").map((value) => value.trim()).filter(Boolean);
  }

  const clientFingerprint = url.searchParams.get("fp");
  if (clientFingerprint) {
    proxy["client-fingerprint"] = clientFingerprint;
  }

  if (security === "tls" || security === "reality") {
    proxy.tls = true;
  }

  if (security === "reality") {
    const realityOptions: Record<string, string> = {};
    const publicKey = url.searchParams.get("pbk");
    const shortId = url.searchParams.get("sid");
    const spiderX = url.searchParams.get("spx");

    if (publicKey) {
      realityOptions["public-key"] = publicKey;
    }

    if (shortId) {
      realityOptions["short-id"] = shortId;
    }

    if (spiderX) {
      realityOptions["spider-x"] = decodeSegment(spiderX);
    }

    if (Object.keys(realityOptions).length > 0) {
      proxy["reality-opts"] = realityOptions;
    }
  }

  if (network === "ws") {
    const wsPath = decodeSegment(url.searchParams.get("path")) || "/";
    const wsHost = decodeSegment(url.searchParams.get("host"));

    const wsOptions: Record<string, unknown> = {
      path: wsPath,
    };

    if (wsHost) {
      wsOptions.headers = { Host: wsHost };
    }

    proxy["ws-opts"] = wsOptions;
  }

  if (network === "grpc") {
    const grpcOptions: Record<string, string> = {};
    const serviceName = decodeSegment(url.searchParams.get("serviceName"));
    const mode = decodeSegment(url.searchParams.get("mode"));

    if (serviceName) {
      grpcOptions["grpc-service-name"] = serviceName;
    }

    if (mode) {
      grpcOptions["grpc-mode"] = mode;
    }

    if (Object.keys(grpcOptions).length > 0) {
      proxy["grpc-opts"] = grpcOptions;
    }
  }

  return proxy;
}
