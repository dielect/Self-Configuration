export type ClashSsProxy = {
  [key: string]: unknown;
  name: string;
  type: "ss";
  server: string;
  port: number;
  cipher: string;
  password: string;
};

function decodeURIComponentSafe(value: string | null): string {
  if (!value) {
    return "";
  }

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function decodeBase64Flexible(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding === 0 ? normalized : normalized + "=".repeat(4 - padding);

  return Buffer.from(padded, "base64").toString("utf8");
}

function parseUserInfo(userInfo: string): { cipher: string; password: string } {
  const decoded = decodeURIComponentSafe(userInfo);
  let plain = decoded;

  if (!decoded.includes(":")) {
    plain = decodeBase64Flexible(decoded);
  }

  const index = plain.indexOf(":");
  if (index <= 0) {
    throw new Error("ss 链接缺少 cipher/password 信息。");
  }

  const cipher = plain.slice(0, index).trim();
  const password = plain.slice(index + 1).trim();
  if (!cipher || !password) {
    throw new Error("ss 链接缺少 cipher/password 信息。");
  }

  return { cipher, password };
}

function parsePlugin(value: string): { plugin: string; pluginOpts?: Record<string, string> } {
  const decoded = decodeURIComponentSafe(value);
  const segments = decoded.split(";").map((item) => item.trim()).filter(Boolean);
  if (segments.length === 0) {
    throw new Error("ss 插件参数不正确。");
  }

  const plugin = segments[0] as string;
  const pluginOpts: Record<string, string> = {};

  for (const segment of segments.slice(1)) {
    const index = segment.indexOf("=");
    if (index <= 0) {
      continue;
    }
    const key = segment.slice(0, index).trim();
    const val = segment.slice(index + 1).trim();
    if (key && val) {
      pluginOpts[key] = val;
    }
  }

  return Object.keys(pluginOpts).length > 0 ? { plugin, pluginOpts } : { plugin };
}

export function parseSsToClashProxy(ssUrlRaw: string): ClashSsProxy {
  const trimmed = ssUrlRaw.trim();
  if (!trimmed.startsWith("ss://")) {
    throw new Error("输入不是有效的 ss 链接（缺少 ss:// 前缀）。");
  }

  const url = new URL(trimmed);
  const server = url.hostname;
  const port = Number(url.port);
  if (!server || Number.isNaN(port) || port <= 0) {
    throw new Error("ss 链接缺少关键字段（host / port）。");
  }

  const { cipher, password } = parseUserInfo(url.username);
  const name = decodeURIComponentSafe(url.hash.replace(/^#/, "")) || `ss-${server}`;

  const proxy: ClashSsProxy = {
    name,
    type: "ss",
    server,
    port,
    cipher,
    password,
    udp: true,
  };

  const plugin = url.searchParams.get("plugin");
  if (plugin) {
    const pluginData = parsePlugin(plugin);
    proxy.plugin = pluginData.plugin;
    if (pluginData.pluginOpts) {
      proxy["plugin-opts"] = pluginData.pluginOpts;
    }
  }

  return proxy;
}
