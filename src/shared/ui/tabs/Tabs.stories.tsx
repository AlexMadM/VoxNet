import type { Meta, StoryObj } from '@storybook/nextjs'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    defaultValue: 'tab1',
    orientation: 'horizontal'
  }
}

export default meta

type Story = StoryObj<typeof Tabs>

export const Basic: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="tab1">One</TabsTrigger>
        <TabsTrigger value="tab2">Two</TabsTrigger>
        <TabsTrigger value="tab3">Three</TabsTrigger>
      </TabsList>

      <TabsContent value="tab1">Tab one content</TabsContent>
      <TabsContent value="tab2">Tab two content</TabsContent>
      <TabsContent value="tab3">Tab three content</TabsContent>
    </Tabs>
  )
}
