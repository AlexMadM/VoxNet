import { EditPersonalDataForm } from './EditPersonalDataForm'
import { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof EditPersonalDataForm> = {
  title: 'features/EditPersonalDataForm',
  component: EditPersonalDataForm,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// import { EditPersonalDataForm } from './EditPersonalDataForm'
// import { Meta, StoryObj } from '@storybook/nextjs'
//
// // Обёртка, которая рисует серый круг на месте аватара
// const FormWithMockAvatar = () => {
//   return (
//     <div style={{ position: 'relative' }}>
//       {/* Оригинальная форма */}
//       <EditPersonalDataForm />
//
//       {/* Заглушка поверх сломанного аватара */}
//       <div
//         style={{
//           position: 'absolute',
//           top: '24px',
//           left: '24px',
//           width: '192px',
//           height: '192px',
//           borderRadius: '50%',
//           backgroundColor: '#e0e0e0', // серый цвет
//           border: '2px solid #ccc',
//           zIndex: 1000
//         }}
//       />
//     </div>
//   )
// }
//
// const meta: Meta<typeof FormWithMockAvatar> = {
//   title: 'features/EditPersonalDataForm',
//   component: FormWithMockAvatar, // ← используем обёртку
//   parameters: {
//     layout: 'centered'
//   },
//   tags: ['autodocs']
// }
//
// export default meta
// type Story = StoryObj<typeof meta>
//
// export const Default: Story = {}
