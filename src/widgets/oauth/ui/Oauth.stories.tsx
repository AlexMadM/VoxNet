import type { Meta, StoryObj } from '@storybook/nextjs'
import { Oauth } from '@/widgets/oauth'

const meta = {
  title: 'Widgets/Oauth',
  component: Oauth,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof Oauth>

export const Default: Story = {}

export default meta
type Story = StoryObj<typeof meta>
