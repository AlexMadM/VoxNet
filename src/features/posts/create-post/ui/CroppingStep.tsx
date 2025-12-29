'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Button, PlusCircleOutline, Typography } from '@/shared/ui'
import { useContainerSize } from '../hooks/useContainerSize'
import { useImageInitialization } from '../hooks/useImageInitialization'
import { useImageTransform } from '../hooks/useImageTransform'
import { useImageDrag } from '../hooks/useImageDrag'
import s from './CroppingStep.module.css'

type ImageThumbnail = {
  id: string
  url: string
  isCurrent: boolean
}

type Props = {
  imageUrl: string
  onBack: () => void
  onNext: (blob: Blob) => void
  onDeleteImage?: (index: number) => void // Теперь принимает индекс изображения
  onAddPhotos: () => void // Теперь обязательный проп
  index?: number
  total?: number
  allImages?: ImageThumbnail[]
  onSelectImage?: (index: number) => void
}

export const CroppingStep: React.FC<Props> = ({
  imageUrl,
  onBack,
  onNext,
  onDeleteImage,
  onAddPhotos,
  total = 0,
  allImages = [],
  onSelectImage
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const [aspect, setAspect] = useState<number | null>(null)

  // Отслеживание размера контейнера
  const container = useContainerSize(containerRef)

  // Инициализация изображения
  const { natural, initialScale, initialPos } = useImageInitialization({
    imageUrl,
    containerRef
  })

  // Управление трансформацией изображения (позиция, масштаб, зум)
  const { scale, pos, setPos, clampPos, zoomIn, zoomOut } = useImageTransform({
    containerRef,
    natural,
    container,
    initialScale,
    initialPos
  })

  // Обработка перетаскивания изображения
  useImageDrag({
    containerRef,
    pos,
    setPos,
    clampPos
  })

  const frame = useMemo(() => {
    const cw = container.w
    const ch = container.h
    if (!cw || !ch) return { w: 0, h: 0 }
    if (!aspect) return { w: cw, h: ch }
    let fw = Math.min(cw * 0.94, cw)
    let fh = fw / aspect
    if (fh > ch * 0.94) {
      fh = ch * 0.94
      fw = fh * aspect
    }
    return { w: Math.round(fw), h: Math.round(fh) }
  }, [container, aspect])

  const doCrop = () => {
    if (!containerRef.current || !imgRef.current || !natural.w) return
    const canvas = document.createElement('canvas')
    canvas.width = frame.w
    canvas.height = frame.h
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const sx = ((container.w - frame.w) / 2 - pos.x) / scale
    const sy = ((container.h - frame.h) / 2 - pos.y) / scale
    ctx.drawImage(imgRef.current, sx, sy, frame.w / scale, frame.h / scale, 0, 0, frame.w, frame.h)
    canvas.toBlob(
      (b) => {
        if (b) onNext(b)
      },
      'image/jpeg',
      0.92
    )
  }

  // Обработчик добавления фото через плюс
  const handleAddPhoto = useCallback(() => {
    onAddPhotos()
  }, [onAddPhotos])

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <Button style={{ padding: '0' }} variant="textButton" onClick={onBack} aria-label="Back">
          <ArrowLeft />
        </Button>
        <Typography variant="h1">Cropping</Typography>
        <Button onClick={doCrop} variant="outlined" aria-label="Next">
          <Typography variant="h3">Next</Typography>
        </Button>
      </div>

      {/* Основной контейнер для обрезки с центрированием */}
      <div ref={containerRef} className={s.cropContainer}>
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Crop preview"
          className={s.cropImage}
          style={{
            transform: `translate(${pos.x}px,${pos.y}px) scale(${scale})`,
            transformOrigin: 'top left'
          }}
          draggable={false}
        />
        {/* Затемнение области вне выделения */}
        <div className={s.darkOverlay}>
          {/* Верхняя полоса затемнения */}
          <div
            className={s.darkTop}
            style={{
              height: `calc(50% - ${frame.h / 2}px)`
            }}
          />
          {/* Нижняя полоса затемнения */}
          <div
            className={s.darkBottom}
            style={{
              height: `calc(50% - ${frame.h / 2}px)`
            }}
          />
          {/* Левая полоса затемнения */}
          <div
            className={s.darkLeft}
            style={{
              width: `calc(50% - ${frame.w / 2}px)`,
              top: `calc(50% - ${frame.h / 2}px)`,
              height: frame.h
            }}
          />
          {/* Правая полоса затемнения */}
          <div
            className={s.darkRight}
            style={{
              width: `calc(50% - ${frame.w / 2}px)`,
              top: `calc(50% - ${frame.h / 2}px)`,
              height: frame.h
            }}
          />
        </div>
        {/* Рамка выделения */}
        <div
          className={s.overlay}
          style={{
            width: frame.w,
            height: frame.h
          }}
        />
      </div>

      {/* Контролы для аспекта и зума */}
      <div className={s.controls}>
        <div className={s.aspect}>
          <Button className={s.btnScale} onClick={() => setAspect(1)} variant="outlined">
            1:1
          </Button>
          <Button className={s.btnScale} onClick={() => setAspect(4 / 5)} variant="outlined">
            4:5
          </Button>
          <Button className={s.btnScale} onClick={() => setAspect(16 / 9)} variant="outlined">
            16:9
          </Button>
        </div>
        <div className={s.zoom}>
          <Button className={s.btnScale} onClick={zoomOut} variant="outlined" aria-label="Zoom out">
            -
          </Button>
          <Typography variant="small">{scale.toFixed(2)}x</Typography>
          <Button className={s.btnScale} onClick={zoomIn} variant="outlined" aria-label="Zoom in">
            +
          </Button>
        </div>
      </div>

      {/* Миниатюры с плюсом для добавления */}
      {allImages.length > 0 && (
        <div className={s.thumbnails}>
          <div className={s.thumbnailsList}>
            {allImages.map((img, idx) => (
              <div key={img.id} className={s.thumbnailWrapper}>
                <Button
                  className={`${s.thumbnail} ${img.isCurrent ? s.thumbnailActive : ''}`}
                  onClick={() => onSelectImage?.(idx)}
                  variant="textButton"
                  aria-label={`Select image ${idx + 1}`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx + 1}`} />
                </Button>
                {onDeleteImage && (
                  <Button
                    className={s.thumbnailDelete}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteImage(idx)
                    }}
                    variant="textButton"
                    aria-label={`Delete image ${idx + 1}`}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            {total < 10 && <PlusCircleOutline className={s.plusCircleOutline} onClick={handleAddPhoto} />}
          </div>
        </div>
      )}
    </div>
  )
}
