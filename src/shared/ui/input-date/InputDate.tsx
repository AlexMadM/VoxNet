import { DayPicker } from 'react-day-picker'
import { Calendar, Card, Input, Typography } from '@/shared/ui'
import { format, isValid, parse } from 'date-fns'
import { ChangeEvent, HTMLAttributes, useEffect, useState } from 'react'
import classNames from 'react-day-picker/style.module.css'
import s from './InputDate.module.css'
import { DATE_FORMAT } from '@/features/edit-personal-data/model/lib/consts'

type InputDateProps = {
  value?: string
  onChange?: (value: string) => void
}

export const InputDate = ({ value, onChange }: InputDateProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false)
  // Hold the month in state to control the calendar when the input changes
  const [month, setMonth] = useState(new Date())
  // Hold the selected date in state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  // Hold the input value in state
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!value) {
      setInputValue('')
      setSelectedDate(undefined)
      return
    }

    setInputValue(value)

    if (!value.includes('-')) {
      const date = parse(value, DATE_FORMAT, new Date())
      if (isValid(date)) {
        setSelectedDate(date)
        setMonth(date)
      }
    }
  }, [value])

  const handleDayPickerSelect = (date: Date | undefined) => {
    setSelectedDate(date)

    const formatted = date ? format(date, DATE_FORMAT) : ''
    setInputValue(formatted)
    onChange?.(formatted)

    if (date) setMonth(date)
  }

  /** Ввод диапазона вручную */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    onChange?.(val)

    const date = parse(val, DATE_FORMAT, new Date())
    if (isValid(date)) {
      setSelectedDate(date)
      setMonth(date)
    } else {
      setSelectedDate(undefined)
    }
  }

  const modifiers = {
    weekend: { dayOfWeek: [0, 6] } // 0 = воскресенье, 6 = суббота
  }
  return (
    <>
      <div className={s.dateInputWrapper}>
        <Input
          id="dateOfBirth"
          label="Date of birth"
          type="text"
          placeholder="mm/dd/yyyy"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Calendar className={s.calendarIcon} onClick={() => setIsCalendarOpen((prevState) => !prevState)} />
        {isCalendarOpen && (
          <Card className={s.card}>
            <DayPicker
              month={month}
              onMonthChange={setMonth}
              selected={selectedDate}
              onSelect={handleDayPickerSelect}
              components={{
                CaptionLabel: CaptionMonth
              }}
              classNames={{
                ...classNames,
                chevron: s.chevron,
                button_next: s.navBtn,
                button_previous: s.navBtn,
                today: s.today,
                outside: s.outside,
                day: s.day,
                weekday: s.weekday,
                weekdays: s.weekdays,
                selected: s.selected,
                range_end: s.rangeEnd,
                range_start: s.rangeStart,
                range_middle: s.rangeMiddle
              }}
              ISOWeek
              showOutsideDays
              modifiers={modifiers}
              modifiersClassNames={{
                weekend: s.weekend
              }}
              mode={'single'}
            />
          </Card>
        )}
      </div>
    </>
  )
}

const CaptionMonth = (props: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <Typography asChild variant={'bold_16'}>
      <span {...props}></span>
    </Typography>
  )
}
