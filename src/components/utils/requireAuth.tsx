import { supabase } from '../data/supabase'

export async function requireAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function signinWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  console.log(data, error)
}
