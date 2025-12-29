import { StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EmailResending } from '@/pages/auth/EmailResending'

const meta = {
  title: 'Page/EmailResendingPage',
  component: EmailResending,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true
    }
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [client] = useState(() => new QueryClient())
    return (
      <QueryClientProvider client={client}>
        <EmailResending />
      </QueryClientProvider>
    )
  },
  parameters: {
    nextjs: {
      navigation: {
        query: {}
      }
    }
  }
}
