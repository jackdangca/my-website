import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import Icon from '../components/Icon.jsx'
import Reveal from '../components/Reveal.jsx'

export default function AuthPage({ mode }) {
  const isSignUp = mode === 'signup'
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = isSignUp
        ? await signUp(values)
        : await signIn({ email: values.email, password: values.password })
      const destination = location.state?.from?.pathname
      const fallback = user.role === 'admin' ? '/admin' : '/projects'
      navigate(
        destination && (user.role === 'admin' || destination !== '/admin') ? destination : fallback,
        { replace: true },
      )
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="shell auth-wrap">
      <Reveal className="auth-card" style={{ width: '100%' }}>
        <div className="auth-card__head">
          <p className="eyebrow" style={{ marginBottom: 'var(--s5)' }}>Account access</p>
          <h1>{isSignUp ? 'Create an account' : 'Welcome back'}</h1>
          <p>{isSignUp ? 'Register for a read-only account.' : 'Sign in to access your account.'}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--s5)' }}>
          {error && (
            <p className="notice notice--error" role="alert"><Icon name="close" size={16} /> {error}</p>
          )}

          {isSignUp && (
            <div className="field">
              <label htmlFor="name">Name</label>
              <input className="input" id="name" name="name" value={values.name} onChange={handleChange}
                autoComplete="name" maxLength="100" required />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">Email address</label>
            <input className="input" id="email" name="email" type="email" value={values.email}
              onChange={handleChange} autoComplete="email" required />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input className="input" id="password" name="password" type="password" value={values.password}
              onChange={handleChange} autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength="6" required />
          </div>

          <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
            {submitting ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
            {!submitting && <Icon name="arrow-right" size={16} />}
          </button>
        </form>

        <p className="auth-card__foot">
          {isSignUp ? 'Already registered?' : 'Need an account?'}{' '}
          <Link to={isSignUp ? '/sign-in' : '/sign-up'}>
            {isSignUp ? 'Sign in' : 'Create one'}
          </Link>
        </p>
      </Reveal>
    </div>
  )
}
