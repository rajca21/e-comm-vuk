import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

export default function AdminRoute() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (status !== 'authenticated' || user?.role !== 'ADMIN') {
    return <Navigate to='/' replace state={{ from: location }} />;
  }
  return <Outlet />;
}
