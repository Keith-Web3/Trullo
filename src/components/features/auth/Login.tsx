import { Form } from 'react-router-dom'

import '../../../sass/features/auth/login.scss'
import { useState } from 'react'

const Login = function () {
  const [viewPassword, setViewPassword] = useState(false)
  return (
    <div className="login">
      <div className="login__main">
        <img src="/Logo-small.svg" alt="logo" />
        <Form replace action="post">
          <h1>Welcome back, Trailblazers.</h1>
          <p className="login__subheader">
            Welcome back! Please enter your details.
          </p>
          <button className="google__btn">
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
          <button className="login__btn">Log in</button>
          <p>
            Don't have an account?{' '}
            <span>
              Sign up for free <img src="/Line-1.svg" alt="underline" />
            </span>
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
