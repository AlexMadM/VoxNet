// import { ForgotPasswordForm } from './ForgotPasswordForm'
// import ExpiredLink from './ExpiredLink'
// import { EmailSentMessage } from '@/features/auth/forgot-password/ui/EmailSentMessage'
// import { CreateNewPasswordForm } from '@/features/auth/forgot-password/ui/CreateNewPasswordForm'
// import { Button, Dialog, DialogContent } from '@/shared/ui'
// import s from './ForgotPasswordForm.module.css'
// import { useState } from 'react'
//
// export default {
//   title: 'Features/ForgotPassword',
//   parameters: {
//     layout: 'centered'
//   }
// }
//
// // 1. Основная форма
// export const DefaultForm = () => <ForgotPasswordForm />
//
// // 3. Сообщение "Email отправлен" с ОТКРЫТОЙ модалкой (для демонстрации)
// export const EmailSentWithModal = () => {
//   const [showModal, setShowModal] = useState(true) // ← управляемое состояние
//
//   return (
//     <div>
//       <EmailSentMessage />
//       <Dialog open={showModal} onOpenChange={setShowModal}>
//         <DialogContent title="Email sent" showCloseButton={true}>
//           <p className={s.textModal}>We have sent a link to confirm your email to epam@epam.com</p>
//           <Button className={s.buttonModal} onClick={() => setShowModal(false)}>
//             Ok
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }
//
//
//
// // 2. Сообщение "Email отправлен"
// export const EmailSent = () => <EmailSentMessage />
// // 4. Создание нового пароля
// // export const CreatePassword = () => <CreateNewPasswordForm />
// export const CreatePassword = () => <CreateNewPasswordForm />
// // 5. Ссылка устарела
// export const LinkExpired = () => <ExpiredLink />
import { ForgotPasswordForm } from './ForgotPasswordForm'
import ExpiredLink from './ExpiredLink'
import { CreateNewPasswordForm } from '@/features/auth/forgot-password/ui/CreateNewPasswordForm'
import { Button, Dialog, DialogContent } from '@/shared/ui'
import s from './ForgotPasswordForm.module.css'
import { useState } from 'react'

export default {
  title: 'Features/ForgotPassword',
  parameters: {
    layout: 'centered'
  }
}

// 1. Основная форма
export const DefaultForm = () => <ForgotPasswordForm />

// 3. Сообщение "Email отправлен" с открытой модалкой (для демонстрации)
export const EmailSentWithModal = () => {
  const [showModal, setShowModal] = useState(true) // управляемое состояние

  return (
    <div>
      <ForgotPasswordForm />
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent title="Email sent" showCloseButton={true}>
          <p className={s.textModal}>We have sent a link to confirm your email to epam@epam.com</p>
          <Button className={s.buttonModal} onClick={() => setShowModal(false)}>
            Ok
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 4. Создание нового пароля
export const CreatePassword = () => <CreateNewPasswordForm />

CreatePassword.parameters = {
  nextjs: {
    appDirectory: true,
    navigation: {
      pathname: '/auth/forgot-password',
      query: { code: 'test-recovery-code' } // fake code для Storybook
    }
  }
}

// 5. Ссылка устарела
export const LinkExpired = () => <ExpiredLink />
