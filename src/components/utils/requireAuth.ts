import toast from 'react-hot-toast'

import { supabase } from '../services/supabase'
import { getUser } from './apis'

export async function requireAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function signinWithGoogle() {
  toast.loading('redirecting...')
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  if (error) toast.error(`Error signing in with Google: ${error.message}`)
}

export async function getUserDetails() {
  const user = await requireAuth()
  let name = user!.user_metadata.name
  if (!name) {
    const users = await getUser(user!.id)
    name = users?.[0].name
  }
  return {
    name,
    img: user!.user_metadata.avatar_url,
    id: user!.id,
  }
}
