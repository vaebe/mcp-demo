import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

let client: Client | undefined = undefined
const baseUrl = new URL('http://localhost:9001/sse');

async function createStreamableHttpClient() {
  try {
    client = new Client({
      name: 'streamable-http-client',
      version: '1.0.0'
    });

    const transport = new StreamableHTTPClientTransport(baseUrl);
    await client.connect(transport);

    console.log("Connected using Streamable HTTP transport");
  } catch (error) {
    // 如果失败并出现 4xx 错误，请尝试较旧的 SSE 传输 
    
    console.log("Streamable HTTP connection failed, falling back to SSE transport");

    // todo 使用 sse client 与 server 交互
  }
}

createStreamableHttpClient()