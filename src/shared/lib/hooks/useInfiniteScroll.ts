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
   * Ref на scroll-контейнер. Если не задан, используется viewport.
   */
  rootRef?: RefObject<HTMLElement | null>
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
    rootRef,
    debounceMs = 300,
    enabled = true
  } = options

  // Используем ref для актуальных значений в callback
  const hasNextPageRef = useRef(hasNextPage)
  const isFetchingNextPageRef = useRef(isFetchingNextPage)
  const fetchNextPageRef = useRef(fetchNextPage)

  // Обновляем refs при изменении пропсов
  hasNextPageRef.current = hasNextPage
  isFetchingNextPageRef.current = isFetchingNextPage
  fetchNextPageRef.current = fetchNextPage

  const isFetchingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const currentTarget = targetRef.current
    const root = rootRef?.current ?? null

    // Ранний выход если observer отключен или нет target
    if (!enabled || !currentTarget) {
      return
    }

    // Создаем observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        // Проверяем видимость и защищаемся от множественных вызовов
        if (
          entry?.isIntersecting &&
          hasNextPageRef.current &&
          !isFetchingNextPageRef.current &&
          !isFetchingRef.current &&
          fetchNextPageRef.current
        ) {
          isFetchingRef.current = true

          try {
            const result = fetchNextPageRef.current()

            // Если fetchNextPage возвращает Promise, обрабатываем его
            if (result instanceof Promise) {
              result
                .catch((error) => {
                  console.error('Ошибка при загрузке следующей страницы:', error)
                })
                .finally(() => {
                  // Сбрасываем флаг после задержки
                  timeoutRef.current = setTimeout(() => {
                    isFetchingRef.current = false
                  }, debounceMs)
                })
            } else {
              // Сбрасываем флаг после задержки для синхронных вызовов
              timeoutRef.current = setTimeout(() => {
                isFetchingRef.current = false
              }, debounceMs)
            }
          } catch (error) {
            console.error('Ошибка при загрузке следующей страницы:', error)
            isFetchingRef.current = false
          }
        }
      },
      {
        threshold,
        rootMargin,
        root
      }
    )

    observer.observe(currentTarget)

    // Cleanup функция
    return () => {
      observer.disconnect()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      isFetchingRef.current = false
    }
  }, [enabled, threshold, rootMargin, targetRef, rootRef, debounceMs])
}
