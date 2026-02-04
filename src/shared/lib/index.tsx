export { WithAuthGuard } from './hoc/WithAuthGuard'
export { AuthProvider, useAuth } from './auth-provider/auth-provider'
export { OAuthHandler } from './auth-provider/oauth-handler'
export { useInfiniteScroll } from './hooks/useInfiniteScroll'

// Testing utilities (для Storybook и тестов)
export { AuthContext, MockAuthProvider } from './auth-provider/testing'

// export from constants
export { LEGAL_CONTENT } from './constants/legal-page-content'
export type { LegalPageType } from './constants/legal-page-content'
