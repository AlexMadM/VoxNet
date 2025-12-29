import { useEffect, useRef, useState, RefObject, useCallback } from 'react'

type Size = { w: number; h: number }
type Position = { x: number; y: number }

type UseImageTransformParams = {
  containerRef: RefObject<HTMLDivElement | null>
  natural: Size
  container: Size
  initialScale: number
  initialPos: Position
}

export const useImageTransform = ({
  containerRef,
  natural,
  container,
  initialScale,
  initialPos
}: UseImageTransformParams) => {
  const [scale, setScale] = useState(initialScale)
  const [pos, setPos] = useState(initialPos)

  const posRef = useRef(pos)
  posRef.current = pos
  const scaleRef = useRef(scale)
  scaleRef.current = scale

  // Ограничение позиции с учетом центрирования
  const clampPos = useCallback(
    (p: Position, s = scaleRef.current): Position => {
      const node = containerRef.current
      if (!node || !natural.w || !natural.h) return p
      const cw = node.clientWidth
      const ch = node.clientHeight
      const dispW = natural.w * s
      const dispH = natural.h * s

      // Если изображение меньше контейнера - центрируем
      if (dispW <= cw && dispH <= ch) {
        return {
          x: cw / 2 - dispW / 2,
          y: ch / 2 - dispH / 2
        }
      }

      // Если больше - ограничиваем движение
      return {
        x: Math.max(cw / 2 - dispW, Math.min(p.x, cw / 2)),
        y: Math.max(ch / 2 - dispH, Math.min(p.y, ch / 2))
      }
    },
    [containerRef, natural]
  )

  // Обновление позиции при изменении scale, container, natural
  useEffect(() => {
    setPos((p) => clampPos(p, scale))
  }, [scale, container, natural, clampPos])

  // Обновление scale и pos при изменении initialScale/initialPos
  useEffect(() => {
    setScale(initialScale)
    setPos(initialPos)
  }, [initialScale, initialPos])

  const zoomIn = useCallback(() => {
    setScale((s) => {
      const next = Math.min(4, s + 0.1)
      setPos(clampPos(posRef.current, next))
      return next
    })
  }, [clampPos])

  const zoomOut = useCallback(() => {
    setScale((s) => {
      const next = Math.max(0.1, s - 0.1)
      setPos(clampPos(posRef.current, next))
      return next
    })
  }, [clampPos])

  // Зум с центрированием относительно центра контейнера
  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = -e.deltaY * 0.0025
      setScale((prev) => {
        const next = Math.min(Math.max(0.1, prev + delta), 4)
        if (!natural.w || !natural.h) return next

        const cw = node.clientWidth
        const ch = node.clientHeight
        const factor = next / prev
        const prevPos = posRef.current

        // Масштабируем относительно центра контейнера
        const newX = cw / 2 - (cw / 2 - prevPos.x) * factor
        const newY = ch / 2 - (ch / 2 - prevPos.y) * factor

        setPos(clampPos({ x: newX, y: newY }, next))
        return next
      })
    }

    // Добавляем обработчик с passive: false, чтобы можно было вызвать preventDefault
    node.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      node.removeEventListener('wheel', onWheel)
    }
  }, [containerRef, natural, clampPos])

  return {
    scale,
    pos,
    setPos,
    setScale,
    clampPos,
    zoomIn,
    zoomOut,
    posRef,
    scaleRef
  }
}
