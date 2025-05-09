import dayjs from "dayjs";
import pc from 'picocolors'

export function addInfoLog (text: string) {
  console.log(pc.gray(dayjs().format('YYYY-MM-DD HH:mm:ss')), ' - ', text)
}

export function addSuccessLog (text: string) {
  console.log(pc.green(dayjs().format('YYYY-MM-DD HH:mm:ss')), ' - ', text)
}

export function addWarnLog (text: string) {
  console.log(pc.yellow(dayjs().format('YYYY-MM-DD HH:mm:ss')), ' - ', text)
}

export function addErrLog (text: string) {
  console.log(pc.red(dayjs().format('YYYY-MM-DD HH:mm:ss')), ' - ', text)
}