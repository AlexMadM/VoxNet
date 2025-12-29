import type { Meta, StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { Input } from '@/shared/ui/input/Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search']
    },
    disabled: {
      control: 'boolean'
    },
    error: {
      control: 'text'
    }
  }
}

export default meta
type Story = StoryObj<typeof Input>

export const Email: Story = {
  args: {
    id: 'email-Input',
    type: 'email',
    placeholder: 'Epam@epam.com',
    label: 'Email'
  }
}

export const Password: Story = {
  args: {
    id: 'password-Input',
    type: 'password',
    placeholder: 'Epam@epam.com',
    label: 'Password'
  }
}

export const Search: Story = {
  render: (args) => {
    const [value, setValue] = useState('')

    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} onClear={() => setValue('')} />
  },
  args: {
    id: 'search-Input',
    type: 'search',
    placeholder: '_Input search',
    label: 'Search'
  }
}

export const WithError: Story = {
  args: {
    id: 'error-Input',
    type: 'text',
    placeholder: 'Enter text...',
    label: '_Input with Error',
    error: 'Error text'
  }
}

export const Disabled: Story = {
  args: {
    id: 'disabled-Input',
    type: 'text',
    placeholder: 'Disabled Input',
    label: 'Disabled Input',
    disabled: true
  }
}

export const WithoutLabel: Story = {
  args: {
    id: 'no-label-Input',
    type: 'text',
    placeholder: 'Input without label'
  }
}

export const PasswordWithError: Story = {
  args: {
    id: 'password-error',
    type: 'password',
    placeholder: 'Epam@epam.com',
    label: 'Password',
    error: 'Error text'
  }
}

export const DisabledWithValue: Story = {
  args: {
    id: 'disabled-value-Input',
    type: 'text',
    placeholder: 'Disabled with value',
    label: 'Disabled Input',
    disabled: true,
    value: 'Epam@epam.com'
  }
}

export const SearchWithError: Story = {
  render: (args) => {
    const [value, setValue] = useState('')

    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} onClear={() => setValue('')} />
  },
  args: {
    id: 'search-error',
    type: 'search',
    placeholder: 'Input search',
    label: 'Search',
    error: 'Error text'
  }
}
