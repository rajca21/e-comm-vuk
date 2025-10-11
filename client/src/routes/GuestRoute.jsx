import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

export default function GuestRoute() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  const isAuthed = status === 'authenticated';
  return isAuthed ? (
    <Navigate to='/' replace state={{ from: location }} />
  ) : (
    <Outlet />
  );
}
