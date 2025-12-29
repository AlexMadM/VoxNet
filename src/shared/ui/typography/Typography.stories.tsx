import type { Meta, StoryObj } from '@storybook/nextjs'
import { Typography } from '@/shared/ui'

const meta = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'large',
        'h1',
        'h2',
        'h3',
        'regular_16',
        'bold_16',
        'regular_14',
        'medium_14',
        'bold_14',
        'small',
        'bold_small',
        'regular_link',
        'small_link'
      ]
    },
    color: {
      control: 'select',
      options: ['light', 'dark', 'blue', 'lightBlue', 'deepBlue', 'error', 'disabled']
    },
    textAlign: {
      control: 'select',
      options: ['inherit', 'left', 'center', 'right', 'justify', 'initial', 'unset']
    },
    asChild: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    variant: 'small'
  }
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Typography variant="large">Large Heading</Typography>
      <Typography variant="h1">H1 Heading</Typography>
      <Typography variant="h2">H2 Heading</Typography>
      <Typography variant="h3">H3 Heading</Typography>
      <Typography variant="regular_16">Regular 16px text</Typography>
      <Typography variant="bold_16">Bold 16px text</Typography>
      <Typography variant="regular_14">Regular 14px text</Typography>
      <Typography variant="medium_14">Medium 14px text</Typography>
      <Typography variant="bold_14">Bold 14px text</Typography>
      <Typography variant="small">Small text</Typography>
      <Typography variant="bold_small">Bold small text</Typography>
      <Typography variant="regular_link">Regular link</Typography>
      <Typography variant="small_link">Small link</Typography>
    </div>
  )
}

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', backgroundColor: '#333' }}>
      <Typography variant="regular_16" color="light">
        Light color text
      </Typography>
      <Typography variant="regular_16" color="dark">
        Dark color text
      </Typography>
      <Typography variant="regular_16" color="blue">
        Blue color text
      </Typography>
      <Typography variant="regular_16" color="lightBlue">
        Light blue color text
      </Typography>
      <Typography variant="regular_16" color="deepBlue">
        Deep blue color text
      </Typography>
      <Typography variant="regular_16" color="error">
        Error color text
      </Typography>
      <Typography variant="regular_16" color="disabled">
        Disabled color text
      </Typography>
    </div>
  )
}

export const TextAlignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '400px' }}>
      <Typography variant="regular_16" textAlign="left">
        Left aligned text
      </Typography>
      <Typography variant="regular_16" textAlign="center">
        Center aligned text
      </Typography>
      <Typography variant="regular_16" textAlign="right">
        Right aligned text
      </Typography>
      <Typography variant="regular_16" textAlign="justify">
        Justified text - This text should spread to fill the entire container width.
      </Typography>
    </div>
  )
}
