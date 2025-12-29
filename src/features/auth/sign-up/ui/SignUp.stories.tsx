import type { StoryObj } from '@storybook/nextjs'
import { SignUp } from '@/features/auth/sign-up/ui/SignUp'

const meta = {
  title: 'Components/SignUp',
  component: SignUp,
  parameters: {
    layout: 'centered'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isLoading: false,
    error: null
    // onSubmit: async (data) => {
    //   console.log('Форма отправлена:', data)
    //   return Promise.resolve({ statusCode: 204 })
    // }
  }
}
