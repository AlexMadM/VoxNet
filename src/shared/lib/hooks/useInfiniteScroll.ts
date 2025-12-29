'use client'

import { useEffect, useRef, RefObject } from 'react'

type UseInfiniteScrollOptions = {
  /**
   * Ref на элемент, который нужно отслеживать
   */
  targetRef: RefObject<HTMLElement | null>
  /**
   * Есть ли еще данные для загрузки
   */
  hasNextPage: boolean
  /**
   * Идет ли сейчас загрузка следующей страницы
   */
  isFetchingNextPage: boolean
  /**
   * Функция для загрузки следующей страницы
   */
  fetchNextPage: () => void | Promise<void>
  /**
   * Порог видимости элемента (0-1)
   * @default 0.1
   */
  threshold?: number
  /**
   * Отступ от viewport для предзагрузки (в пикселях)
   * @default '10px'
   */
  rootMargin?: string
  /**
   * Задержка перед разрешением следующего вызова (в мс)
   * Защита от множественных вызовов при быстром скролле
   * @default 300
   */
  debounceMs?: number
  /**
   * Включен ли observer
   * @default true
   */
  enabled?: boolean
}

// /**
//  * Хук для реализации бесконечной прокрутки через Intersection Observer
//  *
//  * @example
//  * ```tsx
//  * const observerTarget = useRef<HTMLDivElement>(null)
//  *
//  * useInfiniteScroll({
//  *   targetRef: observerTarget,
//  *   hasNextPage,
//  *   isFetchingNextPage,
//  *   fetchNextPage
//  * })
//  *
//  * return (
//  *   <div ref={observerTarget}>
//  *     {/* Контент */}
//  *   </div>
//  *
// */

export const useInfiniteScroll = (options: UseInfiniteScrollOptions) => {
  const {
    targetRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold = 0.1,
    rootMargin = '10px',
    debounceMs = 300,
    enabled = true
  } = options

  const observerRef = useRef<IntersectionObserver | null>(null)
  const isFetchingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const currentTarget = targetRef.current

    // Ранний выход если observer отключен или нет необходимых условий
    if (!enabled || !currentTarget || !hasNextPage || isFetchingNextPage || !fetchNextPage) {
      // Отключаем observer если он был создан
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      return
    }

    // Если observer уже существует, не создаем новый
    if (observerRef.current) {
      return
    }

    // Создаем observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        // Проверяем видимость и защищаемся от множественных вызовов
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage && !isFetchingRef.current && fetchNextPage) {
          isFetchingRef.current = true

          try {
            const result = fetchNextPage()

            // Если fetchNextPage возвращает Promise, обрабатываем его
            if (result instanceof Promise) {
              result.catch((error) => {
                console.error('Ошибка при загрузке следующей страницы:', error)
              })
            }
          } catch (error) {
            console.error('Ошибка при загрузке следующей страницы:', error)
          } finally {
            // Очищаем предыдущий timeout если он есть
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }

            // Сбрасываем флаг после задержки
            timeoutRef.current = setTimeout(() => {
              isFetchingRef.current = false
            }, debounceMs)
          }
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(currentTarget)
    observerRef.current = observer

    // Cleanup функция
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      isFetchingRef.current = false
    }
  }, [enabled, hasNextPage, isFetchingNextPage, fetchNextPage, threshold, rootMargin, debounceMs, targetRef])
}
