import { useEffect, useState } from 'react';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSearch } from 'react-icons/fi';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/shop', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/deals', label: 'Deals' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 ${
        elevated ? 'shadow-md' : 'shadow-none'
      }`}
    >
      <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center gap-2'>
            <button
              className='rounded-xl p-2 hover:bg-gray-100 lg:hidden'
              aria-label='Open menu'
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <FiMenu className='h-6 w-6' />
            </button>

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
          </div>
        </div>

        <div className='hidden lg:flex items-center justify-center gap-1 pb-3'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-gray-900 text-white shadow'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {open && (
        <div className='lg:hidden'>
          <div
            className='fixed inset-0 bg-black/30'
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside className='fixed inset-y-0 left-0 w-80 max-w-[85vw] rounded-r-2xl bg-white shadow-xl'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex items-center gap-2'>
                <div className='h-8 w-8 rounded-2xl bg-gray-900 text-white grid place-items-center shadow'>
                  V
                </div>
                <span className='text-lg font-semibold'>Velora</span>
              </div>
              <button
                className='rounded-xl p-2 hover:bg-gray-100'
                aria-label='Close menu'
                onClick={() => setOpen(false)}
              >
                <FiX className='h-6 w-6' />
              </button>
            </div>

            <div className='px-4 pb-4'>
              <div className='relative mb-4'>
                <FiSearch className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search products…'
                  className='w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 outline-none focus:border-gray-300 shadow-sm'
                />
              </div>

              <nav className='flex flex-col gap-1'>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-2 text-base ${
                        isActive
                          ? 'bg-gray-900 text-white shadow'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
