// client/src/pages/Account.jsx
import { useEffect, useMemo } from 'react';
import Layout from '../components/layout/Layout';
import { useAuthStore } from '../stores/auth';
import { useOrdersStore } from '../stores/orders';
import { useShallow } from 'zustand/react/shallow';
import { Link } from 'react-router-dom';

function StatusBadge({ value }) {
  const cls =
    value === 'PENDING'
      ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
      : value === 'PAID'
      ? 'bg-blue-50 text-blue-700 border-blue-100'
      : value === 'SHIPPED'
      ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
      : value === 'DELIVERED'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : 'bg-rose-50 text-rose-700 border-rose-100';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}
    >
      {value}
    </span>
  );
}

export default function Account() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const {
    items,
    page,
    pageSize,
    totalPages,
    listStatus,
    listError,
    setPage,
    setPageSize,
    listOrders,
  } = useOrdersStore(
    useShallow((s) => ({
      items: s.items,
      page: s.page,
      pageSize: s.pageSize,
      totalPages: s.totalPages,
      listStatus: s.listStatus,
      listError: s.listError,
      setPage: s.setPage,
      setPageSize: s.setPageSize,
      listOrders: s.listOrders,
    }))
  );

  useEffect(() => {
    listOrders({ page: 1, pageSize });
  }, []);

  function changePage(n) {
    const nn = Math.max(1, Math.min(totalPages || 1, n));
    setPage(nn);
    listOrders({ page: nn, pageSize });
  }
  function changePageSize(ps) {
    setPageSize(ps);
    setPage(1);
    listOrders({ page: 1, pageSize: ps });
  }

  const pages = useMemo(() => {
    const total = Math.max(1, totalPages || 1);
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <Layout>
      <div className='grid gap-6 lg:grid-cols-3'>
        <aside className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h2 className='text-base font-semibold'>My profile</h2>
          <div className='mt-4 grid gap-2 text-sm text-gray-700'>
            <div>
              <span className='text-gray-500'>Name:</span> {user?.name}
            </div>
            <div>
              <span className='text-gray-500'>Email:</span> {user?.email}
            </div>
            <div>
              <span className='text-gray-500'>Role:</span> {user?.role}
            </div>
            <div>
              <span className='text-gray-500'>Member since:</span>{' '}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : '—'}
            </div>
          </div>

          <button
            onClick={logout}
            className='mt-6 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50'
          >
            Sign out
          </button>
        </aside>

        <div className='lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-base font-semibold'>My orders</h2>
            <select
              value={pageSize}
              onChange={(e) => changePageSize(Number(e.target.value))}
              className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 shadow-sm'
            >
              {[6, 12, 24, 36].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>

          <div className='overflow-x-auto'>
            {listStatus === 'loading' && items.length === 0 ? (
              <div className='rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600'>
                Loading orders…
              </div>
            ) : listError ? (
              <div className='rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700'>
                {listError}
              </div>
            ) : items.length === 0 ? (
              <div className='rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-600'>
                You have no orders yet.
              </div>
            ) : (
              <table className='w-full table-fixed border-separate border-spacing-y-2'>
                <thead>
                  <tr className='text-left text-xs text-gray-600'>
                    <th className='px-3 py-2'>Order</th>
                    <th className='px-3 py-2'>Created</th>
                    <th className='px-3 py-2'>Total</th>
                    <th className='px-3 py-2'>Status</th>
                    <th className='px-3 py-2 text-right'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((o) => (
                    <tr
                      key={o.id}
                      className='rounded-2xl border border-gray-100 bg-white shadow-sm'
                    >
                      <td className='px-3 py-3 align-top'>
                        <div className='text-sm font-semibold'>
                          {o.orderNumber}
                        </div>
                        <div className='text-xs text-gray-500'>#{o.id}</div>
                      </td>
                      <td className='px-3 py-3 align-top text-sm text-gray-700'>
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                      <td className='px-3 py-3 align-top text-sm font-semibold'>
                        €{Number(o.total).toFixed(2)} {o.currency}
                      </td>
                      <td className='px-3 py-3 align-top'>
                        <StatusBadge value={o.status} />
                      </td>
                      <td className='px-3 py-3 align-top'>
                        <div className='flex items-center justify-end'>
                          <Link
                            to={`/orders/${o.id}`}
                            className='rounded-xl px-3 py-1.5 text-sm hover:bg-gray-100'
                          >
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className='mt-6 flex items-center justify-center gap-1'>
              <button
                onClick={() => changePage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className='rounded-xl px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50'
              >
                Prev
              </button>
              {pages.map((n) => (
                <button
                  key={n}
                  onClick={() => changePage(n)}
                  className={`rounded-xl px-3 py-1.5 text-sm ${
                    n === page
                      ? 'bg-gray-900 text-white shadow'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => changePage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className='rounded-xl px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50'
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
