import { NavLink, Outlet } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

export default function AdminDashboard() {
  const tabs = [
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' },
  ];

  return (
    <Layout>
      <div className='rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'>
        <div className='flex items-center justify-between'>
          <h1 className='text-lg font-semibold'>Admin Dashboard</h1>
        </div>

        <div className='mt-4 flex gap-2 overflow-x-auto'>
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-900 text-white shadow'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </div>

        <div className='mt-6'>
          <Outlet />
        </div>
      </div>
    </Layout>
  );
}
