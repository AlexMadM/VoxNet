import { useEffect, useState, RefObject } from 'react'

type Size = { w: number; h: number }
type Position = { x: number; y: number }

type UseImageInitializationParams = {
  imageUrl: string
  containerRef: RefObject<HTMLDivElement | null>
}

export const useImageInitialization = ({ imageUrl, containerRef }: UseImageInitializationParams) => {
  const [natural, setNatural] = useState<Size>({ w: 0, h: 0 })
  const [initialScale, setInitialScale] = useState(1)
  const [initialPos, setInitialPos] = useState<Position>({ x: 0, y: 0 })

  useEffect(() => {
    if (!imageUrl) return
    const img = new Image()
    img.src = imageUrl
    img.onload = () => {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight })
      const node = containerRef.current
      if (!node) return
      const fit = Math.min(node.clientWidth / img.naturalWidth, node.clientHeight / img.naturalHeight)
      const pos = {
        x: node.clientWidth / 2 - (img.naturalWidth * fit) / 2,
        y: node.clientHeight / 2 - (img.naturalHeight * fit) / 2
      }
      setInitialScale(fit)
      setInitialPos(pos)
    }
  }, [imageUrl, containerRef])

  return { natural, initialScale, initialPos }
}
