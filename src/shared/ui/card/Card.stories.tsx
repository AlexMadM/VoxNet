import { Card } from './Card'
import { Meta, StoryObj } from '@storybook/nextjs'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered'
  },
  args: {
    style: {
      padding: '1rem 2rem'
    }
  },

  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'main', 'aside']
    }
  }
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// Базовая история
export const Default: Story = {
  args: {
    children: 'Это содержимое карточки по умолчанию'
  }
}

// Карточка как секция
export const AsSection: Story = {
  args: {
    as: 'section',
    children: (
      <div>
        <h3>Заголовок секции</h3>
        <p>Это карточка, отрендеренная как HTML-элемент section</p>
      </div>
    )
  }
}

// Карточка с пользовательским контентом
export const WithCustomContent: Story = {
  args: {
    children: (
      <div style={{ padding: '16px' }}>
        <h2 style={{ margin: '0 0 12px 0' }}>Заголовок карточки</h2>
        <p style={{ margin: 0, color: '#666' }}>Это карточка с более сложным содержимым, включая заголовок и текст.</p>
        <button style={{ marginTop: '12px', padding: '8px 16px' }}>Кнопка внутри карточки</button>
      </div>
    )
  }
}

export const WithAdditionalProps: Story = {
  args: {
    style: {
      ...meta.args.style,
      width: '300px',
      backgroundColor: '#f0f8ff',
      border: '2px solid #007acc',
      color: 'yellowgreen'
    },
    children: 'Карточка с кастомными стилями через пропсы'
  }
}
