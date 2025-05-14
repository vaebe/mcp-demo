import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

let client: Client | undefined = undefined
const baseUrl = new URL('http://localhost:9001/sse');

async function sseClient() {
  client = new Client({
    name: 'sse-client',
    version: '1.0.0',

  });

  const sseTransport = new SSEClientTransport(baseUrl);

  await client.connect(sseTransport);
  console.log("Connected using SSE transport");
}

async function streamableHttpClient() {
  try {
    client = new Client({
      name: 'streamable-http-client',
      version: '1.0.0'
    });
    const transport = new StreamableHTTPClientTransport(baseUrl);
    await client.connect(transport);

    console.log("Connected using Streamable HTTP transport");
  } catch (error) {
    // If that fails with a 4xx error, try the older SSE transport
    console.log("Streamable HTTP connection failed, falling back to SSE transport");
    sseClient()
  }
}

sseClient()
