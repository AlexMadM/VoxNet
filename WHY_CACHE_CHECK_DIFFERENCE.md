# Почему без await проверяется кэш, а с await - нет?

## 🔑 Ключевое различие: Состояние запроса в dehydratedState

### С `await`: Данные уже в состоянии 'success'

```typescript
// prefetch-posts.ts С await
await queryClient.prefetchQuery({
  queryKey: ['post', 123],
  queryFn: () => postsApi.getPost(123)
})
// ⏳ Сервер ждет ответа от API
// ✅ Данные получены

dehydrate(queryClient)
// Результат:
{
  queries: [{
    queryKey: ['post', 123],
    state: {
      status: 'success',  // ✅ ЗАПРОС УЖЕ ВЫПОЛНЕН!
      data: { id: 123, description: "..." },
      dataUpdatedAt: 1234567890
    }
  }]
}
```

**Что происходит на клиенте:**

```typescript
// PostModal.tsx
const { data: post } = usePost(postId, { throwOnError: true })
```

**Внутри React Query (`useQuery`):**

```typescript
// React Query проверяет dehydratedState
const dehydratedQuery = dehydratedState.queries.find(q => q.queryKey === ['post', 123])

if (dehydratedQuery?.state.status === 'success') {
  // ✅ Запрос УЖЕ выполнен на сервере!
  // ✅ Данные УЖЕ есть в dehydratedState!
  // ❌ НЕ НУЖНО проверять кэш - данные уже гидратированы
  // ❌ НЕ НУЖНО выполнять queryFn - запрос уже выполнен
  
  // Просто используем данные из dehydratedState
  return {
    data: dehydratedQuery.state.data,
    status: 'success',
    isLoading: false
  }
}
```

**Результат:** React Query не проверяет кэш, потому что считает, что запрос уже выполнен на сервере.

---

### БЕЗ `await`: Данные в состоянии 'pending'

```typescript
// prefetch-posts.ts БЕЗ await
void queryClient.prefetchQuery({
  queryKey: ['post', 123],
  queryFn: () => postsApi.getPost(123)
})
// ⚡ Запрос запускается, но НЕ ЖДЕТСЯ

dehydrate(queryClient)
// Результат:
{
  queries: [{
    queryKey: ['post', 123],
    state: {
      status: 'pending',  // ⏳ ЗАПРОС ЕЩЕ НЕ ВЫПОЛНЕН!
      data: undefined,
      dataUpdatedAt: undefined
    }
  }]
}
```

**Что происходит на клиенте:**

```typescript
// PostModal.tsx
const { data: post } = usePost(postId, { throwOnError: true })
```

**Внутри React Query (`useQuery`):**

```typescript
// React Query проверяет dehydratedState
const dehydratedQuery = dehydratedState.queries.find(q => q.queryKey === ['post', 123])

if (dehydratedQuery?.state.status === 'pending') {
  // ⏳ Запрос ЕЩЕ НЕ выполнен!
  // ⏳ Нужно продолжить загрузку на клиенте
  
  // 🔍 ПЕРЕД выполнением queryFn React Query проверяет кэш:
  const cachedData = queryClient.getQueryData(['post', 123])
  
  if (cachedData) {
    // ✅ Данные есть в кэше!
    
    // Проверяем, свежие ли данные
    const isStale = Date.now() - cachedData.dataUpdatedAt > staleTime
    
    if (!isStale && refetchOnMount === false) {
      // ✅ Данные свежие и refetchOnMount: false
      // ✅ Используем данные из кэша БЕЗ запроса к API!
      return {
        data: cachedData.data,
        status: 'success',
        isLoading: false
      }
    }
  }
  
  // Если данных нет в кэше или они устарели:
  // Выполняем queryFn (запрос к API)
  return queryFn()
}
```

**Результат:** React Query проверяет кэш, потому что видит незавершенный запрос и должен решить, нужно ли делать новый запрос или использовать кэш.

---

## 📊 Сравнение логики React Query

### С `await` (status: 'success'):

```
useQuery(['post', 123])
  ↓
Проверка dehydratedState
  ↓
status === 'success' ✅
  ↓
Данные уже есть!
  ↓
❌ НЕ проверяет кэш
❌ НЕ выполняет queryFn
✅ Использует данные из dehydratedState
```

### БЕЗ `await` (status: 'pending'):

```
useQuery(['post', 123])
  ↓
Проверка dehydratedState
  ↓
status === 'pending' ⏳
  ↓
Запрос еще не выполнен
  ↓
🔍 Проверяет кэш клиента
  ↓
Данные есть в кэше? ✅
  ↓
Данные свежие? ✅ (staleTime: 2 минуты)
  ↓
refetchOnMount: false ✅
  ↓
✅ Использует данные из кэша
❌ НЕ выполняет queryFn (запрос к API не нужен)
```

---

## 💡 Почему так происходит?

### Принцип работы React Query:

1. **Если запрос уже выполнен (status: 'success')**:
   - React Query считает, что данные уже получены
   - Не нужно проверять кэш - данные уже есть
   - Не нужно выполнять queryFn - запрос уже выполнен

2. **Если запрос еще не выполнен (status: 'pending')**:
   - React Query должен продолжить загрузку
   - **ПЕРЕД выполнением queryFn** проверяет кэш
   - Если данные есть и свежие → использует кэш
   - Если данных нет или устарели → выполняет queryFn

### Настройки, которые влияют на проверку кэша:

```typescript
// usePost.ts
staleTime: 2 * 60 * 1000, // 2 минуты - данные считаются свежими
refetchOnMount: false,    // Не перезагружает, если данные свежие
```

**БЕЗ `await`:**
- React Query видит pending запрос
- Проверяет кэш перед выполнением queryFn
- Если данные свежие (staleTime) → использует кэш
- Если `refetchOnMount: false` → не делает новый запрос

**С `await`:**
- React Query видит success запрос
- Считает, что запрос уже выполнен
- Не проверяет кэш (данные уже есть)
- Но сервер УЖЕ сделал запрос к API!

---

## 🎯 Вывод

**С `await`:**
- ❌ React Query не проверяет кэш, потому что данные уже в dehydratedState со статусом 'success'
- ❌ Сервер УЖЕ сделал запрос к API
- ❌ Кэш клиента не используется

**БЕЗ `await`:**
- ✅ React Query проверяет кэш, потому что данные в dehydratedState со статусом 'pending'
- ✅ Если данные свежие в кэше → использует кэш
- ✅ Запрос к API не выполняется, если данные в кэше свежие

**Ключевой момент:** React Query проверяет кэш только когда видит незавершенный запрос (pending). Если запрос уже выполнен (success), React Query не проверяет кэш, потому что считает, что данные уже получены.

