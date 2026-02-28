import { promises as fs } from "node:fs";
import { parseDocument, YAMLMap, YAMLSeq } from "yaml";

export type ProxyNode = Record<string, unknown>;

export type AddProxyOptions = {
  proxy: ProxyNode;
  baseConfigPath: string;
  outputPath: string;
  targetGroupNames?: string[];
  removeAllProxiesProvider?: boolean;
};

export type AddProxyResult = {
  outputPath: string;
  proxyName: string;
  attachedGroups: string[];
};

export type UpdateProviderUrlOptions = {
  baseConfigPath: string;
  outputPath: string;
  providerName: string;
  url: string;
};

export type UpdateProviderUrlResult = {
  outputPath: string;
  providerName: string;
};

function readNameFromProxy(proxy: ProxyNode): string {
  const name = proxy.name;
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("节点缺少 name 字段。");
  }
  return name.trim();
}

function ensureProxiesSeq(doc: ReturnType<typeof parseDocument>): YAMLSeq {
  const proxiesNode = doc.get("proxies", true);
  if (proxiesNode instanceof YAMLSeq) {
    proxiesNode.flow = false;
    return proxiesNode;
  }

  const created = doc.createNode([]) as YAMLSeq;
  created.flow = false;
  doc.set("proxies", created);
  return created;
}

function getWritableProxyGroups(
  doc: ReturnType<typeof parseDocument>,
): Array<{ name: string; proxiesNode: YAMLSeq }> {
  const proxyGroupsNode = doc.get("proxy-groups", true);
  if (!(proxyGroupsNode instanceof YAMLSeq)) {
    return [];
  }

  const writableGroups: Array<{ name: string; proxiesNode: YAMLSeq }> = [];

  for (const item of proxyGroupsNode.items) {
    if (!(item instanceof YAMLMap)) {
      continue;
    }

    const nameNode = item.get("name", true);
    const proxiesNode = item.get("proxies", true);

    const groupName =
      typeof nameNode?.toJSON === "function" ? nameNode.toJSON() : undefined;

    if (typeof groupName !== "string" || !(proxiesNode instanceof YAMLSeq)) {
      continue;
    }

    proxiesNode.flow = false;
    writableGroups.push({ name: groupName, proxiesNode });
  }

  return writableGroups;
}

function listProxyProvidersFromDoc(doc: ReturnType<typeof parseDocument>): string[] {
  const providersNode = doc.get("proxy-providers", true);
  if (!(providersNode instanceof YAMLMap)) {
    return [];
  }

  const names: string[] = [];

  for (const item of providersNode.items) {
    const name =
      typeof item.key?.toJSON === "function" ? item.key.toJSON() : undefined;
    const value = item.value;

    if (typeof name !== "string" || !(value instanceof YAMLMap)) {
      continue;
    }

    names.push(name);
  }

  return names;
}

function removeProviderUseRefsFromGroups(
  doc: ReturnType<typeof parseDocument>,
  providerName: string,
) {
  const proxyGroupsNode = doc.get("proxy-groups", true);
  if (!(proxyGroupsNode instanceof YAMLSeq)) {
    return;
  }

  for (const item of proxyGroupsNode.items) {
    if (!(item instanceof YAMLMap)) {
      continue;
    }

    const useNode = item.get("use", true);
    if (!(useNode instanceof YAMLSeq)) {
      continue;
    }

    const names = (useNode.toJSON() as Array<string | unknown>).filter(
      (value): value is string => typeof value === "string",
    );

    const remained = names.filter((name) => name !== providerName);
    if (remained.length === 0) {
      item.delete("use");

      const proxiesNode = item.get("proxies", true);
      if (!(proxiesNode instanceof YAMLSeq)) {
        const fallbackProxies = doc.createNode(["🚀 手动切换"]) as YAMLSeq;
        fallbackProxies.flow = false;
        item.set("proxies", fallbackProxies);
      }

      if (item.has("filter")) {
        item.delete("filter");
      }
      continue;
    }

    useNode.items = remained.map((name) => doc.createNode(name));
    useNode.flow = false;
  }
}

function removeProxyProvider(doc: ReturnType<typeof parseDocument>, providerName: string) {
  const providersNode = doc.get("proxy-providers", true);
  if (!(providersNode instanceof YAMLMap)) {
    return;
  }

  providersNode.delete(providerName);

  if (providersNode.items.length === 0) {
    doc.delete("proxy-providers");
  }
}

function attachProxyToGroups(
  doc: ReturnType<typeof parseDocument>,
  proxyName: string,
  targetGroupNames: string[],
): string[] {
  if (targetGroupNames.length === 0) {
    return [];
  }

  const writableGroups = getWritableProxyGroups(doc);
  const writableNameSet = new Set(writableGroups.map((group) => group.name));
  const notFound = targetGroupNames.filter((name) => !writableNameSet.has(name));

  if (notFound.length > 0) {
    throw new Error(`分组不存在或不可写: ${notFound.join(", ")}`);
  }

  const selected = new Set(targetGroupNames);

  for (const group of writableGroups) {
    if (!selected.has(group.name)) {
      continue;
    }

    const current = group.proxiesNode.toJSON() as Array<string | unknown>;
    if (!current.includes(proxyName)) {
      group.proxiesNode.add(proxyName);
    }
  }

  return targetGroupNames;
}

async function loadDoc(baseConfigPath: string) {
  const baseConfigRaw = await fs.readFile(baseConfigPath, "utf8");
  const doc = parseDocument(baseConfigRaw);

  if (doc.errors.length > 0) {
    throw new Error(`基础配置文件 YAML 解析失败: ${doc.errors[0]}`);
  }

  return doc;
}

export async function listWritableProxyGroupNames(baseConfigPath: string): Promise<string[]> {
  const doc = await loadDoc(baseConfigPath);
  return getWritableProxyGroups(doc).map((group) => group.name);
}

export async function listProxyProviderNames(baseConfigPath: string): Promise<string[]> {
  const doc = await loadDoc(baseConfigPath);
  return listProxyProvidersFromDoc(doc);
}

export async function addProxyToClashConfig(options: AddProxyOptions): Promise<AddProxyResult> {
  const doc = await loadDoc(options.baseConfigPath);

  const proxyName = readNameFromProxy(options.proxy);
  const proxiesSeq = ensureProxiesSeq(doc);
  const proxies = proxiesSeq.toJSON() as Array<Record<string, unknown>>;

  const duplicated = proxies.some((item) => {
    return (
      item.name === proxyName ||
      (item.server === options.proxy.server &&
        item.port === options.proxy.port &&
        item.uuid === options.proxy.uuid)
    );
  });

  if (duplicated) {
    throw new Error(`发现重复节点: ${proxyName}`);
  }

  proxiesSeq.add(options.proxy);

  if (options.removeAllProxiesProvider) {
    removeProxyProvider(doc, "all-proxies");
    removeProviderUseRefsFromGroups(doc, "all-proxies");
  }

  const attachedGroups = attachProxyToGroups(
    doc,
    proxyName,
    options.targetGroupNames ?? [],
  );

  await fs.writeFile(options.outputPath, String(doc), "utf8");

  return {
    outputPath: options.outputPath,
    proxyName,
    attachedGroups,
  };
}

export async function updateProxyProviderUrl(
  options: UpdateProviderUrlOptions,
): Promise<UpdateProviderUrlResult> {
  const doc = await loadDoc(options.baseConfigPath);

  const providerNames = listProxyProvidersFromDoc(doc);
  if (!providerNames.includes(options.providerName)) {
    throw new Error(`proxy-provider 不存在: ${options.providerName}`);
  }

  doc.setIn(["proxy-providers", options.providerName, "url"], options.url);
  await fs.writeFile(options.outputPath, String(doc), "utf8");

  return {
    outputPath: options.outputPath,
    providerName: options.providerName,
  };
}
