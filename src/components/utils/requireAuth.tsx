import toast from 'react-hot-toast'
import { supabase } from '../data/supabase'

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
  if (error) toast.error(error.message)
}
