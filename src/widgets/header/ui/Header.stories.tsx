import { Header } from '@/widgets'

export default {
  title: 'Widgets/Header',
  component: Header
}
export const Default = () => <Header />
export const HeaderLogIn = () => (
  <Header>
    <button>Log in</button>
  </Header>
)
export const HeaderSignUp = () => (
  <Header>
    <button>Sign up</button>
  </Header>
)
