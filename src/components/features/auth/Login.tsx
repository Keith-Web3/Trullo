import {
  ActionFunction,
  Form,
  Link,
  redirect,
  useNavigation,
} from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import '../../../sass/features/auth/login.scss'
import { supabase } from '../../data/supabase'
import Loader from '../../ui/Loader'
import { signinWithGoogle } from '../../utils/requireAuth'

export const authAction: ActionFunction = async function ({ request }) {
  const formData = await request.formData()
  const searchParams = new URL(request.url).searchParams.get('redirectTo')

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  if (error === null) throw redirect(searchParams || '/')
  toast.error(error.message)

  return null
}

const Login = function () {
  const [viewPassword, setViewPassword] = useState(false)
  const navigation = useNavigation()

  return (
    <div className="login">
      <div className="login__main">
        <img src="/Logo-small.svg" alt="logo" />
        <Form replace method="post">
          <h1>Welcome back, Trailblazers.</h1>
          <p className="login__subheader">
            Welcome back! Please enter your details.
          </p>
          <button
            className="google__btn"
            type="button"
            onClick={signinWithGoogle}
          >
            <img src="/google.png" alt="google sign-in" />
            <span>Log in with Google</span>
          </button>
          <p className="or">or</p>
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
          <div className="footer">
            <label htmlFor="remember-password">
              <input type="checkbox" name="checkbox" id="remember-password" />
              Remember for 30 days
            </label>
            <p>Forgot password</p>
          </div>
          <button className="login__btn">
            {navigation.state === 'submitting' && (
              <Loader
                width="24px"
                ringWidth="3px"
                loaderColor="#ffffff"
                ringColor="#2f80ed"
              />
            )}
            Log in
          </button>
          <p>
            Don't have an account?
            <Link to="/signup">
              {' '}
              Sign up for free <img src="/Line-1.svg" alt="underline" />
            </Link>
          </p>
        </Form>
      </div>
      <img
        src={`https://source.unsplash.com/random/?task-management`}
        alt="thullo"
      />
      {/* <img
        src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGFzayUyMG1hbmFnZW1lbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
        alt="thullo"
      /> */}
    </div>
  )
}

export default Login
