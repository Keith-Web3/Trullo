import {
  Outlet,
  defer,
  redirect,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom'
import { useEffect } from 'react'

import Header from '../shared/Header'
import { getUserDetails, requireAuth } from '../utils/requireAuth'
import { uploadUserOnSignUp } from '../utils/apis'
import { supabase } from '../services/supabase'

export const loader = async function ({ request }: { request: Request }) {
  const path = new URL(request.url).pathname
  const user = await requireAuth()
  if (user === null)
    throw redirect(path !== '/' ? `/login?redirectTo=${path}` : '/login')
  return defer({ userDetails: getUserDetails() })
}
const HomeLayout = function () {
  const { userDetails } = useLoaderData() as { userDetails: unknown }
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('isManual')) {
      const params = new URLSearchParams(searchParams)
      params.delete('isManual')
      setSearchParams(params)
      return
    }
    uploadUserOnSignUp().catch(async _err => {
      await supabase.auth.signOut()
    })
  }, [])
  return (
    <main>
      <Header userDetails={userDetails} />
      <Outlet />
    </main>
  )
}

export default HomeLayout
