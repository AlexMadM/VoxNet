import { EditPersonalDataForm } from './EditPersonalDataForm'
import { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof EditPersonalDataForm> = {
  title: 'features/EditPersonalDataForm',
  component: EditPersonalDataForm,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
