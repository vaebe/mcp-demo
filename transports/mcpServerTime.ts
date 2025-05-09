import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

const server = new McpServer({
  name: 'mcp-server-time',
  version: '1.0.0'
})

// 获取当前时间的工具
server.tool(
  'get_current_time',
  '获取当前时间',
  {
    timezone: z.string().optional(),
  },
  async ({ timezone }) => {
    const tz = timezone || process.env.LOCAL_TIMEZONE || 'Asia/Shanghai';
    const currentTime = dayjs().tz(tz).format('YYYY-MM-DD HH:mm:ss');
    return {
      content: [{ type: "text", text: JSON.stringify({ currentTime }, null, 2) }],
    };
  }
)

// 日期时间转换工具
server.tool(
  'convert_time',
  '在时区之间转换日期时间',
  {
    source_timezone: z.string(),
    datetime: z.string().regex(/^\d{4}-\d{1,2}-\d{1,2} ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, '日期时间格式无效，应为 YYYY-MM-DD HH:mm:ss'),
    target_timezone: z.string(),
  },
  async ({ source_timezone, datetime, target_timezone }) => {
    const sourceTime = dayjs.tz(datetime, source_timezone);
    const convertedTime = sourceTime.clone().tz(target_timezone).format('YYYY-MM-DD HH:mm:ss');
    return {
      content: [{ type: "text", text: JSON.stringify({ convertedTime }, null, 2) }],
    };
  }
)


export default server
