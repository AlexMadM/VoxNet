import type { StoryObj } from '@storybook/nextjs'
import { MockAuthProvider } from '@/shared/lib'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ComponentType, PropsWithChildren, useState } from 'react'
import DropMenu from '@/shared/ui/dropdown/DropMenu'
import type { User } from '@/entities/user'

const QueryWrapper = ({ children }: PropsWithChildren) => {
  const [client] = useState(() => new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const mockUser: User = {
  userId: 123,
  userName: 'testuser',
  email: 'test@example.com',
  isBlocked: false
}

const meta = {
  title: 'UI Components',
  component: DropMenu,
  parameters: {
    layout: 'centered'
  }
}

export default meta

type Story = StoryObj<typeof meta>

// Story для своей записи (показывает Edit и Delete)
export const MyPost: Story = {
  decorators: [
    (Story: ComponentType) => (
      <QueryWrapper>
        <MockAuthProvider user={mockUser}>
          <Story />
        </MockAuthProvider>
      </QueryWrapper>
    )
  ],
  args: {
    ownerId: 123,
    currentUserId: 123,
    onEdit: () => console.log('Edit clicked'),
    onDelete: () => console.log('Delete clicked')
  }
}

// Story для чужой записи (показывает Follow/Unfollow)
export const OtherUserPost: Story = {
  decorators: [
    (Story: ComponentType) => (
      <QueryWrapper>
        <MockAuthProvider user={mockUser}>
          <Story />
        </MockAuthProvider>
      </QueryWrapper>
    )
  ],
  args: {
    ownerId: 456,
    currentUserId: 123,
    onFollow: () => console.log('Follow clicked'),
    onUnfollow: () => console.log('Unfollow clicked')
  }
}
