import { ConfirmPage } from '@/pages/auth/confirm'
import { StoryObj } from '@storybook/nextjs'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const meta = {
  title: 'Page/ConfirmPage',
  component: ConfirmPage,
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
        <ConfirmPage />
      </QueryClientProvider>
    )
  },
  parameters: {
    nextjs: {
      navigation: {
        // pathname: '/auth/signin',
        query: {}
      }
    }
  }
}
