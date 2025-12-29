'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import s from './EditPersonalData.module.css'
import { Button, Card, Input, Select, Textarea } from '@/shared/ui'
import { EditPersonalDataFormValues, editPersonalDataSchema } from '../model/validation'
import { useUpdatePersonalData } from '../api/use-update-personal-data'
import { InputDate } from '@/shared/ui/input-date/InputDate'
import { PersonalDataRequest } from '@/entities/user/api/user-types'
import { usePersonalData } from '@/features/edit-personal-data/api/usePersonalData'
import { COUNTRIES, getCitiesByCountry } from '@/shared/data/countries'
import { AvatarFofSettings } from '@/widgets'
import { useState } from 'react'
import { AddProfilePhoto } from '@/features/addAndDeleteAvatarPhoto/ui/AddProfilePhoto'

export const EditPersonalDataForm = () => {
  const { data } = usePersonalData()
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false) // добавить это состояние
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    control
  } = useForm<EditPersonalDataFormValues>({
    resolver: zodResolver(editPersonalDataSchema),
    mode: 'onChange',
    defaultValues: {
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      country: data.country,
      city: data.city,
      aboutMe: data.aboutMe
    }
  })

  const { mutate: updateProfile, isPending } = useUpdatePersonalData()

  const countryOptions = COUNTRIES
  const selectedCountryCode = watch('country')
  const cityOptions = selectedCountryCode ? getCitiesByCountry(selectedCountryCode) : []

  const onSubmit = (data: EditPersonalDataFormValues) => {
    let isoDate = ''
    if (data.dateOfBirth) {
      const [month, day, year] = data.dateOfBirth.split('/')

      const date = new Date(
        Number(year),
        Number(month) - 1, // месяцы с 0
        Number(day),
        0,
        0,
        0,
        0
      )

      isoDate = date.toISOString()
    }

    const apiData: PersonalDataRequest = {
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: isoDate,
      country: data.country,
      city: data.city,
      aboutMe: data.aboutMe ?? ''
    }

    updateProfile(apiData)
  }

  return (
    <div className={s.container}>
      <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.formContent}>
          <div>
            <AvatarFofSettings src={data?.avatars?.[0]?.url} />
            <Button onClick={() => setIsAddPhotoModalOpen(true)}>Add photo profile</Button>
          </div>

          <div className={s.formFields}>
            {/* Username */}
            <div>
              <Input
                id="userName"
                label="Username*"
                type="text"
                {...register('userName')}
                className={s.formField}
                error={!!errors.userName}
              />
              {errors.userName && <span className={s.errorMessage}>{errors.userName.message}</span>}
            </div>

            {/* First Name */}
            <div>
              <Input
                id="firstName"
                label="First Name*"
                type="text"
                error={!!errors.firstName}
                {...register('firstName')}
                className={s.formField}
              />
              {errors.firstName && <span className={s.errorMessage}>{errors.firstName.message}</span>}
            </div>

            {/* Last Name */}
            <div>
              <Input
                id="lastName"
                label="Last Name*"
                type="text"
                error={!!errors.lastName}
                {...register('lastName')}
                className={s.formField}
              />
              {errors.lastName && <span className={s.errorMessage}>{errors.lastName.message}</span>}
            </div>

            {/* Date of Birth */}
            <div>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => <InputDate value={field.value} onChange={field.onChange} />}
              />
              {errors.dateOfBirth && <span className={s.errorMessage}>{errors.dateOfBirth.message}</span>}
            </div>

            {/* Country and City Selects */}
            <div className={s.selectsContainer}>
              {/* Country Select */}
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Select your country"
                    placeholder="Country"
                    options={countryOptions}
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val)
                      setValue('city', '')
                    }}
                  />
                )}
              />

              {/* City Select */}
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Select your city"
                    placeholder="City"
                    options={cityOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* About Me */}
            <Textarea
              label="About Me"
              placeholder="Text-area"
              {...register('aboutMe')}
              error={errors.aboutMe?.message}
              maxLength={500}
              className={s.formField}
            />
          </div>
        </div>

        <hr className={s.hr} />

        <Button type="submit" variant="primary" className={s.buttonform} disabled={!isValid || isPending}>
          {isPending ? 'Saving' : 'Save Changes'}
        </Button>
      </Card>
      <AddProfilePhoto open={isAddPhotoModalOpen} onOpenChange={setIsAddPhotoModalOpen} />
    </div>
  )
}
