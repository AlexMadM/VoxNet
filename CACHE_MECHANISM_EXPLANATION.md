# Почему с await каждый раз новый запрос, а без await используется кэш клиента

## 🔑 Ключевое различие: Серверный и Клиентский QueryClient

### Серверный QueryClient (изолирован)

```typescript
// get-query-client.ts, строки 70-73
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient() // ❌ КАЖДЫЙ РАЗ НОВЫЙ ЭКЗЕМПЛЯР!
  }
}
```

**Важно:** Каждый серверный запрос = новый `QueryClient` = пустой кэш!

### Клиентский QueryClient (singleton)

```typescript
// get-query-client.ts, строки 75-81
else {
  // Browser: make a new query client if we don't already have one
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient // ✅ ОДИН И ТОТ ЖЕ ЭКЗЕМПЛЯР!
}
```

**Важно:** Один `QueryClient` на весь сеанс браузера = кэш сохраняется между навигациями!

---

## 📊 Сценарий 1: С `await` (каждый раз новый запрос)

### Первое открытие поста (postId = 123):

```
1. Пользователь открывает /profile/1/123
   ↓
2. Next.js вызывает Server Component (page.tsx)
   ↓
3. prefetchPostWithComments(123) вызывается на СЕРВЕРЕ
   ↓
4. getQueryClient() → создает НОВЫЙ QueryClient (пустой кэш)
   ↓
5. await queryClient.prefetchQuery(['post', 123])
   ↓
6. ⏳ СЕРВЕР ЖДЕТ ответа от API (~500ms)
   ↓
7. ✅ Данные получены: { id: 123, description: "..." }
   ↓
8. dehydrate(queryClient) → { queries: [{ queryKey: ['post', 123], state: { status: 'success', data: {...} } }] }
   ↓
9. HTML отправляется клиенту С ДАННЫМИ ВНУТРИ
   ↓
10. HydrationBoundary гидратирует данные в КЛИЕНТСКИЙ QueryClient
    ↓
11. Клиентский кэш: { ['post', 123]: { data: {...}, status: 'success' } }
    ✅ Данные теперь в кэше клиента!
```

### Второе открытие того же поста (postId = 123):

```
1. Пользователь снова открывает /profile/1/123
   ↓
2. Next.js вызывает Server Component (page.tsx) ЗАНОВО
   ↓
3. prefetchPostWithComments(123) вызывается на СЕРВЕРЕ ЗАНОВО
   ↓
4. getQueryClient() → создает ЕЩЕ ОДИН НОВЫЙ QueryClient (ПУСТОЙ!)
   ↓
   ❌ ПРОБЛЕМА: Серверный QueryClient НЕ ЗНАЕТ о кэше клиента!
   ↓
5. await queryClient.prefetchQuery(['post', 123])
   ↓
6. ⏳ СЕРВЕР СНОВА ЖДЕТ ответа от API (~500ms)
   ↓
   ❌ НОВЫЙ ЗАПРОС К API, даже если данные уже в кэше клиента!
   ↓
7. ✅ Данные получены снова: { id: 123, description: "..." }
   ↓
8. dehydrate(queryClient) → новые данные
   ↓
9. HTML отправляется клиенту С НОВЫМИ ДАННЫМИ
   ↓
10. HydrationBoundary гидратирует НОВЫЕ данные в клиентский QueryClient
    ↓
11. ❌ Клиентский кэш ПЕРЕЗАПИСАН новыми данными с сервера
    ❌ Кэш клиента НЕ ИСПОЛЬЗОВАЛСЯ, потому что сервер УЖЕ загрузил данные
```

**Почему кэш клиента не используется?**
- Серверный `QueryClient` изолирован от клиентского
- Сервер ждет загрузки данных (`await`) перед отправкой HTML
- Клиент получает HTML с данными, поэтому `usePost` на клиенте не проверяет кэш

---

## 📊 Сценарий 2: БЕЗ `await` (используется кэш клиента)

### Первое открытие поста (postId = 123):

```
1. Пользователь открывает /profile/1/123
   ↓
2. Next.js вызывает Server Component (page.tsx)
   ↓
3. prefetchPostWithComments(123) вызывается на СЕРВЕРЕ
   ↓
4. getQueryClient() → создает НОВЫЙ QueryClient (пустой кэш)
   ↓
5. void queryClient.prefetchQuery(['post', 123]) // БЕЗ await!
   ↓
6. ⚡ Запрос запускается, но НЕ ЖДЕТСЯ
   ↓
7. dehydrate(queryClient) → { queries: [{ queryKey: ['post', 123], state: { status: 'pending' } }] }
   ↓
8. HTML отправляется клиенту БЫСТРО (низкий TTFB ~50ms)
   ↓
9. HydrationBoundary гидратирует PENDING запросы в клиентский QueryClient
   ↓
10. Клиентский QueryClient ПРОДОЛЖАЕТ загрузку данных
    ↓
11. ⏳ Показывается скелетон (loading state)
    ↓
12. ✅ Данные загружены: { id: 123, description: "..." }
    ↓
13. Клиентский кэш: { ['post', 123]: { data: {...}, status: 'success' } }
    ✅ Данные теперь в кэше клиента!
```

### Второе открытие того же поста (postId = 123):

```
1. Пользователь снова открывает /profile/1/123
   ↓
2. Next.js вызывает Server Component (page.tsx) ЗАНОВО
   ↓
3. prefetchPostWithComments(123) вызывается на СЕРВЕРЕ ЗАНОВО
   ↓
4. getQueryClient() → создает ЕЩЕ ОДИН НОВЫЙ QueryClient (ПУСТОЙ!)
   ↓
5. void queryClient.prefetchQuery(['post', 123]) // БЕЗ await!
   ↓
6. dehydrate(queryClient) → { queries: [{ queryKey: ['post', 123], state: { status: 'pending' } }] }
   ↓
7. HTML отправляется клиенту БЫСТРО (низкий TTFB ~50ms)
   ↓
8. HydrationBoundary гидратирует PENDING запросы в клиентский QueryClient
   ↓
9. PostModal рендерится на клиенте
   ↓
10. usePost(postId, { throwOnError: true }) вызывается
    ↓
11. 🔍 React Query проверяет кэш клиента:
    ```typescript
    const cachedData = queryClient.getQueryData(['post', 123])
    // ✅ ДА! Данные есть: { data: {...}, status: 'success' }
    
    // Проверяет, свежие ли данные (staleTime: 2 минуты)
    const isStale = Date.now() - cachedData.dataUpdatedAt > 2 * 60 * 1000
    // ✅ НЕТ, данные свежие (прошло меньше 2 минут)
    
    // refetchOnMount: false (из глобальных настроек)
    // ✅ Не нужно перезагружать
    ```
    ↓
12. ✅ Используются данные из кэша БЕЗ запроса к API!
    ✅ Пост показывается МГНОВЕННО!
```

**Почему кэш клиента используется?**
- Сервер быстро отправляет HTML с pending запросами
- Клиентский `QueryClient` проверяет кэш перед выполнением запроса
- Если данные свежие (staleTime: 2 минуты), используется кэш
- Запрос к API не выполняется!

---

## 🔄 Сравнение потоков данных

### С `await`:
```
Сервер → API → Данные → HTML → Клиент → usePost (данные уже есть)
                                    ↓
                              ❌ Кэш не проверяется
```

### БЕЗ `await`:
```
Сервер → HTML (pending) → Клиент → usePost → Проверка кэша
                                              ↓
                                    ✅ Данные из кэша!
                                    ❌ Запрос к API не нужен
```

---

## 💡 Почему `usePost` на клиенте использует кэш?

```typescript
// usePost.ts, строки 14-24
export const usePost = (postId: number, options?: ...) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getPost(postId),
    staleTime: 2 * 60 * 1000, // 2 минуты
    refetchOnMount: false, // Не перезагружает, если данные свежие
    ...options
  })
}
```

**React Query автоматически:**
1. Проверяет кэш перед выполнением `queryFn`
2. Если данные есть и свежие (staleTime) → использует кэш
3. Если данных нет или устарели → выполняет `queryFn` (запрос к API)

**С `await`:**
- Данные уже в HTML → `usePost` не проверяет кэш (данные уже есть)
- Но сервер УЖЕ сделал запрос к API

**БЕЗ `await`:**
- Данные в pending → `usePost` проверяет кэш
- Если данные свежие → использует кэш, запрос к API не выполняется!

---

## ✅ Вывод

**С `await`:**
- ❌ Сервер всегда делает новый запрос к API
- ❌ Кэш клиента не используется
- ✅ Данные в HTML (быстрый первый рендер)
- ⏳ Медленный TTFB (~500ms)

**БЕЗ `await`:**
- ✅ Кэш клиента используется при повторных открытиях
- ✅ Быстрый TTFB (~50ms)
- ✅ Нет лишних запросов к API
- ⚠️ Данные не в HTML (показывается скелетон)

**Рекомендация:** Используйте БЕЗ `await` для оптимизации повторных открытий и уменьшения нагрузки на API.

