// запрос
// entities/post/api/posts.ts

import { api } from '@/shared/api'

import {
  CommentsResponse,
  CreatePostPayload,
  CreatePostResponse,
  EditPost,
  GetCommentsParams,
  Post,
  PostImagesPayload,
  PostImagesResponse,
  ResponsesPosts,
  AddAvatarPayload,
  AddAvatarResponse
} from '@/entities/posts/api/types'

export const postsApi = {
  deletePost: async (id: number): Promise<void> => {
    await api.delete<void>(`/posts/${id}`)
  },
  editPost: async ({ postId, description }: EditPost) => {
    await api.put<void>(`/posts/${postId}`, {
      description
    })
  },
  getPost: async (postId: number): Promise<Post> => {
    const { data } = await api.get<Post>(`/posts/id/${postId}`)
    return data
  },
  getComments: async (params: GetCommentsParams): Promise<CommentsResponse> => {
    const { postId, pageSize, pageNumber, sortBy, sortDirection } = params
    const { data } = await api.get<CommentsResponse>(`/posts/${postId}/comments`, {
      params: {
        pageSize: pageSize ?? 6,
        sortDirection: sortDirection ?? 'desc',
        pageNumber: pageNumber ?? 1, //то значение, которое возвращается из getNextPageParam
        sortBy: sortBy ?? ''
      }
    })
    return data
  },
  createPost: async (payload: CreatePostPayload): Promise<CreatePostResponse> => {
    const { data } = await api.post<CreatePostResponse>('/posts', payload)
    return data
  },

  createPostImage: async (payload: PostImagesPayload): Promise<PostImagesResponse> => {
    const formData = new FormData()
    payload.files.forEach((file) => {
      formData.append('file', file)
    })

    const { data } = await api.post<PostImagesResponse>('/posts/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  },

  /**
   * Получение постов конкретного пользователя с cursor-based пагинацией.
   * Бэкенд использует endCursorPostId для пагинации (ID последнего загруженного поста).
   *
   * @param userId - ID пользователя
   * @param pageSize - Размер страницы (по умолчанию 8)
   * @param endCursorPostId - ID последнего загруженного поста (опционально, для следующей страницы)
   */
  getUserPosts: async (userId: number, pageSize: number = 8, endCursorPostId?: number): Promise<ResponsesPosts> => {
    // Если endCursorPostId не передан, делаем первый запрос без cursor
    // Если передан, используем его в path для получения следующих постов
    const url = endCursorPostId ? `/posts/user/${userId}/${endCursorPostId}` : `/posts/user/${userId}`

    const { data } = await api.get<ResponsesPosts>(url, {
      params: {
        pageSize
      }
    })

    return data
  },
  addPhotoAvatar: async (payload: AddAvatarPayload): Promise<AddAvatarResponse> => {
    const formData = new FormData()
    formData.append('file', payload.file)

    const { data } = await api.post<AddAvatarResponse>('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return data
  },
  deletePhotoAvatar: async (): Promise<void> => {
    await api.delete<void>('/users/profile/avatar')
  }
}
