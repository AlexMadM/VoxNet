import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { Textarea } from '@/shared/ui/textarea/Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Textarea>

// 1. Базовая стори (без label)
export const Default: Story = {
  args: {
    placeholder: 'Text-area',
    value: ''
  }
}

// 2. С лейблом (статичная)
export const WithLabel: Story = {
  args: {
    id: 'description', // ← добавь уникальный id
    label: 'Add publication descriptions',
    placeholder: 'Text-area',
    value: ''
  }
}

// 3. Интерактивная (можно печатать)
export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('')
    return <Textarea placeholder="Text-area" value={value} onChange={(e) => setValue(e.target.value)} />
  }
}
