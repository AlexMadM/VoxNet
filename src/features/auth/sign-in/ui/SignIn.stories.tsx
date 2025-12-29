import type { StoryObj } from '@storybook/nextjs'
import { AuthContext } from '@/shared/lib'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useMemo, useState } from 'react'
import { SignInForm } from './SignInForm'

const meta = {
  title: 'Features/Auth/SignIn',
  component: SignInForm,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true
    }
  }
}

export default meta

type Story = StoryObj<typeof meta>

const QueryWrapper = ({ children }: PropsWithChildren) => {
  const [client] = useState(() => new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const MockAuthProvider = ({ children }: PropsWithChildren) => {
  const contextValue = useMemo(
    () => ({
      user: null,
      isLoading: false,
      isError: false
    }),
    []
  )
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const Default: Story = {
  render: () => (
    <QueryWrapper>
      <MockAuthProvider>
        <SignInForm />
      </MockAuthProvider>
    </QueryWrapper>
  ),
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/auth/signin',
        query: {}
      }
    }
  }
}
