import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RoleBasedRoute({ children, allowedRoles }) {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.user_type)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}