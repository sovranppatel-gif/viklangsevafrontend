/** Calendar-day comparison helpers for events */

export function startOfDay(value = new Date()) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export function isUpcomingEvent(event, today = startOfDay()) {
  if (!event?.date) return false
  const date = startOfDay(event.date)
  if (Number.isNaN(date.getTime())) return false
  return date.getTime() >= today.getTime()
}

export function isPastEvent(event, today = startOfDay()) {
  if (!event?.date) return false
  const date = startOfDay(event.date)
  if (Number.isNaN(date.getTime())) return false
  return date.getTime() < today.getTime()
}

export function sortEventsAscending(events = []) {
  return [...events].sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
}

export function sortEventsDescending(events = []) {
  return [...events].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
}

export function splitEventsByTiming(events = []) {
  const today = startOfDay()
  const upcoming = sortEventsAscending(events.filter((event) => isUpcomingEvent(event, today)))
  const past = sortEventsDescending(events.filter((event) => isPastEvent(event, today)))
  return { upcoming, past, today }
}
