// EditPostForm.stories.tsx
import { EditPostForm } from './EditPostForm'
import { Meta } from '@storybook/nextjs'
import { EditPostButton } from '@/features/posts/edit-post'

const meta: Meta<typeof EditPostForm> = {
  title: 'Components/EditPostForm',
  component: EditPostForm
}

export default meta

export const Open = {
  args: {
    isOpen: true,
    onClose: () => {},
    postId: 1,
    userName: 'UserName',
    userAvatar: '/girl.png',
    postImage: '/img.png',
    initialDescription: ''
  }
}
// Кнопка
export const EditButton = {
  render: () => (
    <EditPostButton postId={2} userName="UserName" userAvatar="/girl.png" postImage="/img.png" initialDescription=" " />
  )
}
