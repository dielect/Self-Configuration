import {
  addProxyToClashConfig,
  listProxyProviderNames,
  listWritableProxyGroupNames,
  updateProxyProviderUrl,
} from "../config/mutator";
import { createDefaultRegistry } from "../parsers/registry";
import { promptGroupSelection } from "../ui/groupSelector";
import { promptOutputName } from "../ui/outputNameInput";
import { promptSingleSelect } from "../ui/singleSelect";
import { promptPrimaryInput } from "../ui/vlessInput";

const BASE_CONFIG_PATH = "Clash.yaml";

function sanitizeOutputStem(value: string): string {
  const normalized = value.trim().replace(/\.ya?ml$/i, "");
  const cleaned = normalized.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
  const collapsed = cleaned.replace(/\s+/g, "_").replace(/_+/g, "_");
  return collapsed.replace(/^_+|_+$/g, "");
}

function toYamlOutputPath(stem: string): string {
  const safeStem = sanitizeOutputStem(stem);
  if (!safeStem) {
    throw new Error("输出文件名不能为空。");
  }
  return `${safeStem}.yaml`;
}

async function resolveInteractiveInput(): Promise<string> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("当前环境不支持交互输入。请在终端中运行。");
  }

  const input = await promptPrimaryInput();
  if (!input) {
    throw new Error("未提供输入，已取消。");
  }

  return input;
}

async function resolveOutputPath(): Promise<string> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("当前环境不支持交互输入。请在终端中运行。");
  }

  const entered = await promptOutputName();
  if (!entered) {
    throw new Error("已取消。");
  }

  return toYamlOutputPath(entered);
}

async function pickGroups(): Promise<string[]> {
  const writableGroupNames = await listWritableProxyGroupNames(BASE_CONFIG_PATH);

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("当前环境不支持交互输入。请在终端中运行。");
  }

  const selected = await promptGroupSelection(writableGroupNames);
  if (selected === null) {
    throw new Error("已取消。");
  }

  return selected;
}

async function handleProviderUrl(input: string, outputPath: string): Promise<string> {
  const providerNames = await listProxyProviderNames(BASE_CONFIG_PATH);
  if (providerNames.length === 0) {
    throw new Error("未找到 proxy-providers，无法写入订阅链接。");
  }

  let providerName = providerNames[0] as string;

  if (providerNames.length > 1) {
    const selected = await promptSingleSelect("请选择要更新的 proxy-provider", providerNames);
    if (!selected) {
      throw new Error("已取消。");
    }
    providerName = selected;
  }

  const result = await updateProxyProviderUrl({
    baseConfigPath: BASE_CONFIG_PATH,
    outputPath,
    providerName,
    url: input,
  });

  return `已生成 ${result.outputPath}，已更新 proxy-provider: ${result.providerName}`;
}

async function handleProxyNode(input: string, outputPath: string): Promise<string> {
  const registry = createDefaultRegistry();
  const proxy = registry.parseProxyNode(input);
  const selectedGroups = await pickGroups();

  const result = await addProxyToClashConfig({
    proxy,
    baseConfigPath: BASE_CONFIG_PATH,
    outputPath,
    targetGroupNames: selectedGroups,
    removeAllProxiesProvider: true,
  });

  return `已生成 ${result.outputPath}，新增节点: ${result.proxyName}，写入分组: ${result.attachedGroups.length} 个`;
}

export async function runWizard(): Promise<string> {
  const input = await resolveInteractiveInput();
  const outputPath = await resolveOutputPath();

  const registry = createDefaultRegistry();
  const kind = registry.detectKind(input);

  if (kind === "provider-url") {
    return handleProviderUrl(input, outputPath);
  }

  return handleProxyNode(input, outputPath);
}
