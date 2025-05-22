import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export function formatDate(date: Date) {
  const zonedDate = toZonedTime(date, 'America/Lima')
  return format(zonedDate, 'dd-MM-yyyy HH:mm')
}

export function formatDateCalendar(date: Date) {
  const zonedDate = toZonedTime(date, 'America/Lima')
  return format(zonedDate, 'dd-MM-yyyy')
}
