import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

let client: Client | undefined = undefined
const baseUrl = new URL('http://localhost:9001/sse');

 async function createSseClient() {
  client = new Client({
    name: 'sse-client',
    version: '1.0.0',
  });

  const sseTransport = new SSEClientTransport(baseUrl, {
    requestInit: {
      headers: {
        // 这里的参数可以在 messages req.headers 中获取
        'X-Custom-Param': 'custom_value'
      },
      body: JSON.stringify({ 'test': 'add' })
    }
  });

  await client.connect(sseTransport);


  // 获取 工具列表
  const tools = await client.listTools()

  console.log(tools)

  // 调用工具
  const info = await client.callTool({
    "name": "get_current_time",
    "arguments": {}
  })

  console.log(info)

  console.log("Connected using SSE transport");
}

createSseClient()


