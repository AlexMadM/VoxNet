import { Meta, StoryObj } from '@storybook/nextjs'
import { UnsubscribeAutoRenewal } from '@/features/cancel-auto-renewal'

const meta: Meta<typeof UnsubscribeAutoRenewal> = {
  title: 'UI/UnsubscribeAutoRenewal',
  component: UnsubscribeAutoRenewal,
  tags: ['autodocs'],
  args: {
    expireDate: '12.02.2022',
    nextPaymentDate: '13.02.2022'
  }
}

export default meta
type Story = StoryObj<typeof UnsubscribeAutoRenewal>

export const Default: Story = {} // ← одна история
