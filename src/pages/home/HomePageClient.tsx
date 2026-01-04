


import s from './homePage.module.css'
import { RegisteredUsers } from '@/widgets/registeredUsers/RegisteredUsers'
import { HomePostsList } from '@/widgets'

import { ResponsesPosts } from '@/entities/posts/api/types'

type HomePageClientProps = {
  posts: ResponsesPosts['items']
  totalCountUsers: number
}


export const HomePageClient = ({ posts, totalCountUsers }: HomePageClientProps) => {
  // Ограничиваем количество постов (как было на сервере)
  
  const limitedPosts = posts.slice(0, 4)

  return (
    <div className={s.container}>
      <RegisteredUsers totalCount={totalCountUsers} />
   
        <ul className={s.userPostsList}>
          {limitedPosts?.map((post) => (
            <HomePostsList key={post.id} post={post} />
          ))}
        </ul>
    
    </div>
  )
}
