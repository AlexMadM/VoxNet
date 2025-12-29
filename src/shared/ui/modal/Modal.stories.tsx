import type { StoryObj } from '@storybook/nextjs'
import type { ReactElement } from 'react'
import { Button } from '@/shared/ui'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './Modal'

const centeredDecorator = (Story: () => ReactElement) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 0
    }}
  >
    <Story />
  </div>
)

const meta = {
  title: 'Components/Modal',
  component: Dialog,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [centeredDecorator]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultOpen: true
  },
  render: (args) => (
    <div>
      <Dialog {...args}>
        <DialogTrigger asChild>
          <Button variant="primary">Открыть модалку</Button>
        </DialogTrigger>
        <DialogContent title="Заголовок окна">
          <p>Основной контент модалки располагается здесь.</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const WithoutHeader: Story = {
  args: {
    defaultOpen: true
  },
  render: (args) => (
    <div>
      <Dialog {...args}>
        <DialogTrigger asChild>
          <Button variant="primary">Открыть модалку</Button>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <div style={{ marginTop: '24px', marginBottom: '24px' }}>
            <p>
              Основной контент здесь.Без Header, ее можно использовать там где у нас модалки с фото:посты,комментарии и
              т.д.{' '}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <DialogClose asChild>
              <Button>Закрыть</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
