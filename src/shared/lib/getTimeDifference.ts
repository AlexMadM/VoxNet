// Константы для единиц времени в миллисекундах
const MS_PER_SECOND = 1000
const MS_PER_MINUTE = MS_PER_SECOND * 60
const MS_PER_HOUR = MS_PER_MINUTE * 60
const MS_PER_DAY = MS_PER_HOUR * 24
const MS_PER_MONTH = MS_PER_DAY * 30.4375 // Средняя длина месяца
const MS_PER_YEAR = MS_PER_DAY * 365

// Порог для "только что" (менее 10 секунд)
const JUST_NOW_THRESHOLD = 10

// Единицы времени в порядке убывания
const TIME_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', MS_PER_YEAR],
  ['month', MS_PER_MONTH],
  ['day', MS_PER_DAY],
  ['hour', MS_PER_HOUR],
  ['minute', MS_PER_MINUTE],
  ['second', MS_PER_SECOND]
]

// Локализованные сообщения
const MESSAGES = {
  ru: {
    invalidDate: 'Неверная дата',
    justNow: 'Только что'
  },
  en: {
    invalidDate: 'Invalid date',
    justNow: 'Just now'
  }
} as const

type Locale = keyof typeof MESSAGES

export function getTimeDifference(postDate: string | Date, locale: Locale = 'en'): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const messages = MESSAGES[locale]

  const now = new Date()
  const then = new Date(postDate)

  if (isNaN(then.getTime())) {
    return messages.invalidDate
  }

  const diffMs = then.getTime() - now.getTime()
  const absMs = Math.abs(diffMs)

  // Находим подходящую единицу времени
  for (const [unit, msInUnit] of TIME_UNITS) {
    if (absMs >= msInUnit || unit === 'second') {
      const value = Math.round(diffMs / msInUnit)

      // Для секунд показываем "только что" если меньше порога
      if (unit === 'second' && absMs < JUST_NOW_THRESHOLD * MS_PER_SECOND) {
        return messages.justNow
      }

      return rtf.format(value, unit)
    }
  }

  // Fallback (не должно достигнуть сюда)
  return messages.justNow
}
