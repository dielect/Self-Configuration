import { Hono } from "hono";
import { cors } from "hono/cors";
import { createDefaultRegistry } from "../src/parsers/registry";
import {
  listWritableProxyGroupNames,
  listProxyProviderNames,
  addProxyToClashConfig,
  updateProxyProviderUrl,
} from "../src/config/mutator";
import { promises as fs } from "node:fs";
import path from "node:path";

const app = new Hono();
app.use("*", cors());

const registry = createDefaultRegistry();
const UPLOAD_DIR = path.resolve(".uploads");

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function resolveUploadPath(filename: string): string {
  const safe = sanitizeFilename(path.basename(filename));
  const resolved = path.resolve(UPLOAD_DIR, safe);
  if (!resolved.startsWith(UPLOAD_DIR)) {
    throw new Error("非法路径");
  }
  return resolved;
}

app.post("/api/parse", async (c) => {
  try {
    const { input } = await c.req.json<{ input: string }>();
    if (!input?.trim()) {
      return c.json({ error: "输入不能为空" }, 400);
    }

    const kind = registry.detectKind(input.trim());

    if (kind === "proxy-node") {
      const proxy = registry.parseProxyNode(input.trim());
      return c.json({ kind, proxy });
    }

    return c.json({ kind, url: input.trim() });
  } catch (e: any) {
    return c.json({ error: e.message ?? "解析失败" }, 400);
  }
});

app.post("/api/config/groups", async (c) => {
  try {
    const { configFile } = await c.req.json<{ configFile: string }>();
    const resolved = resolveUploadPath(configFile);
    await fs.access(resolved);
    const groups = await listWritableProxyGroupNames(resolved);
    const providers = await listProxyProviderNames(resolved);
    return c.json({ groups, providers });
  } catch (e: any) {
    return c.json({ error: e.message ?? "读取配置失败" }, 400);
  }
});

app.post("/api/config/add-proxy", async (c) => {
  try {
    const body = await c.req.json<{
      configFile: string;
      outputName: string;
      proxy: Record<string, unknown>;
      targetGroupNames?: string[];
      removeAllProxiesProvider?: boolean;
    }>();

    if (!body.proxy) {
      return c.json({ error: "缺少节点数据" }, 400);
    }

    const basePath = resolveUploadPath(body.configFile);
    const outputPath = resolveUploadPath(body.outputName || "output.yaml");

    const result = await addProxyToClashConfig({
      proxy: body.proxy,
      baseConfigPath: basePath,
      outputPath,
      targetGroupNames: body.targetGroupNames,
      removeAllProxiesProvider: body.removeAllProxiesProvider,
    });
    return c.json(result);
  } catch (e: any) {
    return c.json({ error: e.message ?? "写入失败" }, 400);
  }
});

app.post("/api/config/update-provider", async (c) => {
  try {
    const body = await c.req.json<{
      configFile: string;
      outputName: string;
      providerName: string;
      url: string;
    }>();

    const basePath = resolveUploadPath(body.configFile);
    const outputPath = resolveUploadPath(body.outputName || "output.yaml");

    const result = await updateProxyProviderUrl({
      baseConfigPath: basePath,
      outputPath,
      providerName: body.providerName,
      url: body.url,
    });
    return c.json(result);
  } catch (e: any) {
    return c.json({ error: e.message ?? "更新失败" }, 400);
  }
});

app.post("/api/config/upload", async (c) => {
  try {
    await ensureUploadDir();
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return c.json({ error: "未收到文件" }, 400);
    }
    const content = await file.text();
    const safeName = sanitizeFilename(file.name);
    const filePath = resolveUploadPath(safeName);
    await fs.writeFile(filePath, content, "utf8");
    return c.json({ file: safeName, name: file.name });
  } catch (e: any) {
    return c.json({ error: e.message ?? "上传失败" }, 400);
  }
});

app.post("/api/config/download", async (c) => {
  try {
    const { outputName } = await c.req.json<{ outputName: string }>();
    const resolved = resolveUploadPath(outputName);
    const content = await fs.readFile(resolved, "utf8");
    return new Response(content, {
      headers: {
        "Content-Type": "application/x-yaml",
        "Content-Disposition": `attachment; filename="${sanitizeFilename(outputName)}"`,
      },
    });
  } catch (e: any) {
    return c.json({ error: e.message ?? "下载失败" }, 400);
  }
});

const port = 3001;
console.log(`API server running on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
