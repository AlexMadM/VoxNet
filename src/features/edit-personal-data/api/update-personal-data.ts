//  для пользователя  при редактирования  своих даных в форме
import { api } from '@/shared/api'
import { PersonalDataRequest } from '@/entities/user/api/user-types'

export const updatePersonalData = async (data: PersonalDataRequest): Promise<void> => {
  await api.put('/users/profile', data)
}
