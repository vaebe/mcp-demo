#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import server from './mcpServerTime.js'

// 启动服务器
async function runServer() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('获取当前时间和时区转换的 MCP 服务器已在 stdio 上启动')
}

runServer().catch((error) => {
  console.error('启动服务器时出错:', error)
  process.exit(1)
})
