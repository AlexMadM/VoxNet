export const ROUTES = {
  HOME: '/',

  AUTH: {
    SIGN_IN: '/sign-in',
    SIGN_UP: '/sign-up',
    FORGOT_PASSWORD: '/forgot-password',
    CREATE_NEW_PASSWORD: '/create-password',
    CONFIRM_REGISTRATION: '/confirm-registration',
    EMAIL_RESENDING: '/email-resending'
  },

  APP: {
    USER_PROFILE: (userId: number) => `/profile/${userId}`,
    SETTINGS: {
      PART: (part: SettingsPart = SETTINGS_PART.INFO) => `/settings?part=${part}`
    },
    CREATE_POST: '/create',
    MESSENGER: '/messenger',
    SEARCH: '/search',
    STATISTICS: '/statistics',
    FAVORITES: '/favorites'
  },
  LEGAL: {
    TERMS_OF_SERVICE: '/terms-of-service',
    PRIVACY_POLICY: '/privacy-policy'
  }
} as const

export const SETTINGS_PART = {
  INFO: 'info',
  DEVICES: 'devices',
  SUBSCRIPTIONS: 'subscriptions',
  PAYMENTS: 'payments'
} as const

export type SettingsPart = (typeof SETTINGS_PART)[keyof typeof SETTINGS_PART]
