import { Outlet, defer, redirect, useLoaderData } from 'react-router-dom'

import Header from '../shared/Header'
import { getUserDetails, requireAuth } from '../utils/requireAuth'

export const loader = async function ({ request }: { request: Request }) {
  const path = new URL(request.url).pathname
  const user = await requireAuth()
  if (user === null)
    throw redirect(path !== '/' ? `/login?redirectTo=${path}` : '/login')
  return defer({ userDetails: getUserDetails() })
}
const HomeLayout = function () {
  const { userDetails } = useLoaderData() as { userDetails: unknown }
  return (
    <main>
      <Header userDetails={userDetails} />
      <Outlet />
    </main>
  )
}

export default HomeLayout
