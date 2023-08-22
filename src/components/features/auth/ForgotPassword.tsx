import { Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'

import '../../../sass/features/auth/forgot-password.scss'
import { supabase } from '../../services/supabase'

const ForgotPassword = function () {
  const passwordRef = useRef<HTMLInputElement>(null)
  const [viewPassword, setViewPassword] = useState(false)

  return (
    <div className="forgot-password">
      <div className="forgot-password__header">
        <img src="/Logo-small.svg" alt="logo" />
        <Link to="/signup">Create an account</Link>
      </div>
      <div className="forgot-password__main">
        <img src="/finger.svg" alt="fingerprint" />
        <h1>Forgot password?</h1>
        <p>No worries, we'll send you the reset instructions.</p>
        <label htmlFor="password">
          Password
          <input
            type={viewPassword ? 'text' : 'password'}
            name="password"
            id="password"
            ref={passwordRef}
            placeholder="Enter your new password"
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
        <button
          onClick={async () => {
            const { error } = await supabase.auth.updateUser({
              password: passwordRef.current!.value,
            })
            if (!error) toast.success('Password successfully reset')
            if (error) toast.error(error.message)
          }}
        >
          Reset password
        </button>
        <Link to="/login">
          <img src="/arrow_back.svg" alt="go back" />
          <span>Back to login</span>
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword
