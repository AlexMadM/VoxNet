import { useMutation } from '@tanstack/react-query'
import { postsApi } from '@/entities/posts/api/posts'
import { AxiosError } from 'axios'
import { PostImagesPayload, PostImagesResponse } from '@/entities/posts/api/types'

export const useCreatePostImage = () => {
  return useMutation<PostImagesResponse, AxiosError, PostImagesPayload>({
    mutationFn: (payload) => postsApi.createPostImage(payload)
  })
}
