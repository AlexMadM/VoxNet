import type { Meta, StoryObj } from '@storybook/nextjs'
import { InputDate } from './InputDate'

const meta = {
  title: 'Components/InputDate',
  component: InputDate,

  tags: ['autodocs']
} satisfies Meta<typeof InputDate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
