import { useEffect, useState } from 'react';
import { FiShoppingCart, FiUser, FiSearch } from 'react-icons/fi';
import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';

export default function Navbar() {
  const [elevated, setElevated] = useState(false);

  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const authed = status === 'authenticated';

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 ${
        elevated ? 'shadow-md' : 'shadow-none'
      }`}
    >
      <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Link to='/' className='flex items-center gap-2'>
              <div className='h-8 w-8 rounded-2xl bg-gray-900 text-white grid place-items-center shadow'>
                V
              </div>
              <span className='text-lg font-semibold tracking-tight'>
                Velora
              </span>
            </Link>
          </div>

          <div className='hidden md:flex md:flex-1 md:justify-center'>
            <div className='relative w-full max-w-md'>
              <FiSearch className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Search products…'
                className='w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 py-2 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-300 focus:bg-white shadow-sm'
              />
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {authed ? (
              <>
                <span className='hidden sm:block text-sm text-gray-700'>
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={logout}
                  className='rounded-xl px-3 py-2 text-sm hover:bg-gray-100'
                  title='Sign out'
                >
                  Sign out
                </button>
                {user?.role === 'ADMIN' && (
                  <NavLink
                    to='/admin'
                    className='rounded-xl px-3 py-2 text-sm hover:bg-gray-100'
                  >
                    Admin
                  </NavLink>
                )}
                {user?.role !== 'ADMIN' && (
                  <>
                    <NavLink
                      to='/account'
                      className='rounded-xl p-2 hover:bg-gray-100'
                      title='Account'
                    >
                      <FiUser className='h-6 w-6' />
                    </NavLink>
                    <NavLink
                      to='/cart'
                      className='relative rounded-xl p-2 hover:bg-gray-100'
                      title='Cart'
                    >
                      <FiShoppingCart className='h-6 w-6' />
                      <span className='absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gray-900 text-xs font-semibold text-white shadow'>
                        2
                      </span>
                    </NavLink>
                  </>
                )}
              </>
            ) : (
              <>
                <NavLink
                  to='/login'
                  className='rounded-xl px-3 py-2 text-sm hover:bg-gray-100'
                >
                  Sign in
                </NavLink>
                <NavLink
                  to='/register'
                  className='rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow hover:opacity-95'
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
