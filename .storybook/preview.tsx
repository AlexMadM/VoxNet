import type { Preview } from '@storybook/nextjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { color } from 'storybook/theming'
import '@/app/ui/styles/index.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: color
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={new QueryClient()}>
        <Story />
      </QueryClientProvider>
    )
  ]
}

export default preview
