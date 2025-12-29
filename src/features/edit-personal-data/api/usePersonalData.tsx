import { AxiosError } from 'axios'

import { useSuspenseQuery } from '@tanstack/react-query'
import { PersonalData, userApi } from '@/entities/user'
import { format, parseISO } from 'date-fns'
import { DATE_FORMAT } from '../model/lib/consts'

export const usePersonalData = () => {
  return useSuspenseQuery<PersonalData, AxiosError<{ statusCode: number }>>({
    queryKey: ['personal-data'],
    queryFn: userApi.getPersonalData,
    select: (data: PersonalData) => ({
      ...data,
      dateOfBirth: data.dateOfBirth ? format(parseISO(data.dateOfBirth), DATE_FORMAT) : ''
    })
  })
}
