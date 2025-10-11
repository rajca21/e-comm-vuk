import Layout from '../components/layout/Layout';
import { useCartStore } from '../stores/cart';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

export default function Cart() {
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

            <button
              onClick={clear}
              className='mt-6 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50'
            >
              Clear cart
            </button>
            <button
              disabled={items.length === 0}
              className='mt-2 w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 disabled:opacity-50'
            >
              Checkout
            </button>
          </aside>
        </div>
      )}
    </Layout>
  );
}
