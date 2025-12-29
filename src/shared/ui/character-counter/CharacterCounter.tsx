import s from './character-counter.module.css'

export type CharacterCounterProps = {
  current: number
  max: number
  className?: string
}

export const CharacterCounter = ({ current, max, className }: CharacterCounterProps) => {
  return (
    <div className={`${s.counter} ${className}`}>
      {current}/{max}
    </div>
  )
}
