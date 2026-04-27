import { Navigate } from 'react-router-dom';
import { useAuth, ROLE_ROUTES } from '../contexts/AuthContext';

/**
 * Protège une route selon le rôle.
 * allowedRoles={['membre']} → seuls les membres passent
 * Sans allowedRoles → juste être connecté suffit
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase())) {
    const redirect = ROLE_ROUTES[user.role?.toLowerCase()] || '/';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
