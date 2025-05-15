import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { addInfoLog, addErrLog, addSuccessLog } from './utils.js'

let client: Client | undefined = undefined
const baseUrl = new URL('http://localhost:9001/sse');

async function createSseClient() {
  client = new Client({
    name: 'sse-client',
    version: '1.0.0',
  });

  try {
    const sseTransport = new SSEClientTransport(baseUrl, {
      requestInit: {
        headers: {
          // 这里的参数可以在 messages req.headers 中获取
          'X-Custom-Param': 'custom_value'
        },
      }
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

  // 关闭连接
  // client.close()
}

createSseClient()


