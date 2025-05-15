import express from "express";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js"
import server from './mcpServerTest.js'
import { addInfoLog, addSuccessLog } from '../utils/dist/index.js'
import pc from 'picocolors'

const app = express();
app.use(express.json());

/**
 * POST 请求：创建新的传输实例并保存到 transports 映射（以 sessionId 为键）。
 * GET 请求（SSE）：通过已保存的传输实例推送数据流到客户端。
 * DELETE 请求：通过已保存的传输实例终止会话，断开连接。
 */

// 保存 会话 id 到 传输实例的映射 
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Handle POST requests for client-to-server communication
app.post('/mcp', async (req, res) => {
  // Check for existing session ID
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // 如果传输实例已经存在则直接使用
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // isInitializeRequest 判断 是否是一个合法的 mcp 的请求
    // 创建一个新的传输实例
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // 通过会话 id 保存传输实例
        transports[sessionId] = transport;
        addInfoLog(`创建传输实例成功 ${sessionId}`)
      }
    });

    // 接收到 DELETE 请求关闭连接
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };

    await server.connect(transport);
    addSuccessLog(`MCP 服务器连接成功: ${sessionId}`)
  } else {
    // 无效的请求
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: '错误请求：未提供有效的会话 ID',
      },
      id: null,
    });
    return;
  }

  // 处理请求 这里 根据 get、delete 做对应的处理
  // 如果请求是 GET，通常会被解释为服务器推送通知（SSE）。
  // 如果请求是 DELETE，通常会被解释为终止会话（断开连接）。
  await transport.handleRequest(req, res, req.body);
});

// 处理 get 和 delete 请求
async function handleSessionRequest(req: express.Request, res: express.Response) {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('会话 ID 无效或缺失');
    return;
  }

  // 获取传输实例执行对应的的操作
  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
}

// 通过 SSE 处理服务器到客户端通知的 GET 请求
app.get('/mcp', handleSessionRequest);

// 处理会话终止的 DELETE 请求
app.delete('/mcp', handleSessionRequest);



// 启动服务器
const port = process.env.PORT || 9002;
app.listen(port, () => {
  addSuccessLog(`MCP Streamable 服务器已启动: ${pc.green(`http://localhost:${port}`)}`)

  console.log('=========================== success ===========================\r\n')
});