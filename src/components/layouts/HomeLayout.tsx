import { Outlet, redirect } from 'react-router-dom'

import Header from '../shared/Header'
import { requireAuth } from '../utils/requireAuth'

export const loader = async function ({ request }: { request: Request }) {
  const path = new URL(request.url).pathname
  const user = await requireAuth()
  if (user === null)
    throw redirect(path !== '/' ? `/login?redirectTo=${path}` : '/login')
  return null
}
const HomeLayout = function () {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  )
}

export default HomeLayout
