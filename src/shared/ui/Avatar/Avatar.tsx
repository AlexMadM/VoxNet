import { FC } from 'react'
import s from './Avatar.module.css'
import Image from 'next/image'

type AvatarProps = {
  src?: string
  alt: string
  size?: 'very_small' | 'small' | 'medium' | 'large'
  withStatus?: boolean
}
const FALLBACK_SRC = '/img.png'

const Avatar: FC<AvatarProps> = ({ src, alt, size = 'medium', withStatus = false }) => {
  const imgSrc = src && src.trim().length > 0 ? src : FALLBACK_SRC
  return (
    <div className={`${s.avatar} ${s[`avatar--${size}`]}`}>
      <div className={s.avatar__container}>
        <Image src={imgSrc} alt={alt} className={s.avatar__image} loading="lazy" width={204} height={204} />
      </div>
      {withStatus && <div className={s.avatar__status} />}
    </div>
  )
}

export default Avatar
