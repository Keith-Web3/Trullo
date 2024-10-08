import {
  ActionFunction,
  Form,
  Link,
  redirect,
  useNavigation,
} from 'react-router-dom'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

import '../../../sass/features/auth/login.scss'
import { supabase } from '../../services/supabase'
import Loader from '../../ui/Loader'
import { signinWithGoogle } from '../../utils/requireAuth'
import Img from '../../ui/Img'

export const authAction: ActionFunction = async function ({ request }) {
  const formData = await request.formData()
  const searchParams = new URL(request.url).searchParams.get('redirectTo')

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (password === '') {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://thulloo.netlify.app/update-password',
    })
    if (error) toast.error(error.message)
    if (!error) toast.success(`reset email sent to ${email}`)
    return null
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  if (error === null)
    throw redirect(
      searchParams ? `${searchParams}?isManual=true` : '/?isManual=true'
    )
  toast.error(error.message)

  return null
}

const Login = function () {
  const [viewPassword, setViewPassword] = useState(false)
  const navigation = useNavigation()
  const passwordRef = useRef<HTMLInputElement>(null)

  return (
    <div className="login">
      <div className="login__main">
        <img src="/Logo-small.svg" alt="logo" />
        <Form
          replace
          method="post"
          onSubmit={() => {
            passwordRef.current!.required = true
          }}
        >
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
              ref={passwordRef}
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
          <div className="footer">
            <label htmlFor="remember-password">
              <input type="checkbox" name="checkbox" id="remember-password" />
              Remember for 30 days
            </label>
            <button
              type="submit"
              onClick={() => {
                passwordRef.current!.required = false
                passwordRef.current!.value = ''
              }}
            >
              Forgot password
            </button>
          </div>
          <button className="login__btn">
            {navigation.state === 'submitting' && <Loader />}
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
      <Img
        src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixid=M3w0ODE5MjF8MHwxfHNlYXJjaHwxfHx0YXNrJTEwbWFuYWdlbWVudHxlbnwwfHx8fDE3MjUzMDI2ODB8MA&ixlib=rb-4.0.3"
        alt="thullo"
        blurhash="LAHBYn00Dh9bMyRP4;s,Ql%1?coJ"
      />
    </div>
  )
}

export default Login
