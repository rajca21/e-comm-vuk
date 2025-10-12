import { useEffect, useMemo, useState } from 'react';
import { useUsersStore } from '../../stores/users';
import { useShallow } from 'zustand/react/shallow';
import { FiRefreshCw } from 'react-icons/fi';

const ROLE_OPTIONS = ['', 'USER', 'ADMIN'];

export default function UsersTab() {
  const {
    items,
    page,
    pageSize,
    totalPages,
    q,
    role,
    listStatus,
    listError,
    setPage,
    setPageSize,
    setQ,
    setRoleFilter,
    listUsers,
    updateRole,
    mutateStatus,
  } = useUsersStore(
    useShallow((s) => ({
      items: s.items,
      page: s.page,
      pageSize: s.pageSize,
      totalPages: s.totalPages,
      q: s.q,
      role: s.role,
      listStatus: s.listStatus,
      listError: s.listError,
      setPage: s.setPage,
      setPageSize: s.setPageSize,
      setQ: s.setQ,
      setRoleFilter: s.setRoleFilter,
      listUsers: s.listUsers,
      updateRole: s.updateRole,
      mutateStatus: s.mutateStatus,
    }))
  );

  const [qLocal, setQLocal] = useState(q);

  useEffect(() => {
    listUsers({ page: 1, pageSize, q, role });
  }, []);

  function applyFilters() {
    setPage(1);
    setQ(qLocal);
    listUsers({ page: 1, pageSize, q: qLocal, role });
  }

  function changePage(n) {
    const nn = Math.max(1, Math.min(totalPages || 1, n));
    setPage(nn);
    listUsers({ page: nn, pageSize, q, role });
  }

  function changePageSize(ps) {
    setPageSize(ps);
    setPage(1);
    listUsers({ page: 1, pageSize: ps, q, role });
  }

  function refresh() {
    listUsers({ page, pageSize, q, role });
  }

  const pages = useMemo(() => {
    const total = Math.max(1, totalPages || 1);
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
      <div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <h2 className='text-base font-semibold'>Users</h2>
        <div className='flex flex-wrap items-center gap-2'>
          <input
            type='text'
            placeholder='Search name/email…'
            value={qLocal}
            onChange={(e) => setQLocal(e.target.value)}
            className='w-56 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 shadow-sm'
          />
          <select
            value={role}
            onChange={(e) => setRoleFilter(e.target.value)}
            className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 shadow-sm'
            title='Filter by role'
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r || 'ALL'} value={r}>
                {r ? r : 'All roles'}
              </option>
            ))}
          </select>
          <select
            value={pageSize}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 shadow-sm'
          >
            {[6, 12, 24, 36, 48].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
          <button
            onClick={applyFilters}
            className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50'
          >
            Apply
          </button>
          <button
            onClick={refresh}
            className='inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50'
            title='Refresh'
          >
            <FiRefreshCw className='h-4 w-4' />
            Refresh
          </button>
        </div>
      </div>

      <div className='overflow-x-auto'>
        {listStatus === 'loading' && items.length === 0 ? (
          <div className='rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-600'>
            Loading users…
          </div>
        ) : listError ? (
          <div className='rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700'>
            {listError}
          </div>
        ) : items.length === 0 ? (
          <div className='rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-600'>
            No users found.
          </div>
        ) : (
          <table className='w-full table-fixed border-separate border-spacing-y-2'>
            <thead>
              <tr className='text-left text-xs text-gray-600'>
                <th className='px-3 py-2'>User</th>
                <th className='px-3 py-2'>Email</th>
                <th className='px-3 py-2'>Created</th>
                <th className='px-3 py-2'>Orders</th>
                <th className='px-3 py-2'>Role</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr
                  key={u.id}
                  className='rounded-2xl border border-gray-100 bg-white shadow-sm'
                >
                  <td className='px-3 py-3 align-top'>
                    <div className='text-sm font-semibold'>{u.name}</div>
                    <div className='text-xs text-gray-500'>#{u.id}</div>
                  </td>
                  <td className='px-3 py-3 align-top text-sm'>{u.email}</td>
                  <td className='px-3 py-3 align-top text-sm text-gray-700'>
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                  <td className='px-3 py-3 align-top text-sm text-gray-700'>
                    {u._count?.orders ?? 0}
                  </td>
                  <td className='px-3 py-3 align-top'>
                    <select
                      value={u.role}
                      disabled={mutateStatus === 'loading'}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                      className='rounded-xl border border-gray-200 bg-white px-2 py-1 text-xs outline-none focus:border-gray-300 shadow-sm'
                      title='Change role'
                    >
                      <option value='USER'>USER</option>
                      <option value='ADMIN'>ADMIN</option>
                    </select>
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
  );
}
