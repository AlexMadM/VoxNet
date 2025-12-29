import { z } from 'zod'

// ТОЛЬКО ОДНА схема — для поля "Описание поста"
export const postDescriptionSchema = z.string().min(10, 'Минимум 10 символов').max(500, 'Максимум 500 символов')

// Схема для ВСЕЙ формы редактирования поста
export const editPostFormSchema = z.object({
  description: postDescriptionSchema
})

// Тип для данных формы (опционально)
export type EditPostFormValues = z.infer<typeof editPostFormSchema>
