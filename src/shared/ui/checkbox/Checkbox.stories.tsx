import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'
import { Checkbox } from '@/shared/ui'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Состояние чекбокса (отмечен/не отмечен)'
    },
    disabled: {
      control: 'boolean',
      description: 'Отключен ли чекбокс'
    },
    label: {
      control: 'text',
      description: 'Текст лейбла рядом с чекбоксом'
    },
    onCheckedChange: {
      action: 'checked changed',
      description: 'Обработчик изменения состояния'
    }
  },
  args: {
    onCheckedChange: fn()
  }
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

// Базовый чекбокс без лейбла
export const Default: Story = {
  args: {
    checked: false,
    disabled: false
  }
}

// Чекбокс с лейблом
export const WithLabel: Story = {
  args: {
    checked: false,
    disabled: false,
    label: 'Согласен с условиями'
  }
}

// Отмеченный чекбокс
export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
    label: 'Отмеченный чекбокс'
  }
}

// Отключенный чекбокс
export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
    label: 'Отключенный чекбокс'
  }
}

// Отключенный и отмеченный чекбокс
export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    label: 'Отключенный и отмеченный'
  }
}

// Чекбокс с длинным лейблом
export const LongLabel: Story = {
  args: {
    checked: false,
    disabled: false,
    label: 'Я согласен с условиями использования сервиса и политикой конфиденциальности'
  }
}

// Несколько чекбоксов в группе
export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Checkbox label="Первый пункт" checked={true} onCheckedChange={fn()} />
      <Checkbox label="Второй пункт" checked={false} onCheckedChange={fn()} />
      <Checkbox label="Третий пункт" checked={true} disabled onCheckedChange={fn()} />
      <Checkbox label="Четвертый пункт" checked={false} disabled onCheckedChange={fn()} />
    </div>
  )
}

// Интерактивный пример
export const Interactive: Story = {
  args: {
    label: 'Интерактивный чекбокс',
    checked: false,
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Попробуйте кликнуть на чекбокс или лейбл для изменения состояния'
      }
    }
  }
}
