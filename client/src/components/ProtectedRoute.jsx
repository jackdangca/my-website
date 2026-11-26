import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="shell page-body">
        <p className="notice" role="status">Checking your sign-in…</p>
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/forbidden" replace />
  }
  return children
}
