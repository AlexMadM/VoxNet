// Простая валидация пароля использую библиотеку zod для валидации

import { z } from 'zod'

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must be no more than 20 characters'),
    password_confirmation: z.string()
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'The passwords must match',
    path: ['password_confirmation']
  })

export type CreatePasswordInput = z.infer<typeof passwordSchema>
