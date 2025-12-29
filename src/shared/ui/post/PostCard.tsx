// 'use client'
//
// import Image from 'next/image'
// import s from './PostCard.module.css'
// import { Card } from '@/shared/ui'
//
// type PostCardProps = {
//   userName: string
//   avatar: string
//   className?: string
// }
//
// export function PostCard({ userName, avatar, className = '' }: PostCardProps) {
//   return (
//     <Card className={`${s.postCard} ${className}`}>
//       <div className={s.card}>
//         <Image src={avatar} alt={`${userName}'s Avatar`} width={36} height={36} className={s.avatar} />
//
//         <div className={s.content}>
//           {/* Просто отображаем имя пользователя */}
//           <div className={s.top}>
//             <span className={s.userName}>{userName}</span>
//           </div>
//         </div>
//       </div>
//     </Card>
//   )
// }
'use client'

import s from './PostCard.module.css'
import { Avatar, Card } from '@/shared/ui'

type PostCardProps = {
  userName: string
  avatar: string
  className?: string
}

export function PostCard({ userName, avatar, className = '' }: PostCardProps) {
  return (
    <Card className={`${s.postCard} ${className}`}>
      {/* Всё в одном div с классом s.card */}
      <div className={s.card}>
        <Avatar src={avatar} alt={userName} size="small" />
        {/*  имя пользователя */}
        <span className={s.userName}>{userName}</span>
      </div>
    </Card>
  )
}
