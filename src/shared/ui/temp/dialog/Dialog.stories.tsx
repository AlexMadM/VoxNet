import type { Meta, StoryObj } from '@storybook/nextjs'

import { Dialog, DialogClose } from './Dialog'
import { Button, Typography } from '@/shared/ui'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs']
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const DialogWithTrigger: Story = {
  args: {
    trigger: <Button>Open dialog</Button>,
    title: 'Email sent'
  },
  render: (args) => (
    <Dialog {...args}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'end',
          justifyContent: 'center',
          gap: '18px'
        }}
      >
        <Typography variant={'regular_16'}>We have sent a link to confirm your email to epam@epam.com</Typography>

        <DialogClose asChild>
          <Button>OK</Button>
        </DialogClose>
      </div>
    </Dialog>
  )
}

export const DialogWithoutTrigger: Story = {
  args: {
    title: 'Email sent'
  },
  argTypes: {
    open: { control: 'boolean' }
  },
  render: (args) => (
    <Dialog {...args}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'end',
          justifyContent: 'center',
          gap: '18px'
        }}
      >
        <Typography variant={'regular_16'}>We have sent a link to confirm your email to epam@epam.com</Typography>

        <DialogClose asChild>
          <Button>OK</Button>
        </DialogClose>
      </div>
    </Dialog>
  )
}
