# AuthProvider - Провайдер Аутентификации

## Архитектура

### Компоненты

1. **AuthProvider** - основной провайдер контекста аутентификации
2. **OAuthHandler** - обработчик OAuth токенов из URL
3. **useAuth** - хук для доступа к контексту аутентификации

## Принципы улучшенной архитектуры

### ✅ Соблюдение SOLID

#### Single Responsibility Principle (SRP)

- **AuthProvider** отвечает только за предоставление данных пользователя через контекст
- **OAuthHandler** отвечает только за обработку OAuth токенов из URL
- **axios interceptors** отвечают за обновление токенов и обработку 401 ошибок

#### Open/Closed Principle (OCP)

- Провайдер расширяем через композицию (можно добавить дополнительные обработчики)
- Закрыт для модификации (не нужно менять AuthProvider для добавления новой логики)

### ✅ Соблюдение KISS (Keep It Simple, Stupid)

#### Было:

```tsx
// ❌ Сложная логика с побочными эффектами
const AuthProvider = ({ children }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams?.get('accessToken')

  useEffect(() => {
    if (token) {
      localStorage.setItem('accessToken', token)
      router.replace(window.location.pathname) // ⚠️ Опасно!
    }
  }, [token, router])

  const { data: user, isLoading, isError } = useMe()

  return <Auth.Provider value={{ user: user || null, isLoading, isError }}>{children}</Auth.Provider>
}
```

#### Стало:

```tsx
// ✅ Простая и понятная логика
const AuthProvider = ({ children }) => {
  const { data: user = null, isLoading, isError } = useMe()

  const value = { user, isLoading, isError }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

### ✅ Разделение ответственности

#### Проблемы старого подхода:

1. **Дублирование логики** - токены обрабатывались и в провайдере, и в axios interceptors
2. **Небезопасное использование** - `router.replace(window.location.pathname)` может вызвать проблемы
3. **Нарушение единственной ответственности** - провайдер делал слишком много

#### Новый подход:

- **AuthProvider** - только предоставление данных через контекст
- **OAuthHandler** - только обработка OAuth токенов
- **axios interceptors** - только работа с HTTP запросами

## Использование

### В корневом layout:

```tsx
import { AuthProvider, OAuthHandler } from '@/shared/lib'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          <AuthProvider>
            <OAuthHandler />
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
```

### В компонентах:

```tsx
import { useAuth } from '@/shared/lib'

export const UserProfile = () => {
  const { user, isLoading, isError } = useAuth()

  if (isLoading) return <Spinner />
  if (isError) return <ErrorMessage />

  return <div>Привет, {user?.userName}!</div>
}
```

## Преимущества улучшенной версии

### 1. Чистота кода

- ✅ Убрана лишняя логика из провайдера
- ✅ Каждый компонент делает только одну вещь
- ✅ Легко читать и понимать

### 2. Безопасность

- ✅ Правильная очистка URL через `URL API`
- ✅ Нет прямого доступа к `window.location.pathname`
- ✅ Разделение клиентской и серверной логики

### 3. Тестируемость

- ✅ Каждый компонент можно тестировать отдельно
- ✅ Нет скрытых зависимостей
- ✅ Предсказуемое поведение

### 4. Расширяемость

- ✅ Легко добавить новые обработчики
- ✅ Не нужно модифицировать существующий код
- ✅ Соблюдение принципа открытости/закрытости

### 5. Производительность

- ✅ React Query кэширует запросы (5 минут staleTime)
- ✅ Нет лишних ре-рендеров
- ✅ Оптимизированная работа с контекстом

## Удаленные элементы и причины

### ❌ Удален экспорт `AuthContext`

**Причина:** Нарушает инкапсуляцию. Доступ к контексту должен быть только через хук `useAuth`.

**Было:**

```tsx
export const AuthContext = Auth
// Где-то в коде:
const ctx = useContext(AuthContext) // ❌ Обход проверки
```

**Стало:**

```tsx
// Контекст приватный, доступен только через useAuth
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### ❌ Удалена логика обработки токенов из провайдера

**Причина:** Нарушает принцип единственной ответственности.

**Решение:** Вынесено в отдельный компонент `OAuthHandler`.

### ❌ Удалено использование `useSearchParams()` в OAuthHandler

**Причина:** Требует обёртки в Suspense, что усложняет структуру.

**Решение:** Прямое использование `window.location` с `URL API` для правильной очистки параметров.

**Преимущества:**

- ✅ Не требует Suspense boundary
- ✅ Работает синхронно на клиенте
- ✅ Проще в использовании

## Best Practices

1. **Всегда используйте `useAuth` для доступа к данным**

   ```tsx
   const { user } = useAuth() // ✅ Правильно
   const ctx = useContext(AuthContext) // ❌ Неправильно
   ```

2. **Не обрабатывайте токены вручную**

   ```tsx
   // ✅ OAuthHandler делает это автоматически
   // ❌ Не делайте так:
   localStorage.setItem('accessToken', token)
   ```

3. **Используйте guards для защиты маршрутов**

   ```tsx
   import { WithAuthGuard } from '@/shared/lib'

   export const ProtectedPage = WithAuthGuard(() => {
     return <div>Protected content</div>
   })
   ```

## Совместимость

- ✅ Next.js 14+ App Router
- ✅ React 18+
- ✅ TypeScript
- ✅ React Query (TanStack Query)
