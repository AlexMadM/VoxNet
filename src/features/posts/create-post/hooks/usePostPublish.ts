import { useCallback } from 'react'
import { useCreatePostImage } from '../api/useCreatePostImage'
import { useCreatePost } from '../api/useCreatePost'
import type { ImageItem } from '../model/types'

type UsePostPublishParams = {
  images: ImageItem[]
  onOpenChange: (v: boolean) => void
}

export const usePostPublish = ({ images, onOpenChange }: UsePostPublishParams) => {
  const { mutate: uploadImages, isPending: isUploadingImages } = useCreatePostImage()
  const { mutate: createPost, isPending: isCreatingPost } = useCreatePost()

  const handlePublish = useCallback(
    (data: { description: string; location: string }) => {
      const files = images
        .map((img, idx) => {
          if (img.croppedBlob) {
            return new File([img.croppedBlob], `cropped-${idx}.jpg`, { type: 'image/jpeg' })
          }
          return img.originalFile ?? null
        })
        .filter((f): f is File => f !== null)
      if (files.length === 0) return

      uploadImages(
        { files },
        {
          onSuccess: (response) => {
            const childrenMetadata = response.images.map((item) => ({
              uploadId: item.uploadId
            }))

            const postPayload = {
              description: data.description,
              ...(data.location && { location: data.location }),
              childrenMetadata
            }
            createPost(postPayload, {
              onSuccess: () => {
                onOpenChange(false)
              },
              onError: (err) => {
                console.error('Error creating post:', err)
              }
            })
          },
          onError: (err) => {
            console.error('Error uploading images:', err)
          }
        }
      )
    },
    [images, uploadImages, createPost, onOpenChange]
  )

  return {
    handlePublish,
    isPublishing: isUploadingImages || isCreatingPost
  }
}
