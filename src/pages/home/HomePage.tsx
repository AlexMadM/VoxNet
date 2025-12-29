import s from './homePage.module.css'
import { RegisteredUsers } from '@/widgets/registeredUsers/RegisteredUsers'
import { HomePostsList } from '@/widgets'
import { PostsCacheProvider } from '@/widgets/homePostsList/ui/PostsCacheProvider'
import { ResponsesPosts } from '@/entities/posts/api/types'
// SSG: Страница будет статически сгенерирована на этапе сборки
// ISR: Страница будет перегенерирована каждые 60 секунд при запросах
export const revalidate = 60

type TotalCountUsersResponse = {
  totalCount: number
}

const defaultPostsData: ResponsesPosts = {
  totalCount: 0,
  pageSize: 0,
  items: [],
  totalUsers: 0
}

export const HomePage = async () => {
  // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inctagram.work/api/v1'
  const apiUrl = 'https://inctagram.work/api/v1'

  const [postsResponse, usersResponse] = await Promise.all([
    fetch(`${apiUrl}/posts/all`, {
      next: { revalidate: 60 } // ISR: перегенерировать каждые 60 секунд
    }).catch(() => null),
    fetch(`${apiUrl}/public-user`, {
      next: { revalidate: 60 } // ISR: перегенерировать каждые 60 секунд
    }).catch(() => null)
  ])

  const postsData: ResponsesPosts = postsResponse?.ok
    ? await postsResponse.json().catch(() => defaultPostsData)
    : defaultPostsData
  const totalCountUsers =
    (usersResponse?.ok
      ? ((await usersResponse.json().catch(() => null)) as TotalCountUsersResponse | null)?.totalCount
      : null) ?? 0

  // Ограничиваем количество постов на сервере (лучше для SSG)
  const limitedPosts = postsData.items.slice(0, 4)

  return (
    <PostsCacheProvider posts={limitedPosts}>
      <div className={s.container}>
        <RegisteredUsers totalCount={totalCountUsers} />
        <ul className={s.userPostsList}>
          {limitedPosts?.map((post) => (
            <HomePostsList key={post.id} post={post} />
          ))}
        </ul>
      </div>
    </PostsCacheProvider>
  )
}
