'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { clsx } from 'clsx'

import { ImagePost } from '@/entities/posts/api/types'
import s from './post-image-slider.module.css'
import { ArrowBack } from '@/shared/ui/icons/ArrowBack'
import { ArrowForward } from '@/shared/ui/icons/ArrowForward'
import { Dot } from '@/shared/ui/icons/Dot'

type Props = {
  images: ImagePost[]
  postId: number
  ownerId: number
  description?: string
  /**
   * Отключить Link обертку для использования в модальных окнах
   * @default false
   */
  disableLink?: boolean
  /**
   * Дополнительный className для контейнера слайдера
   */
  className?: string
  /**
   * Размер слайдера - влияет на размер иконок навигации
   * @default 'default'
   */
  size?: 'default' | 'large'
}

/**
 * Кастомный слайдер изображений для постов
 *
 * Особенности реализации:
 * - Нативная навигация без внешних библиотек (меньше bundle size)
 * - Плавные CSS transitions для производительности
 * - Поддержка клавиатуры для accessibility
 * - Оптимизация рендеринга через useCallback
 * - Автоматическое скрытие кнопок на краях
 */
export const PostImageSlider = ({
  images,
  postId,
  ownerId: _ownerId,
  description,
  disableLink = false,
  className,
  size = 'default'
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Мемоизация обработчиков для оптимизации ре-рендеров
  const handlePrevious = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    },
    [images.length]
  )

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    },
    [images.length]
  )

  const handleDotClick = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex(index)
  }, [])

  // Обработка клавиатуры для accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }
    },
    [images.length]
  )

  // Показываем кнопки только если больше одного изображения
  const showNavigation = images.length > 1

  return (
    <div
      className={clsx(s.sliderContainer, size === 'large' && s.large, className)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Контейнер изображений с overflow для скрытия неактивных */}
      <div className={s.imagesWrapper} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={image.uploadId || index} className={s.imageSlide}>
            {disableLink ? (
              <div className={s.imageLink}>
                <Image
                  src={image.url}
                  alt={description || `Post image ${index + 1}`}
                  width={image.width || 600}
                  height={image.height || 600}
                  className={s.image}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  priority={index === 0}
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            ) : (
              <Link href={`/profile/${_ownerId}/${postId}`} className={s.imageLink} prefetch={true}>
                <Image
                  src={image.url}
                  alt={description || `Post image ${index + 1}`}
                  width={image.width || 234}
                  height={image.height || 240}
                  className={s.image}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  // Приоритет для первого изображения для LCP оптимизации
                  priority={index === 0}
                />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Кнопки навигации */}
      {showNavigation && (
        <>
          <button
            type="button"
            className={clsx(s.navButton, s.navButtonLeft)}
            onClick={handlePrevious}
            aria-label="Previous image"
            aria-disabled={false}
          >
            <ArrowBack className={s.navIcon} />
          </button>

          <button
            type="button"
            className={clsx(s.navButton, s.navButtonRight)}
            onClick={handleNext}
            aria-label="Next image"
            aria-disabled={false}
          >
            <ArrowForward className={s.navIcon} />
          </button>
        </>
      )}

      {/* Индикаторы точек */}
      {showNavigation && (
        <div className={s.dotsContainer} role="tablist" aria-label="Image navigation">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={clsx(s.dotButton, index === currentIndex && s.dotButtonActive)}
              onClick={(e) => handleDotClick(index, e)}
              aria-label={`Go to image ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
            >
              <Dot className={s.dotIcon} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
