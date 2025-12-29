import { PostCard } from '@/shared/ui/post'
import { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof PostCard> = {
  title: 'UI/PostCard',
  component: PostCard,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof PostCard>

//история для поста
export const Basic: Story = {
  args: {
    userName: 'UserName',
    avatar: '/girl.png' // Ваша иконка девочки из макета
  }
}
