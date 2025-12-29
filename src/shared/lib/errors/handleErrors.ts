import { UseFormSetError, FieldValues, Path } from 'react-hook-form'
import axios from 'axios'

export type ServerError = {
  statusCode: number
  messages:
    | string
    | Array<{
        message: string
        field: string
      }>
  error: string
}

const DEFAULT_FALLBACK_MESSAGE = 'Произошла ошибка. Попробуйте позже.'

/**
 * Обработчик ошибок для форм
 * Устанавливает ошибки в поля формы через react-hook-form
 *
 * @param error - Ошибка от Axios или любая другая ошибка
 * @param setError - Функция установки ошибок из react-hook-form
 * @param defaultField - Поле по умолчанию для установки ошибки (опционально, по умолчанию 'root')
 * @param fallbackMessage - Сообщение по умолчанию при неизвестной ошибке
 *
 * @example
 * onError: (error) => handleFormError(error, setError, 'password')
 */
export const handleFormError = <TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  defaultField?: Path<TFieldValues>,
  fallbackMessage = DEFAULT_FALLBACK_MESSAGE
) => {
  const field = defaultField ?? ('root' as Path<TFieldValues>)

  // Обработка не-Axios ошибок или сетевых ошибок без response
  if (!axios.isAxiosError<ServerError>(error) || !error.response) {
    setError(field, { message: (error as Error)?.message || fallbackMessage })
    return
  }

  const messages = error.response.data?.messages

  // Если messages - строка, устанавливаем в defaultField
  if (typeof messages === 'string') {
    setError(field, { message: messages })
    return
  }

  // Если messages - массив, устанавливаем ошибки для полей
  if (Array.isArray(messages)) {
    messages
      .filter((item): item is { message: string; field: string } => Boolean(item?.message && item?.field))
      .forEach(({ field: errorField, message }) => {
        setError(errorField as Path<TFieldValues>, { message })
      })
    return
  }

  // Если ничего не подошло, устанавливаем общую ошибку
  setError(field, { message: error.response.data?.error || fallbackMessage })
}

/**
 * Обработчик ошибок без форм
 * Возвращает строку с ошибкой для отображения в UI (toast, alert и т.д.)
 *
 * @param error - Ошибка от Axios или любая другая ошибка
 * @param fallbackMessage - Сообщение по умолчанию при неизвестной ошибке
 * @returns Строку с сообщением об ошибке
 *
 * @example
 * onError: (error) => {
 *   const message = handleError(error)
 *   toast.error(message)
 * }
 */
export const handleError = (error: unknown, fallbackMessage = DEFAULT_FALLBACK_MESSAGE): string => {
  // Обработка не-Axios ошибок или сетевых ошибок без response
  if (!axios.isAxiosError<ServerError>(error) || !error.response) {
    return (error as Error)?.message || fallbackMessage
  }

  const messages = error.response.data?.messages

  // Если messages - строка, возвращаем её
  if (typeof messages === 'string') {
    return messages
  }

  // Если messages - массив, возвращаем первое сообщение
  if (Array.isArray(messages)) {
    return messages[0]?.message || fallbackMessage
  }

  // Если ничего не подошло, возвращаем data.error или fallback
  return error.response.data?.error || fallbackMessage
}
