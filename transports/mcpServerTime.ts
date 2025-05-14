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

// 获取当前时间的工具
server.tool(
  'get_text',
  '返回测试文本',
  {},
  async () => {
    const text = '在这个充满变化的时代，每一天都带来了新的机遇与挑战。科技的发展不仅改变了我们的生活方式，也让我们的思维方式不断更新。面对未知，我们或许会感到迷茫，但正是这种探索精神推动着社会不断进步。从传统的理念到现代的创新，每一次转变都蕴含着无限可能。测试文本的存在，正是为了验证系统的生成和处理能力。相信在不断的尝试中，我们能够找到更好的解决方案，为未来的发展铺平道路。'
    return {
      content: [{ type: "text", text: text }],
    };
  }
)


export default server
