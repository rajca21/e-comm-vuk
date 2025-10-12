import Layout from '../components/layout/Layout';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useOrdersStore } from '../stores/orders';
import { useState } from 'react';

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();

  const status = useAuthStore((s) => s.status);
  const isAuthed = status === 'authenticated';

  const { items, inc, dec, setQty, remove, clear } = useCartStore(
    useShallow((s) => ({
      items: s.items,
      inc: s.inc,
      dec: s.dec,
      setQty: s.setQty,
      remove: s.remove,
      clear: s.clear,
    }))
  );
  const subtotal = useCartStore((s) =>
    s.items.reduce((sum, it) => sum + Number(it.price) * it.quantity, 0)
  );

  const createOrder = useOrdersStore((s) => s.createOrder);
  const mutateStatus = useOrdersStore((s) => s.mutateStatus);

  const [ship, setShip] = useState({
    shippingName: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingZip: '',
    shippingCountry: '',
    note: '',
  });

  async function handleCheckout(e) {
    e.preventDefault();
    if (items.length === 0) return;

    const required = [
      'shippingName',
      'shippingAddress1',
      'shippingCity',
      'shippingZip',
      'shippingCountry',
    ];
    for (const k of required) {
      if (!ship[k]?.trim()) {
        alert('Please fill all required shipping fields.');
        return;
      }
    }

    try {
      const payload = {
        items: items.map((it) => ({ productId: it.id, quantity: it.quantity })),
        ...ship,
        currency: 'EUR',
      };
      const order = await createOrder(payload);
      clear();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      alert(err?.message || 'Checkout failed');
    }
  }

  return (
    <Layout>
      <h1 className='mb-4 text-lg font-semibold'>Your Cart</h1>

      {items.length === 0 ? (
        <div className='rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm'>
          <p className='text-sm text-gray-600'>Your cart is empty.</p>
          <Link
            to='/products'
            className='mt-4 inline-block rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95'
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2 space-y-3'>
            {items.map((it) => (
              <div
                key={it.id}
                className='flex gap-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm'
              >
                <div className='h-24 w-24 overflow-hidden rounded-xl bg-gray-100'>
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
                        €{Number(it.price).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(it.id)}
                      className='rounded-xl p-2 hover:bg-gray-100'
                      title='Remove'
                    >
                      <FiTrash2 className='h-5 w-5' />
                    </button>
                  </div>

                  <div className='mt-3 flex items-center gap-3'>
                    <div className='inline-flex items-center rounded-xl border border-gray-200 bg-white shadow-sm'>
                      <button
                        onClick={() => dec(it.id)}
                        className='p-2 hover:bg-gray-50 rounded-l-xl'
                        aria-label='Decrease'
                      >
                        <FiMinus className='h-4 w-4' />
                      </button>
                      <input
                        type='number'
                        min={1}
                        max={it.stock ?? undefined}
                        value={it.quantity}
                        onChange={(e) => setQty(it.id, e.target.value)}
                        className='w-14 border-x border-gray-200 py-2 text-center outline-none'
                      />
                      <button
                        onClick={() => inc(it.id)}
                        className='p-2 hover:bg-gray-50 rounded-r-xl'
                        aria-label='Increase'
                      >
                        <FiPlus className='h-4 w-4' />
                      </button>
                    </div>
                    {!!it.stock && (
                      <span className='text-xs text-gray-500'>
                        Stock: {it.stock}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
            <h2 className='text-base font-semibold'>Order Summary</h2>
            <div className='mt-4 flex items-center justify-between text-sm'>
              <span>Subtotal</span>
              <span className='font-semibold'>€{subtotal.toFixed(2)}</span>
            </div>

            {!isAuthed ? (
              <div className='mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4'>
                <p className='text-sm text-gray-700'>
                  To place your order, please sign in to your account.
                </p>
                <div className='mt-3 flex gap-2'>
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
            ) : (
              <form onSubmit={handleCheckout} className='mt-6 grid gap-3'>
                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>Full name *</label>
                  <input
                    className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300'
                    value={ship.shippingName}
                    onChange={(e) =>
                      setShip((s) => ({ ...s, shippingName: e.target.value }))
                    }
                  />
                </div>

                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>
                    Address line 1 *
                  </label>
                  <input
                    className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300'
                    value={ship.shippingAddress1}
                    onChange={(e) =>
                      setShip((s) => ({
                        ...s,
                        shippingAddress1: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>Address line 2</label>
                  <input
                    className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300'
                    value={ship.shippingAddress2}
                    onChange={(e) =>
                      setShip((s) => ({
                        ...s,
                        shippingAddress2: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div className='grid gap-2'>
                    <label className='text-sm font-medium'>City *</label>
                    <input
                      className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300'
                      value={ship.shippingCity}
                      onChange={(e) =>
                        setShip((s) => ({ ...s, shippingCity: e.target.value }))
                      }
                    />
                  </div>
                  <div className='grid gap-2'>
                    <label className='text-sm font-medium'>ZIP *</label>
                    <input
                      className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300'
                      value={ship.shippingZip}
                      onChange={(e) =>
                        setShip((s) => ({ ...s, shippingZip: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>Country *</label>
                  <input
                    className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300'
                    value={ship.shippingCountry}
                    onChange={(e) =>
                      setShip((s) => ({
                        ...s,
                        shippingCountry: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className='grid gap-2'>
                  <label className='text-sm font-medium'>Note</label>
                  <textarea
                    rows={3}
                    className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300'
                    value={ship.note}
                    onChange={(e) =>
                      setShip((s) => ({ ...s, note: e.target.value }))
                    }
                  />
                </div>

                <button
                  type='submit'
                  disabled={mutateStatus === 'loading'}
                  className='mt-2 w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 disabled:opacity-50'
                >
                  {mutateStatus === 'loading'
                    ? 'Placing order…'
                    : 'Place order'}
                </button>
              </form>
            )}

            <button
              onClick={clear}
              className='mt-6 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50'
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </Layout>
  );
}
