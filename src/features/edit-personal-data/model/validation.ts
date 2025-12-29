import { z } from 'zod'

export const editPersonalDataSchema = z.object({
  userName: z.string().min(6, 'Minimum number of characters 6').max(30, 'Maximum number of characters 30'),
  firstName: z
    .string()
    .min(4, 'First name must be at least 4 characters')
    .regex(/^[A-Za-zА-Яа-яЁё\s]+$/, 'Only letters allowed'),
  lastName: z
    .string()
    .min(4, 'Last name must be at least 4 characters')
    .regex(/^[A-Za-zА-Яа-яЁё\s]+$/, 'Only letters allowed'), // ← добавить
  dateOfBirth: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in format MM/dd/yyyy')
    .refine((dateStr) => {
      if (!dateStr) return true // если пусто - ок

      const [month, day, year] = dateStr.split('/').map(Number)
      const birthDate = new Date(year, month - 1, day)
      const today = new Date()

      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      return age >= 13
    }, 'A user under 13 cannot create a profile. Privacy Policy')
    .optional(),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  aboutMe: z.string().max(500, 'About me cannot exceed 500 characters').optional()
})
export type EditPersonalDataFormValues = z.infer<typeof editPersonalDataSchema>
