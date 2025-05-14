import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import server from './mcpServerTest.js'
import {addInfoLog, addWarnLog, addSuccessLog} from './utils.js'

const app = express();
app.use(express.json());

// 存储连接
const connections = new Map<string, SSEServerTransport>();

app.get('/sse', async (req, res) => {

  addSuccessLog('客户端连接参数：', req.query)

  addSuccessLog('客户端连接 headers：', req.headers)

  // 创建 sse 传输
  const transport = new SSEServerTransport('/messages', res);
  const sessionId = transport.sessionId

  addInfoLog(`新的 SSE 连接建立： ${sessionId}`)  

  // 注册连接
  connections.set(sessionId, transport);
  
  res.on("close", () => {
    connections.delete(sessionId);
    addInfoLog(`SSE 连接关闭： ${sessionId}`)  
  });
  
  // 将传输对象与MCP服务器连接
  await server.connect(transport);
  addSuccessLog(`MCP 服务器连接成功： ${sessionId}`)  
});

// 旧消息端点
app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId as string;

  addInfoLog(`messages 收到客户端消息： ${sessionId}`)  
  
  console.log('messages - query',req.query, '\r\n')
  console.log('messages - body',req.body, '\r\n')
  console.log('messages - headers',req.headers, '\r\n')

  // 获取连接
  const transport = connections.get(sessionId)
  if (transport) {
    await transport.handlePostMessage(req, res, req.body);
  } else {
    addWarnLog(`未找到活跃的 ${sessionId} 连接`) 
    res.status(400).send(`未找到活跃的 ${sessionId} 连接`);
  }
});


// 启动服务器
const port = process.env.PORT || 9001;
app.listen(port, () => {
  addSuccessLog(`MCP SSE 服务器已启动：`, `http://localhost:${port}`)
  addInfoLog('SSE 连接端点：', `http://localhost:${port}/sse`)
  addInfoLog('SSE 消息处理端点：', ` http://localhost:${port}/messages`)

  console.log('=========================== success ===========================\r\n')
});