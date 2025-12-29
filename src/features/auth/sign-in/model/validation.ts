import { z } from 'zod'

export type SignInForm = z.infer<typeof signInSchema>

// export const PASSWORD =
//    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/

export const signInSchema = z.object({
  email: z.email('The email must match the format example@example.com'),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
})
