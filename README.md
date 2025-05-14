# mcp demo

## 测试 mcp

在对应目录执行 `pnpm build` 打包出 js 文件

```bash
# stdio
npx @modelcontextprotocol/inspector node mcp/githubSearch.mjs

# sse or Streamable
npx @modelcontextprotocol/inspector http://127.0.0.1
```