import type { Meta, StoryObj } from '@storybook/nextjs'

import { AlertDialog, AlertDescription, AlertCancel, AlertAction } from './AlertDialog'
import { Button, Typography } from '@/shared/ui'
import { useState } from 'react'

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs']
} satisfies Meta<typeof AlertDialog>

export default meta

type Story = StoryObj<typeof meta>

const Logout = () => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)

  return (
    <div>
      <Button variant={'textButton'} onClick={() => setIsAlertOpen(true)}>
        Logout
      </Button>

      <AlertDialog title={'Logout'} open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            justifyContent: 'center',
            gap: '18px'
          }}
        >
          <>
            <AlertDescription asChild style={{ textAlign: 'left', width: '100%' }}>
              <Typography variant={'regular_16'}>Are you sure to want logout?</Typography>
            </AlertDescription>
            <div style={{ display: 'flex', justifyContent: 'end', gap: '24px' }}>
              <AlertAction asChild>
                <Button variant={'outlined'}>Ok</Button>
              </AlertAction>
              <AlertCancel asChild>
                <Button style={{ minWidth: '96px' }}>Cancel</Button>
              </AlertCancel>
            </div>
          </>
        </div>
      </AlertDialog>
    </div>
  )
}
export const Alert: Story = {
  render: () => (
    <div>
      <Logout />
    </div>
  )
}
