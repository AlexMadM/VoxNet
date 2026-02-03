import { api } from '@/shared/api'
import {
  CheckRecoveryCodePayload,
  CheckRecoveryCodeResponse,
  ConfirmErrorResponse,
  ConfirmRequest,
  EmailResendingErrorResponse,
  EmailResendingRequest,
  LogoutResponse,
  PersonalData,
  PersonalDataRequest,
  PublicUserProfile,
  ResendRecoveryEmailType,
  SendRecoveryEmailType,
  SetNewPasswordType,
  SignInRequest,
  SignInResponse,
  SignUpErrorResponse,
  SignUpRequest,
  User,
  UserProfileResponse
} from './user-types'

export const userApi = {
  me: async () => {
    const { data } = await api.get<User>('/auth/me')
    return data
  },
  signIn: async (payload: SignInRequest) => {
    const { data } = await api.post<SignInResponse>('/auth/login', payload)
    console.log(data)
    return data
  },
  signUp: async (payload: SignUpRequest): Promise<void> => {
    await api.post<void | SignUpErrorResponse>('/auth/registration', payload)
  },
  confirm: async (payload: ConfirmRequest): Promise<void> => {
    await api.post<void | ConfirmErrorResponse>('/auth/registration-confirmation', payload)
  },
  emailResending: async (payload: EmailResendingRequest): Promise<void> => {
    await api.post<EmailResendingErrorResponse>('/auth/registration-email-resending', payload)
  },

  // ✔ Исправление №1 — Swagger: /auth/password-recovery возвращает 204 без тела
  // ❌ Было:api.posts<SendRecoveryEmailType> — Неверно, это тип запроса, а не ответа
  // ✔ Стало:api.posts без типа → тело не ожидается, всё корректно
  sendRecoveryEmail: async (payload: SendRecoveryEmailType): Promise<void> => {
    await api.post('/auth/password-recovery', {
      email: payload.email,
      recaptcha: payload.recaptcha,
      baseUrl: payload.baseUrl
    })
  },

  // ✔ Исправление №2 — Swagger: повторная отправка тоже возвращает 204
  // ❌ Было:api.posts<ResendRecoveryEmailType> — Неверный тип ответа
  // ✔ Стало: просто await api.posts(...)
  resendRecoveryEmail: async (payload: ResendRecoveryEmailType): Promise<void> => {
    await api.post('/auth/password-recovery-resending', {
      email: payload.email,
      baseUrl: payload.baseUrl
    })
  },

  // ✔ Исправление №3 — Swagger: new-password → 204 No Content
  // ❌ Было: posts<SetNewPasswordType> — опять тип запроса как тип ответа
  // ✔ Стало: просто await api.posts(...)
  SetNewPassword: async (payload: SetNewPasswordType): Promise<void> => {
    await api.post('/auth/new-password', {
      newPassword: payload.newPassword,
      recoveryCode: payload.recoveryCode
    })
  },
  //запросы для проверки кода
  checkRecoveryCode: async (payload: CheckRecoveryCodePayload): Promise<CheckRecoveryCodeResponse> => {
    const response = await api.post<CheckRecoveryCodeResponse>('/auth/check-recovery-code', payload)
    return response.data
  },

  logout: async (): Promise<LogoutResponse> => {
    await api.post<LogoutResponse>('/auth/logout')
  },
  userProfile: async (userName: string) => {
    const response = await api.get<UserProfileResponse>(`/users/${userName}`)
    return response.data
  },
  getPersonalData: async (): Promise<PersonalData> => {
    const response = await api.get<PersonalData>('/users/profile')
    return response.data
  },
  getPublicUserProfile: async (profileId: number): Promise<PublicUserProfile> => {
    const response = await api.get<PublicUserProfile>(`/public-user/profile/${profileId}`)
    return response.data
  }
}
//  для пользователя  при редактирования  своих даных в форме
export const updatePersonalData = async (data: PersonalDataRequest): Promise<void> => {
  await api.put('/users/profile', data)
}
