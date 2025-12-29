import { z } from 'zod/v4'

export type EmailResendingForm = z.infer<typeof EmailResendingSchema>

export const EmailResendingSchema = z.object({
  email: z.email('The email must match the format example@example.com')
})
