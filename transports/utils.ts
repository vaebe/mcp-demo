import dayjs from "dayjs";
import pc from "picocolors";

type LogLevel = "info" | "success" | "warn" | "error";

const colorMap: Record<LogLevel, (str: string) => string> = {
  info: pc.gray,
  success: pc.green,
  warn: pc.yellow,
  error: pc.red,
};

function baseLog(colorFunc: (str: string) => string, message?: any, ...optionalParams: any[]) {
  const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
  console.log(colorFunc(timestamp), " - ", message, ...optionalParams);
}

export function addInfoLog(message?: any, ...optionalParams: any[]) {
  baseLog(colorMap.info, message, ...optionalParams);
}

export function addSuccessLog(message?: any, ...optionalParams: any[]) {
  baseLog(colorMap.success, message, ...optionalParams);
}

export function addWarnLog(message?: any, ...optionalParams: any[]) {
  baseLog(colorMap.warn, message, ...optionalParams);
}

export function addErrLog(message?: any, ...optionalParams: any[]) {
  baseLog(colorMap.error, message, ...optionalParams);
}
