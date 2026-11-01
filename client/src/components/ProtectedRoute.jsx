import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <p className="py-12 text-center text-slate-muted">Checking your sign-in…</p>
  }
  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/forbidden" replace />
  }
  return children
}
