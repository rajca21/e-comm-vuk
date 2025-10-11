import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

export default function ProtectedRoute() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  const isAuthed = status === 'authenticated';
  return isAuthed ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace state={{ from: location }} />
  );
}
