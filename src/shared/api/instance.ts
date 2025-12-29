import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import https from 'https'

// Настройка для работы с самоподписанными сертификатами (только для SSR на сервере)
// В браузере это не нужно, так как браузер сам обрабатывает сертификаты
const httpsAgent = new https.Agent({
  rejectUnauthorized: false // Отключаем проверку сертификата только для разработки
})

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  // Используем httpsAgent только на сервере (для SSR запросов)
  ...(typeof window === 'undefined' && { httpsAgent })
})

api.interceptors.request.use((config) => {
  // Проверяем, что мы на клиенте (не на сервере)
  // На сервере localStorage недоступен, поэтому используем только cookies (refreshToken)
  // withCredentials: true уже установлен в конфигурации axios,
  // поэтому cookies будут отправляться автоматически на сервере
  if (typeof window !== 'undefined') {
    // На клиенте: используем accessToken из localStorage
    const token = localStorage.getItem('accessToken')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  // На сервере: Authorization header не добавляется,
  // но cookies (refreshToken) отправляются автоматически благодаря withCredentials: true
  return config
})
// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Обрабатываем 401 ошибки
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Проверяем, не является ли запрос уже запросом на обновление токена
      const isRefreshRequest = originalRequest?.url?.includes('/auth/update')

      if (isRefreshRequest) {
        // Если это сам запрос на обновление токена вернул 401, значит refreshToken невалидный
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          window.location.href = '/sign-in'
        }
        return Promise.reject(error)
      }

      // Помечаем запрос, чтобы избежать повторных попыток
      originalRequest._retry = true

      try {
        // Пытаемся обновить токен через refreshToken в cookies
        // refreshToken автоматически отправится благодаря withCredentials: true
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/update`,
          {},
          { withCredentials: true }
        )

        const newToken = refreshResponse.data.accessToken
        // Сохраняем токен только на клиенте
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', newToken)
        }

        // Повторяем оригинальный запрос с новым токеном
        if (originalRequest && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          // Сбрасываем флаг _retry для повторного запроса
          const retryRequest: InternalAxiosRequestConfig & { _retry?: boolean } = {
            ...originalRequest
          }
          delete retryRequest._retry
          return api(retryRequest)
        }
      } catch (refreshError) {
        // Если обновление токена не удалось (нет refreshToken или он невалидный)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken')
          // Для запросов на /auth/me не редиректим сразу, чтобы избежать циклов
          const isMeRequest = originalRequest?.url?.includes('/auth/me')
          if (!isMeRequest) {
            window.location.href = '/sign-in'
          }
        }
        return Promise.reject(refreshError)
      }
    }

    // Если это повторный 401 после попытки обновления токена, редиректим
    if (error.response?.status === 401 && originalRequest._retry) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        const isMeRequest = originalRequest?.url?.includes('/auth/me')
        if (!isMeRequest) {
          window.location.href = '/sign-in'
        }
      }
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

// export const createInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
//   return api({
//     ...config,
//     ...options
//   }).then((r) => r.data)
// }

export type BodyType<Data> = Data

export type ErrorType<Error> = AxiosError<Error>
//
// export type SecondParameter<T extends (...args: any) => any> = T extends (
//     config: any,
//     args: infer P,
//   ) => any
//   ? P
//   : never;
