import { useEffect, useState, RefObject } from 'react'

export const useContainerSize = (containerRef: RefObject<HTMLDivElement | null>) => {
  const [container, setContainer] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const update = () => setContainer({ w: node.clientWidth, h: node.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(node)
    return () => ro.disconnect()
  }, [containerRef])

  return container
}
