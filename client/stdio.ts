import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { addInfoLog, addErrLog, addSuccessLog } from '../utils/dist/index.js'

async function createStdioClient() {
  // 创建 client
  const client = new Client({
    name: 'stdio-client',
    version: '1.0.0',
  });

  try {
    const sseTransport = new StdioClientTransport({
      command: 'node',
      args: ['../transports/dist/stdio.js']
    });

    // 连接到 MCP 服务
    await client.connect(sseTransport);

    addSuccessLog(' MCP 服务 连接成功！')

    // 获取 工具列表
    const toolInfo = await client.listTools()

    addInfoLog('MCP 工具信息', toolInfo)

    // 调用生成文本工具
    const callToolInfo = await client.callTool({
      "name": "get_text",
      "arguments": {}
    })

    addInfoLog('get_text 返回信息', callToolInfo)
  } catch (error) {
    addErrLog('MCP 客户端错误', error);
  }
}

createStdioClient()

