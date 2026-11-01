import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

const inputClass =
  'w-full rounded-lg border border-slate-line bg-slate-soft px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-3 focus:ring-brand/20'

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
      navigate(destination && (user.role === 'admin' || destination !== '/admin') ? destination : fallback,
        { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-slate-line bg-white p-7 shadow-sm">
      <h1 className="mb-2 text-3xl font-bold text-ink">{isSignUp ? 'Create account' : 'Sign in'}</h1>
      <p className="mb-6 text-slate-muted">
        {isSignUp ? 'Create a regular read-only account.' : 'Sign in to access your account.'}
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        {isSignUp && (
          <label className="block space-y-1.5 text-sm font-semibold">
            Name
            <input className={inputClass} name="name" value={values.name} onChange={handleChange}
              autoComplete="name" maxLength="100" required />
          </label>
        )}
        <label className="block space-y-1.5 text-sm font-semibold">
          Email
          <input className={inputClass} name="email" type="email" value={values.email}
            onChange={handleChange} autoComplete="email" required />
        </label>
        <label className="block space-y-1.5 text-sm font-semibold">
          Password
          <input className={inputClass} name="password" type="password" value={values.password}
            onChange={handleChange} autoComplete={isSignUp ? 'new-password' : 'current-password'}
            minLength="6" required />
        </label>
        <button className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
          type="submit" disabled={submitting}>
          {submitting ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
        </button>
      </form>
      <p className="mt-5 text-sm text-slate-muted">
        {isSignUp ? 'Already registered?' : 'Need an account?'}{' '}
        <Link className="font-semibold text-brand-dark underline" to={isSignUp ? '/sign-in' : '/sign-up'}>
          {isSignUp ? 'Sign in' : 'Sign up'}
        </Link>
      </p>
    </section>
  )
}
