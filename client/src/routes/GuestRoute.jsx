import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

export default function GuestRoute() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className='grid min-h-svh place-items-center'>
        <div className='rounded-2xl bg-white p-6 shadow'>
          <p className='text-sm text-gray-600'>Loading…</p>
        </div>
      </div>
    );
  }

  const isAuthed = status === 'authenticated';
  return isAuthed ? (
    <Navigate to='/' replace state={{ from: location }} />
  ) : (
    <Outlet />
  );
}
