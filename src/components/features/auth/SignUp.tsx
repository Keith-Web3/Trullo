import {
  ActionFunction,
  Form,
  Link,
  useNavigation,
  redirect,
} from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { supabase } from '../../services/supabase'
import '../../../sass/features/auth/signup.scss'
import Loader from '../../ui/Loader'
import Img from '../../ui/Img'

export const authAction: ActionFunction = async function ({ request }) {
  const formData = await request.formData()
  const searchParams = new URL(request.url).searchParams.get('redirectTo')

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const { error, data } = await supabase.auth.signUp({
    email: email.trim(),
    password: password.trim(),
  })

  const { error: nameError } = await supabase
    .from('users')
    .insert([
      { user_id: data.user?.id, name: name.trim(), email: email.trim() },
    ])
    .select()

  if (error === null && nameError === null)
    throw redirect(
      searchParams ? `${searchParams}?isManual=true` : '/?isManual=true'
    )
  toast.error((error || nameError)!.message)

  return null
}

const SignUp = function () {
  const [viewPassword, setViewPassword] = useState(false)
  const navigation = useNavigation()

  return (
    <div className="signup">
      <div className="signup__main">
        <img src="/Logo-small.svg" alt="logo" />
        <Form replace method="post">
          <h1>Create an account</h1>
          <p className="signup__subheader">
            Let's build together and create something extraordinary!
          </p>
          <label htmlFor="name">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              autoComplete="off"
              required
            />
          </label>
          <label htmlFor="email">
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
              required
            />
          </label>
          <label htmlFor="password">
            <input
              type={viewPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              autoComplete="off"
              minLength={6}
              required
            />
            {!viewPassword ? (
              <img
                src="/eye.svg"
                onClick={() => setViewPassword(prev => !prev)}
              />
            ) : (
              <img
                src="/visible.svg"
                onClick={() => setViewPassword(prev => !prev)}
              />
            )}
          </label>
          <button className="google__btn" type="button">
            <img src="/google.png" alt="google sign-in" />
            <span>Sign up with Google</span>
          </button>
          <button className="login__btn">
            {navigation.state === 'submitting' && <Loader />}
            Create account
          </button>
          <p>
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </Form>
      </div>
      <Img
        src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixid=M3w0ODE5MjF8MHwxfHNlYXJjaHwyfHx0YXNrJTEwbWFuYWdlbWVudHxlbnwwfHx8fDE3MjUzMDI2ODB8MA&ixlib=rb-4.0.3"
        blurhash="LVLqCFtm4n-o~qfixubJ?bxvt7oe"
        alt="thullo"
      />
    </div>
  )
}

export default SignUp
