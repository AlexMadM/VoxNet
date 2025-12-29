export type User = {
  userId: number
  userName: string
  email: string
  isBlocked: boolean
}
export type UserProfileResponse = {
  id: number
  userName: string
  firstName: string
  lastName: string
  city: string
  country: string
  region: string
  dateOfBirth: string
  aboutMe: string
  avatars: Avatar[]
  isFollowing: boolean
  isFollowedBy: boolean
  followingCount: number
  followersCount: number
  publicationsCount: number
}

export type SignInRequest = {
  email: string
  password: string
}

export type SignInResponse = {
  accessToken: string
}

export type SignUpRequest = {
  userName: string
  email: string
  password: string
  baseUrl: string
}

export type SignUpErrorResponse = {
  statusCode: number // 400
  messages: {
    message: string
    field: 'email' | 'password' | 'userName' | 'confirmPassword' | 'agree'
  }[]
  error: string // "Bad Request"
}

//(эндпоинт: /auth/password-recovery)
export type SendRecoveryEmailType = {
  email: string
  recaptcha: string
  baseUrl: string
}

// Тип для ПОВТОРНОЙ отправки письма (эндпоинт: /auth/password-recovery-resending)
export type ResendRecoveryEmailType = {
  email: string // Email пользователя для повторной отправки
  baseUrl: string
}

// Тип для установки НОВОГО ПАРОЛЯ (эндпоинт: /auth/new-password)
export type SetNewPasswordType = {
  newPassword: string // Новый пароль пользователя
  recoveryCode: string // Код восстановления из письма
}
// Тип запроса для проверки кода восстановления
export type CheckRecoveryCodePayload = {
  recoveryCode: string
}

// Тип ответа при успешной проверке кода (200 OK)
export type CheckRecoveryCodeResponse = {
  email: string
}

export type LogoutResponse = void

export type ConfirmRequest = {
  confirmationCode: string
}

export type ConfirmErrorResponse = {
  statusCode: number
  messages: {
    message: string
    field: string
  }[]
  error: string
}

export type EmailResendingRequest = {
  email: string
  baseUrl: string
}

export type EmailResendingErrorResponse = {
  statusCode: number
  messages: {
    message: string
    field: string
  }[]
  error: string
}

export type TotalCountUsersResponse = {
  totalCount: number
}
export type Avatar = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
}

export type PersonalData = PersonalDataRequest & {
  id: number
  avatars: Array<Avatar>
  createdAt: string
}

// типы для редавктирания своего профиля
export type PersonalDataRequest = {
  userName?: string
  firstName: string
  lastName: string
  dateOfBirth: string
  city: string
  country: string
  region?: string
  aboutMe: string
}
