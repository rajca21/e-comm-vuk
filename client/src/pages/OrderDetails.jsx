import { useEffect, useMemo } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useOrdersStore } from '../stores/orders';
import { useAuthStore } from '../stores/auth';
import { useShallow } from 'zustand/react/shallow';

export default function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { status, user } = useAuthStore(
    useShallow((s) => ({ status: s.status, user: s.user }))
  );
  const isAuthed = status === 'authenticated';
  const isAdmin = user?.role === 'ADMIN';

  const {
    current,
    currentStatus,
    currentError,
    getOrder,
    clearCurrent,
    cancelOrder,
    mutateStatus,
  } = useOrdersStore(
    useShallow((s) => ({
      current: s.current,
      currentStatus: s.currentStatus,
      currentError: s.currentError,
      getOrder: s.getOrder,
      clearCurrent: s.clearCurrent,
      cancelOrder: s.cancelOrder,
      mutateStatus: s.mutateStatus,
    }))
  );

  useEffect(() => {
    if (isAuthed && id) getOrder(id);
    return () => clearCurrent();
  }, [id, isAuthed, getOrder, clearCurrent]);

  useEffect(() => {
    if (!current) return;
    const isOwner = current.userId === user?.id;
    if (!isOwner && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [current, user?.id, isAdmin, navigate]);

  const canCancel = useMemo(() => {
    if (!current) return false;
    const isOwner = current.userId === user?.id;
    return (isOwner || isAdmin) && current.status === 'PENDING';
  }, [current, user?.id, isAdmin]);

  async function handleCancel() {
    if (!canCancel) return;
    if (!confirm('Cancel this order?')) return;
    try {
      await cancelOrder(current.id);
    } catch (e) {
      alert(e?.message || 'Failed to cancel order');
    }
  }

  if (status === 'loading') {
    return (
      <Layout>
        <div className='rounded-2xl bg-white p-6 shadow-sm border border-gray-100'>
          <p className='text-sm text-gray-600'>Checking session…</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthed) {
    return (
      <Layout>
        <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <h1 className='text-lg font-semibold'>Order details</h1>
          <p className='mt-2 text-sm text-gray-700'>
            You need to sign in to view order details.
          </p>
          <div className='mt-4 flex gap-2'>
            <Link
              to='/login'
              state={{ from: location }}
              className='rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95'
            >
              Sign in
            </Link>
            <Link
              to='/register'
              state={{ from: location }}
              className='rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50'
            >
              Create account
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (currentStatus === 'loading') {
    return (
      <Layout>
        <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <p className='text-sm text-gray-600'>Loading order…</p>
        </div>
      </Layout>
    );
  }

  if (currentStatus === 'error') {
    return (
      <Layout>
        <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <p className='text-sm text-red-600'>
            {currentError || 'Failed to load order.'}
          </p>
          <Link
            to='/products'
            className='mt-3 inline-block rounded-xl px-3 py-2 text-sm hover:bg-gray-100'
          >
            Back to products
          </Link>
        </div>
      </Layout>
    );
  }

  if (!current) return <Layout />;

  return (
    <Layout>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>Order {current.orderNumber}</h1>
        <div className='flex items-center gap-2'>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={mutateStatus === 'loading'}
              className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50'
            >
              {mutateStatus === 'loading' ? 'Canceling…' : 'Cancel order'}
            </button>
          )}
          <Link
            to='/products'
            className='rounded-xl px-3 py-2 text-sm hover:bg-gray-100'
          >
            Continue shopping
          </Link>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-3'>
          {current.items.map((it) => (
            <div
              key={it.id}
              className='flex gap-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm'
            >
              <div className='h-20 w-20 overflow-hidden rounded-xl bg-gray-100'>
                {it.imageUrl ? (
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    className='h-full w-full object-cover'
                  />
                ) : null}
              </div>
              <div className='flex-1'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <h3 className='text-sm font-semibold'>{it.name}</h3>
                    <p className='mt-1 text-sm text-gray-600'>
                      Qty: {it.quantity} · €{Number(it.price).toFixed(2)}
                    </p>
                  </div>
                  <div className='text-sm font-semibold'>
                    €{(Number(it.price) * it.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <div className='text-sm text-gray-600'>Status</div>
          <div className='mt-1 text-base font-semibold'>{current.status}</div>

          <div className='mt-4 grid gap-1 text-sm text-gray-700'>
            <div>
              <span className='text-gray-500'>Name:</span>{' '}
              {current.shippingName}
            </div>
            <div>
              <span className='text-gray-500'>Address:</span>{' '}
              {current.shippingAddress1}
              {current.shippingAddress2 ? `, ${current.shippingAddress2}` : ''}
            </div>
            <div>
              <span className='text-gray-500'>City/ZIP:</span>{' '}
              {current.shippingCity}, {current.shippingZip}
            </div>
            <div>
              <span className='text-gray-500'>Country:</span>{' '}
              {current.shippingCountry}
            </div>
            {current.note && (
              <div>
                <span className='text-gray-500'>Note:</span> {current.note}
              </div>
            )}
          </div>

          <div className='mt-6 flex items-center justify-between text-sm'>
            <span className='text-gray-600'>Total</span>
            <span className='text-base font-semibold'>
              €{Number(current.total).toFixed(2)}
            </span>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
