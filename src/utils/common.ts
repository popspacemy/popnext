import { isValid, parse, subDays } from "date-fns"
import { format, toZonedTime } from "date-fns-tz"
import short from "short-uuid"

export function formatDate(date: Date, dateFormat = "dd MMM yyyy") {
  return format(date, dateFormat)
}

export function getCurrentUtcDatetimeAsDate() {
  return new Date(Date.now())
}

export function getCurrentUtcDatetime() {
  return format(new Date(Date.now()), "yyyy-MM-dd HH:mm:ss")
}

export function getDatetimeInTimezone(datetime: string, timezone = "Asia/Kuala_Lumpur") {
  return format(toZonedTime(datetime, timezone), "yyyy-MM-dd HH:mm:ss")
}

export function getTodayAtMidnight(toDateObj = true, dateFormat = "yyyy-MM-dd HH:mm:ss") {
  if (toDateObj) return subDays(new Date(), 1)
  return format(subDays(new Date(), 1), dateFormat)
}

export function getDateDifferenceInDays(date1: Date, date2: Date) {
  return Math.floor((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24))
}

export function validateDate(date: string, dateFormat = "yyyy-MM-dd HH:mm:ss") {
  const parsedDate = parse(date, dateFormat, new Date())
  return isValid(parsedDate)
}

export const hasUtcDatePassed = (date: Date) => date < new Date()

export function absoluteUrl(path: string, fallbackUrl?: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || fallbackUrl}${path}`
}

export function toShortUuid(uuid: string) {
  const translator = short()
  return translator.fromUUID(uuid)
}

export function toLongUuid(uuid: string) {
  const translator = short()
  return translator.toUUID(uuid)
}

export function formatNumber(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const isTruthy = <T>(x: T | false | undefined | null | "" | 0): x is T => !!x

export const chooseOneFromArray = <T>(array: T[]) => array[Math.floor(Math.random() * array.length)]

export const fetchCallback = ({ setIsPending }: { setIsPending: (value: boolean) => void }) => {
  return {
    onRequest: () => {
      setIsPending(true)
    },
    onResponse: () => {
      setIsPending(false)
    },
  }
}
