import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

export default function AdminRoute() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className='grid min-h-svh place-items-center'>
        <div className='rounded-2xl bg-white p-6 shadow'>
          <p className='text-sm text-gray-600'>Checking access…</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated' || user?.role !== 'ADMIN') {
    return <Navigate to='/' replace state={{ from: location }} />;
  }
  return <Outlet />;
}
