import { Link } from 'react-router-dom'

import '../../../sass/features/auth/forgot-password.scss'

const ForgotPassword = function () {
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
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />
        </label>
        <button>Reset password</button>
        <Link to="/login">
          <img src="/arrow_back.svg" alt="go back" />
          <span>Back to login</span>
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword
