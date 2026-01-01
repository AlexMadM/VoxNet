import { isServer, QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query'

/**
 * Константы для настройки QueryClient
 */
const STALE_TIME = 2 *60 * 1000 // 2 минута - время, в течение которого данные считаются свежими

/**
 * Создает новый QueryClient с настройками для SSR
 *
 * Особенности конфигурации:
 * - Поддержка pending queries в dehydration для React Streaming SSR
 * - Оптимизированные настройки для Next.js App Router
 * - Правильная обработка ошибок для динамических страниц
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME,
        // Данные считаются свежими 2 минуту, что уменьшает количество запросов
        refetchOnWindowFocus: false,
        // Не обновляем данные при фокусе окна (можно переопределить в конкретных запросах)
        refetchOnMount: false,
        // Не обновляем данные при монтировании, если они еще свежие
        retry: 1,
        // Одна попытка повтора при ошибке по умолчанию
        retryDelay: 1000
        // Задержка 1 секунда перед повтором
      },
      mutations: {
        retry: 1,
        // Одна попытка повтора для мутаций
        retryDelay: 1000
      },
      dehydrate: {
        /**
         * Определяет, какие запросы включать в dehydratedState
         *
         * Включает:
         * - Успешные запросы (defaultShouldDehydrateQuery)
         * - Pending запросы (для React Streaming SSR)
         *
         * Это позволяет отправлять частично загруженные данные на клиент
         * и продолжать загрузку там, улучшая Time to First Byte (TTFB)
         */
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        /**
         * Определяет, нужно ли скрывать ошибки при дегидратации
         *
         * Возвращает false, потому что:
         * 1. Next.js использует ошибки для определения динамических страниц
         * 2. Next.js автоматически обрабатывает ошибки с лучшими digest'ами
         * 3. Скрытие ошибок может нарушить механизм кэширования Next.js
         */
        shouldRedactErrors: () => false
      }
    }
  })
}

let browserQueryClient: QueryClient | undefined = undefined

/**
 * Получает QueryClient для SSR
 * На сервере создает новый экземпляр для каждого запроса
 * На клиенте использует singleton паттерн
 */
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
