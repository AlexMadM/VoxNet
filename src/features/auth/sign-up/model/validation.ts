import { z } from 'zod/v4'

export type SignUpForm = z.infer<typeof SignUpSchema>

export const SignUpSchema = z
  .object({
    userName: z
      .string()
      .min(6, 'Minimum number of characters 6')
      .max(30, 'Maximum number of characters 30')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username can contain only Latin letters, numbers, underscore and hyphen'),
    email: z.email('The email must match the format example@example.com'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Maximum number of characters 20')
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/,
        'Password must contain a-z, A-Z,  ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _` { | } ~'
      ),
    confirmPassword: z.string().min(6, 'Password confirmation is required'),
    agree: z.boolean()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  })
