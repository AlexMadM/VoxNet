import { UserProfile } from './UserProfile'

type ProfilePageClientProps = {
  userId: number
}

export const ProfilePageClient = ({ userId }: ProfilePageClientProps) => {
  return <UserProfile userId={userId} />
}
