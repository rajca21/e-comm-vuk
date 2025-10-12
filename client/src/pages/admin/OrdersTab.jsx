import { useEffect, useMemo, useState } from 'react';
import { useOrdersStore } from '../../stores/orders';
import { useShallow } from 'zustand/react/shallow';
import { FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELED'];

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

export default function OrdersTab() {
  const {
    items,
    page,
    pageSize,
    totalPages,
    listStatus,
    listError,
    statusFilter,
    setPage,
    setPageSize,
    setStatusFilter,
    listOrders,
    updateStatus,
    mutateStatus,
  } = useOrdersStore(
    useShallow((s) => ({
      items: s.items,
      page: s.page,
      pageSize: s.pageSize,
      totalPages: s.totalPages,
      listStatus: s.listStatus,
      listError: s.listError,
      statusFilter: s.statusFilter,
      setPage: s.setPage,
      setPageSize: s.setPageSize,
      setStatusFilter: s.setStatusFilter,
      listOrders: s.listOrders,
      updateStatus: s.updateStatus,
      mutateStatus: s.mutateStatus,
    }))
  );

  useEffect(() => {
    listOrders({
      page: 1,
      pageSize,
      status: statusFilter,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function refresh() {
    listOrders({
      page,
      pageSize,
      status: statusFilter,
    });
  }
  function applyFilters() {
    setPage(1);
    listOrders({
      page: 1,
      pageSize,
      status: statusFilter,
    });
  }
  function changePage(n) {
    const nn = Math.max(1, Math.min(totalPages || 1, n));
    setPage(nn);
    listOrders({
      page: nn,
      pageSize,
      status: statusFilter,
    });
  }
  function changePageSize(ps) {
    setPageSize(ps);
    setPage(1);
    listOrders({
      page: 1,
      pageSize: ps,
      status: statusFilter,
    });
  }

  const pages = useMemo(() => {
    const total = Math.max(1, totalPages || 1);
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
      {/* Filters / Controls */}
      <div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <h2 className='text-base font-semibold'>Orders</h2>
        <div className='flex flex-wrap items-center gap-2'>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 shadow-sm'
            title='Filter by status'
          >
            <option value=''>All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={pageSize}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 shadow-sm'
            title='Page size'
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
            title='Apply filters'
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

      {/* Table */}
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
            No orders found.
          </div>
        ) : (
          <table className='w-full table-fixed border-separate border-spacing-y-2'>
            <thead>
              <tr className='text-left text-xs text-gray-600'>
                <th className='px-3 py-2'>Order</th>
                <th className='px-3 py-2'>Customer (ID)</th>
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
                    <div className='text-sm font-semibold'>{o.orderNumber}</div>
                    <div className='text-xs text-gray-500'>#{o.id}</div>
                  </td>

                  <td className='px-3 py-3 align-top text-sm text-gray-700'>
                    <div>
                      User ID: <span className='font-medium'>{o.userId}</span>
                    </div>
                  </td>

                  <td className='px-3 py-3 align-top text-sm text-gray-700'>
                    {new Date(o.createdAt).toLocaleString()}
                  </td>

                  <td className='px-3 py-3 align-top text-sm font-semibold'>
                    €{Number(o.total).toFixed(2)} {o.currency}
                  </td>

                  <td className='px-3 py-3 align-top'>
                    <div className='flex items-center gap-2'>
                      <StatusBadge value={o.status} />
                      <select
                        value={o.status}
                        disabled={mutateStatus === 'loading'}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className='rounded-xl border border-gray-200 bg-white px-2 py-1 text-xs outline-none focus:border-gray-300 shadow-sm'
                        title='Change status'
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  <td className='px-3 py-3 align-top'>
                    <div className='flex items-center justify-end'>
                      <Link
                        to={`/orders/${o.id}`}
                        className='inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm hover:bg-gray-100'
                        title='Open details'
                      >
                        <FiExternalLink className='h-4 w-4' />
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

      {/* Pagination */}
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
