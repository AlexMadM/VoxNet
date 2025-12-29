import { useEffect, useRef, useState, RefObject } from 'react'

type Position = { x: number; y: number }

type UseImageDragParams = {
  containerRef: RefObject<HTMLDivElement | null>
  pos: Position
  setPos: (pos: Position | ((prev: Position) => Position)) => void
  clampPos: (p: Position) => Position
}

export const useImageDrag = ({ containerRef, pos, setPos, clampPos }: UseImageDragParams) => {
  const [isPointerDown, setIsPointerDown] = useState(false)
  const pointerStart = useRef({ x: 0, y: 0 })
  const posStart = useRef({ x: 0, y: 0 })
  const posRef = useRef(pos)
  posRef.current = pos

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      node.setPointerCapture(e.pointerId)
      setIsPointerDown(true)
      pointerStart.current = { x: e.clientX, y: e.clientY }
      posStart.current = { ...posRef.current }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return
      const dx = e.clientX - pointerStart.current.x
      const dy = e.clientY - pointerStart.current.y
      setPos(clampPos({ x: posStart.current.x + dx, y: posStart.current.y + dy }))
    }

    const onPointerUp = (e: PointerEvent) => {
      try {
        node.releasePointerCapture(e.pointerId)
      } catch {}
      setIsPointerDown(false)
    }

    node.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      node.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [containerRef, isPointerDown, setPos, clampPos])
}
