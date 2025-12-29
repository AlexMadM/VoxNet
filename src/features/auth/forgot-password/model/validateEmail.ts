import { z } from 'zod'

// ✔ Схема для формы с капчей
export const EmailSchema = z.object({
  email: z.string().email('Incorrect email address')
})

export type ForgotPasswordInputs = z.infer<typeof EmailSchema>
