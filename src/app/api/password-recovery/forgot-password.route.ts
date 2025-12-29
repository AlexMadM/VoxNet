// для капчи

// import { NextRequest, NextResponse } from 'next/server'
// import axios from 'axios'
//
// const recaptchaAdapter = {
//   async isValid(value: string) {
//     const response = await axios.posts(
//       'https://www.google.com/recaptcha/api/siteverify',
//       `secret=6LdHxG4qAAAAAPKRxEHrlV5VvLFHIf2BO5NMI8YM&response=${value}`,
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         }
//       }
//     )
//     return response.data.success
//   }
// }
//
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { email, recaptchaValue } = body
//
//     // Проверяем reCAPTCHA
//     if (!(await recaptchaAdapter.isValid(recaptchaValue))) {
//       return NextResponse.json({ error: 'you are robot' }, { status: 400 })
//     }
//
//     // Здесь должна быть логика отправки email для восстановления пароля.
//
//     return NextResponse.json({ message: `email sent to your email: ${email}` })
//   } catch (error) {
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }
