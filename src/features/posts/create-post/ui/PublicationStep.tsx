'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Button, Typography, Textarea } from '@/shared/ui'
import { ArrowLeft } from '@/shared/ui/icons/ArrowLeft'
import { useAuth } from '@/shared/lib'
import { PostImageSlider } from '@/shared/lib/post-image-slider/post-image-slider'

import s from './PublicationStep.module.css'
import { AddLocation } from '@/widgets'
import Avatar from '../../../../shared/ui/Avatar/Avatar'
import { CharacterCounter } from '@/shared/ui/character-counter'
import { ImagePost } from '@/entities/posts/api/types'
import { useUserProfile } from '@/entities/user'

type ImageItem = {
  id: string
  croppedUrl: string | null
  originalUrl: string
}

type Props = {
  images: ImageItem[]
  currentImageIndex: number
  onBack: () => void
  onPublish: (data: { description: string; location: string }) => void
  onPrevImage: () => void
  onNextImage: () => void
  isPublishing?: boolean
}

const MAX_DESCRIPTION_LENGTH = 500

export const PublicationStep: React.FC<Props> = ({
  images,
  currentImageIndex,
  onBack,
  onPublish,
  onPrevImage,
  onNextImage,
  isPublishing = false
}) => {
  const { user } = useAuth()
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile(user?.userId)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])

  // Преобразуем ImageItem[] в ImagePost[] для слайдера
  const sliderImages: ImagePost[] = useMemo(
    () =>
      images.map((img, index) => ({
        uploadId: img.id,
        url: img.croppedUrl || img.originalUrl,
        width: 600, // Дефолтные значения, так как у нас нет реальных размеров
        height: 600,
        fileSize: 0,
        createdAt: new Date().toISOString()
      })),
    [images]
  )

  const hasImages = images.length > 0

  // Обработчик изменения описания
  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value)
    }
  }, [])

  // Обработчик изменения локации с поиском
  const handleLocationChange = useCallback((value: string) => {
    setLocation(value)

    // Простая логика предложений (в реальном приложении здесь будет API запрос)
    if (value.length > 0) {
      const suggestions = ['New York', 'Washington Square Park', 'Los Angeles', 'San Francisco']
      const filtered = suggestions.filter((s) => s.toLowerCase().includes(value.toLowerCase()))
      setLocationSuggestions(filtered.slice(0, 4))
    } else {
      setLocationSuggestions([])
    }
  }, [])

  // Выбор локации из предложений
  const handleSelectLocation = useCallback((selectedLocation: string) => {
    setLocation(selectedLocation)
    setLocationSuggestions([])
  }, [])

  // Публикация
  const handlePublish = useCallback(() => {
    onPublish({
      description: description.trim(),
      location: location.trim()
    })
  }, [description, location, onPublish])

  const counter = description.length

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <Button variant="textButton" onClick={onBack} aria-label="Back">
          <ArrowLeft />
        </Button>
        <Typography variant="h1">Publication</Typography>
        <Button onClick={handlePublish} variant="primary" disabled={isPublishing || !hasImages} aria-label="Publish">
          {isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
      </div>

      <div className={s.content}>
        {/* Левая часть - изображение с навигацией */}
        <div className={s.imageSection}>
          {hasImages && (
            <PostImageSlider
              images={sliderImages}
              postId={0} // Не используется, так как disableLink=true
              ownerId={0} // Не используется
              description={description}
              disableLink={true}
              className={s.imageSlider}
              size="large"
            />
          )}
        </div>

        {/* Правая часть - форма */}
        <div className={s.formSection}>
          {/* Профиль пользователя */}
          <div className={s.profile}>
            <Avatar
              alt={user?.userName || 'User'}
              src={profileData?.avatars[0]?.url || ''}
              size="medium"
              withStatus={false}
            />
            <Typography variant="regular_14">{user?.userName || 'User'}</Typography>
          </div>

          {/* Описание публикации */}
          <div className={s.field}>
            <Textarea
              id="description"
              label="Add publication descriptions"
              placeholder="Text-area"
              value={description}
              onChange={handleDescriptionChange}
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            <CharacterCounter current={counter} max={MAX_DESCRIPTION_LENGTH} />
          </div>

          {/* Локация */}
          <div className={s.field}>
            <AddLocation
            // value={location}
            // onChange={handleLocationChange}
            // suggestions={locationSuggestions}
            // onSelectSuggestion={handleSelectLocation}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
