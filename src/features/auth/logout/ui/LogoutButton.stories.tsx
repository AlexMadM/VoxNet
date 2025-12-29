import type { Meta, StoryObj } from '@storybook/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LogoutButton } from './LogoutButton'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    },
    mutations: {
      retry: false
    }
  }
})

const meta = {
  title: 'Features/Auth/LogoutButton',
  component: LogoutButton,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
      navigation: {
        push: () => console.log('Navigation: push called')
      }
    }
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    )
  ],
  tags: ['autodocs']
} satisfies Meta<typeof LogoutButton>

export default meta
type Story = StoryObj<typeof meta>

export const Both: Story = {
  args: {
    variant: 'both'
  }
}

export const IconOnly: Story = {
  args: {
    variant: 'icon'
  }
}

export const TextOnly: Story = {
  args: {
    variant: 'text'
  }
}
