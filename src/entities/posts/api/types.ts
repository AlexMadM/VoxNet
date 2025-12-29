export type Avatar = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
}

// export type UserProfileResponse = {
//   id: number
//   userName: string
//   firstName: string
//   lastName: string
//   city: string
//   country: string
//   region: string
//   dateOfBirth: string
//   aboutMe: string
//   avatars: Avatar[]
//   isFollowing: boolean
//   isFollowedBy: boolean
//   followingCount: number
//   followersCount: number
//   publicationsCount: number
// }

export type EditPost = {
  postId: number
  description: string
}

export type ImagePost = {
  createdAt: string
  fileSize: number
  height: number
  uploadId: string
  url: string
  width: number
}

export type Owner = {
  firstName: string
  lastName: string
}

export type Post = {
  avatarOwner: string
  avatarWhoLikes: string[]
  createdAt: string
  description: string
  id: number
  images: ImagePost[]
  isLiked: boolean
  likesCount: number
  location: null
  owner: Owner
  ownerId: number
  updatedAt: string
  userName: string
}

export type ResponsesPosts = {
  totalCount: number
  pageSize: number
  items: Post[]
  totalUsers: number
}

export type GetCommentsParams = {
  postId: number
  pageSize?: number
  pageNumber?: number
  sortBy?: string
  sortDirection?: string
}

export type From = {
  id: number
  username: string
  avatars: Avatar[]
}

export type Comment = {
  id: number
  postId: number
  from: From
  content: string
  createdAt: string
  answerCount: number
  likeCount: number
  isLiked: boolean
}

export type CommentsResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: Comment[]
}
export type CreatePostPayload = {
  description: string
  location?: string
  childrenMetadata: {
    uploadId: string
  }[]
}
export type CreatePostResponse = {
  id: number
  userName: string
  description: string
  location: string
  images: {
    url: string
    width: number
    height: number
    fileSize: number
    createdAt: string
    uploadId: string
  }[]
  createdAt: string
  updatedAt: string
  ownerId: number
  avatarOwner: string
  owner: {
    firstName: string
    lastName: string
  }
  likesCount: number
  isLiked: boolean
  avatarWhoLikes: boolean
}
export type PostImagesPayload = {
  files: File[]
}
export type PostImagesResponse = {
  images: {
    url: string
    width: number
    height: number
    fileSize: number
    createdAt: string
    uploadId: string
  }[]
}

export type AddAvatarPayload = {
  file: File
}

export type AddAvatarResponse = {
  avatars: Avatar[]
}