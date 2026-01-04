# Почему с await данные НЕ сохраняются в кэш клиента при повторных открытиях

## Механизм работы с await

### Первое открытие поста (postId = 123):

1. **Сервер (SSR):**
   ```typescript
   // Создается НОВЫЙ QueryClient на сервере (строка 72-73 get-query-client.ts)
   const queryClient = getQueryClient() // Новый экземпляр!
   
   // Запрос ждется на сервере
   await queryClient.prefetchQuery({
     queryKey: ['post', 123],
     queryFn: () => postsApi.getPost(123) // Запрос к API
   })
   
   // Данные загружены, дегидратируются
   const dehydratedState = dehydrate(queryClient)
   // dehydratedState = { queries: [{ queryKey: ['post', 123], state: { status: 'success', data: {...} } }] }
   ```

2. **Клиент (гидратация):**
   ```typescript
   <HydrationBoundary state={dehydratedState}>
     <PostModal postId={123} />
   </HydrationBoundary>
   ```
   - `HydrationBoundary` получает `dehydratedState` с данными
   - Данные **гидратируются** в клиентский `QueryClient` (singleton, строка 79-80)
   - Клиентский кэш: `{ ['post', 123]: { data: {...}, status: 'success' } }`
   - ✅ Данные теперь в кэше клиента!

### Второе открытие того же поста (postId = 123):

1. **Сервер (SSR) - ПРОБЛЕМА ЗДЕСЬ:**
   ```typescript
   // Создается ЕЩЕ ОДИН НОВЫЙ QueryClient на сервере!
   const queryClient = getQueryClient() // НОВЫЙ экземпляр, БЕЗ кэша!
   
   // Серверный QueryClient НЕ ЗНАЕТ о кэше клиента!
   // Он пустой: { queries: [] }
   
   // Запрос снова ждется на сервере
   await queryClient.prefetchQuery({
     queryKey: ['post', 123],
     queryFn: () => postsApi.getPost(123) // ❌ НОВЫЙ запрос к API!
   })
   
   // Данные снова загружаются с сервера
   const dehydratedState = dehydrate(queryClient)
   ```

2. **Клиент (гидратация):**
   ```typescript
   <HydrationBoundary state={dehydratedState}>
     <PostModal postId={123} />
   </HydrationBoundary>
   ```
   - `HydrationBoundary` получает новые данные с сервера
   - Данные гидратируются в клиентский `QueryClient`
   - ❌ Но клиентский кэш УЖЕ БЫЛ перезаписан новыми данными с сервера
   - ❌ Кэш клиента не используется, потому что сервер УЖЕ загрузил данные

## Почему кэш клиента не используется?

### Проблема 1: Серверный QueryClient изолирован
```typescript
// get-query-client.ts, строка 70-73
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient() // ❌ Каждый раз НОВЫЙ экземпляр!
  }
}
```

**Каждый серверный запрос = новый QueryClient = пустой кэш**

### Проблема 2: Next.js делает новый серверный запрос
- При навигации на `/profile/1/123` Next.js делает новый SSR запрос
- Новый SSR запрос = новый серверный компонент = новый `getQueryClient()`
- Серверный `QueryClient` не знает о кэше клиента

### Проблема 3: HydrationBoundary перезаписывает кэш
- `HydrationBoundary` всегда гидратирует данные из `dehydratedState`
- Если сервер загрузил данные, они гидратируются в клиентский кэш
- Клиентский кэш перезаписывается, даже если данные уже были там

## Механизм работы БЕЗ await

### Первое открытие поста (postId = 123):

1. **Сервер (SSR):**
   ```typescript
   const queryClient = getQueryClient() // Новый экземпляр
   
   // Запрос НЕ ждется
   void queryClient.prefetchQuery({
     queryKey: ['post', 123],
     queryFn: () => postsApi.getPost(123) // Запускается, но не ждется
   })
   
   // Запрос в pending состоянии
   const dehydratedState = dehydrate(queryClient)
   // dehydratedState = { queries: [{ queryKey: ['post', 123], state: { status: 'pending' } }] }
   ```

2. **Клиент (гидратация):**
   ```typescript
   <HydrationBoundary state={dehydratedState}>
     <PostModal postId={123} />
   </HydrationBoundary>
   ```
   - `HydrationBoundary` получает `dehydratedState` с pending запросами
   - Pending запросы гидратируются в клиентский `QueryClient`
   - Клиентский `QueryClient` **продолжает загрузку** данных
   - После загрузки: `{ ['post', 123]: { data: {...}, status: 'success' } }`
   - ✅ Данные теперь в кэше клиента!

### Второе открытие того же поста (postId = 123):

1. **Сервер (SSR):**
   ```typescript
   const queryClient = getQueryClient() // Новый экземпляр
   
   // Запрос НЕ ждется
   void queryClient.prefetchQuery({
     queryKey: ['post', 123],
     queryFn: () => postsApi.getPost(123) // Запускается, но не ждется
   })
   
   // Запрос в pending состоянии
   const dehydratedState = dehydrate(queryClient)
   ```

2. **Клиент (гидратация) - КЛЮЧЕВОЙ МОМЕНТ:**
   ```typescript
   <HydrationBoundary state={dehydratedState}>
     <PostModal postId={123} />
   </HydrationBoundary>
   ```
   
   **В компоненте PostModal:**
   ```typescript
   const { data } = usePost(123) // useQuery с queryKey: ['post', 123]
   ```
   
   **React Query проверяет:**
   ```typescript
   // 1. Есть ли данные в кэше клиента?
   const cachedData = queryClient.getQueryData(['post', 123])
   // ✅ ДА! Данные есть: { data: {...}, status: 'success' }
   
   // 2. Данные свежие? (staleTime: 2 минуты)
   const isStale = Date.now() - cachedData.dataUpdatedAt > 2 * 60 * 1000
   // ✅ НЕТ, данные свежие (прошло меньше 2 минут)
   
   // 3. refetchOnMount: false (из глобальных настроек)
   // ✅ Не нужно перезагружать
   
   // РЕЗУЛЬТАТ: Используются данные из кэша!
   return cachedData // ✅ БЕЗ запроса к API!
   ```

## Сравнение

| Аспект | С await | Без await |
|-------|---------|-----------|
| **TTFB** | Медленнее (~500ms) | Быстрее (~50ms) |
| **Данные в HTML** | ✅ Да | ❌ Нет (pending) |
| **Кэш клиента (1-й раз)** | ✅ Сохраняется | ✅ Сохраняется |
| **Кэш клиента (2-й раз)** | ❌ НЕ используется | ✅ Используется |
| **Запросы к API (2-й раз)** | ❌ Всегда новый запрос | ✅ Используется кэш |
| **Почему?** | Сервер всегда загружает данные | Клиент проверяет кэш перед запросом |

## Вывод

**С await:**
- Сервер всегда загружает данные перед отправкой HTML
- Клиентский кэш перезаписывается данными с сервера
- Кэш клиента не используется, потому что сервер уже загрузил данные

**Без await:**
- Сервер быстро отдает HTML с pending запросами
- Клиент продолжает загрузку и сохраняет в кэш
- При повторном открытии клиент проверяет кэш и использует его
- Кэш клиента работает правильно благодаря `staleTime` и `refetchOnMount: false`

---

## ✅ Решение: Можно ли сделать с await то же самое?

**ДА! Можно использовать Next.js кэширование через `unstable_cache`**

### Решение 1: Использовать `unstable_cache` (Рекомендуется)

Это позволит кэшировать данные на уровне Next.js, и при повторных запросах данные будут браться из кэша Next.js, а не делать новый запрос к API.

**Как это работает:**

```typescript
import { unstable_cache } from 'next/cache'

export async function prefetchPostWithComments(postId: number, pageSize: number = 6) {
  const queryClient = getQueryClient()

  // Используем unstable_cache для кэширования на уровне Next.js
  const getCachedPost = unstable_cache(
    async (id: number) => {
      return await queryClient.prefetchQuery({
        queryKey: ['post', id],
        queryFn: () => postsApi.getPost(id),
        staleTime: STALE_TIME
      })
    },
    ['post'], // Ключ кэша
    {
      revalidate: 120, // Кэш на 2 минуты (120 секунд)
      tags: [`post-${postId}`] // Теги для инвалидации
    }
  )

  const getCachedComments = unstable_cache(
    async (id: number, size: number) => {
      return await queryClient.prefetchQuery({
        queryKey: ['comments', id, size],
        queryFn: () => postsApi.getComments({ postId: id, pageSize: size }),
        staleTime: STALE_TIME
      })
    },
    ['comments'],
    {
      revalidate: 120,
      tags: [`comments-${postId}`]
    }
  )

  // Запросы ждутся, но данные берутся из кэша Next.js при повторных запросах
  await Promise.allSettled([
    getCachedPost(postId),
    getCachedComments(postId, pageSize)
  ])

  return dehydrate(queryClient)
}
```

**Преимущества:**
- ✅ Данные в HTML (SSR)
- ✅ Кэш на уровне Next.js (быстро при повторных запросах)
- ✅ Не нужно делать новый запрос к API при повторных открытиях
- ✅ Работает как с await, так и без него

**Недостатки:**
- ⚠️ Нужно обновить код для использования `unstable_cache`
- ⚠️ Кэш Next.js отделен от кэша React Query

### Решение 2: Гибридный подход (Лучшее решение)

Комбинируем оба подхода - используем кэш Next.js для SSR и кэш React Query для клиента:

```typescript
export async function prefetchPostWithComments(postId: number, pageSize: number = 6) {
  const queryClient = getQueryClient()

  // Проверяем, есть ли данные в кэше Next.js
  const cachedPost = await unstable_cache(
    async () => postsApi.getPost(postId),
    [`post-${postId}`],
    { revalidate: 120 }
  )()

  const cachedComments = await unstable_cache(
    async () => postsApi.getComments({ postId, pageSize }),
    [`comments-${postId}-${pageSize}`],
    { revalidate: 120 }
  )()

  // Устанавливаем данные в QueryClient из кэша Next.js
  queryClient.setQueryData(['post', postId], cachedPost)
  queryClient.setQueryData(['comments', postId, pageSize], cachedComments)

  return dehydrate(queryClient)
}
```

**Преимущества:**
- ✅ Данные в HTML (SSR)
- ✅ Кэш Next.js для быстрых повторных запросов
- ✅ Кэш React Query для клиента
- ✅ Лучшее из обоих миров

### Решение 3: Условная гидратация (Сложнее)

Проверять на клиенте, есть ли данные в кэше, и не гидратировать, если данные уже есть:

```typescript
// На клиенте
'use client'
import { useQueryClient } from '@tanstack/react-query'

export function PostPageClient({ postId, dehydratedState }) {
  const queryClient = useQueryClient()
  
  // Проверяем, есть ли данные в кэше
  const cachedData = queryClient.getQueryData(['post', postId])
  
  // Если данные есть и свежие, не используем HydrationBoundary
  if (cachedData && Date.now() - cachedData.dataUpdatedAt < 2 * 60 * 1000) {
    return <PostModal postId={postId} />
  }
  
  // Иначе гидратируем данные с сервера
  return (
    <HydrationBoundary state={dehydratedState}>
      <PostModal postId={postId} />
    </HydrationBoundary>
  )
}
```

**Недостатки:**
- ⚠️ Сложнее в реализации
- ⚠️ Нужно дублировать логику проверки кэша

## Рекомендация

**Использовать Решение 1 или 2** - `unstable_cache` от Next.js. Это стандартный способ кэширования данных в Next.js App Router и позволит получить лучшее из обоих подходов:
- Данные в HTML (SSR)
- Быстрые повторные запросы благодаря кэшу Next.js
- Не нужно делать новый запрос к API при повторных открытиях

