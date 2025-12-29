import type { Meta, StoryObj } from '@storybook/nextjs'
import { AuthContext } from '@/shared/lib'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ComponentType, PropsWithChildren, useMemo, useState } from 'react'
import { DeletePost } from './DeletePost'
import type { User } from '@/entities/user'

const QueryWrapper = ({ children }: PropsWithChildren) => {
  const [client] = useState(() => new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const MockAuthProvider = ({ children, user }: PropsWithChildren<{ user: User | null }>) => {
  const contextValue = useMemo(
    () => ({
      user,
      isLoading: false,
      isError: false
    }),
    [user]
  )
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

const mockUser: User = {
  userId: 123,
  userName: 'testuser',
  email: 'test@example.com',
  isBlocked: false
}

const meta = {
  title: 'Features/DeletePost',
  component: DeletePost,
  tags: ['autodocs'],
  decorators: [
    (Story: ComponentType) => (
      <QueryWrapper>
        <MockAuthProvider user={mockUser}>
          <Story />
        </MockAuthProvider>
      </QueryWrapper>
    )
  ]
} satisfies Meta<typeof DeletePost>

export default meta

type Story = StoryObj<typeof meta>

export const DeletePostButton: Story = {
  args: {
    id: 2
  }
}
