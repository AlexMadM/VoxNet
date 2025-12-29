import { Select } from './Select'
import { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Select>

const countries = [
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' }
]
const cities = [
  { value: 'london', label: 'London' },
  { value: 'new-york', label: 'New York' },
  { value: 'tokyo', label: 'Tokyo' },
  { value: 'paris', label: 'Paris' },
  { value: 'berlin', label: 'Berlin' },
  { value: 'sydney', label: 'Sydney' },
  { value: 'dubai', label: 'Dubai' }
]

export const WithValue: Story = {
  args: {
    label: 'Select your country',
    placeholder: 'Country',
    options: countries
    // value: ''
  }
}

export const CustomPlaceholder: Story = {
  args: {
    label: 'Select your city',
    placeholder: 'Сity',
    options: cities
    // value: ''
  }
}
