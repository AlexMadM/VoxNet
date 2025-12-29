import styles from './registeredUusers.module.css'
import { Typography } from '@/shared/ui/typography/Typography'

const formatNumberToDigits = (num: number): string[] => {
  const numStr = num.toString()
  const digits = numStr.split('')

  // Если число меньше 6 цифр, добавляем нули в начало
  while (digits.length < 6) {
    digits.unshift('0')
  }

  return digits.slice(0, 6)
}

type Props = {
  totalCount: number
}

export const RegisteredUsers = ({ totalCount }: Props) => {
  const digits = formatNumberToDigits(totalCount)

  return (
    <div className={styles.registredContainer}>
      <Typography variant="h2">Registered users:</Typography>
      <div className={styles.numberContainer}>
        <ul>
          {digits.map((digit, index) => (
            <li key={index}>{digit}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
