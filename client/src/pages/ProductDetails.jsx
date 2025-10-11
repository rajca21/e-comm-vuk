import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useProductsStore } from '../stores/products';
import {
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiChevronRight,
} from 'react-icons/fi';

export default function ProductDetails() {
  const { id } = useParams();
  const { current, currentStatus, currentError, fetchOne, clearCurrent } =
    useProductsStore();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchOne(id);
    return () => clearCurrent();
  }, [id]);

  function dec() {
    setQty((n) => Math.max(1, n - 1));
  }
  function inc() {
    const max = Number(current?.stock ?? 999999);
    setQty((n) => Math.min(max, n + 1));
  }

  function addToCart() {
    console.log('Add to cart:', { productId: current?.id, qty });
    alert('Added to cart (demo)');
  }

  const loading = currentStatus === 'loading';
  const notFound = currentStatus === 'error' && currentError;

  return (
    <Layout>
      <nav className='mb-6 text-sm text-gray-600'>
        <Link to='/products' className='hover:underline'>
          Products
        </Link>
        <FiChevronRight className='mx-1 inline h-4 w-4 align-[-2px] text-gray-400' />
        <span className='text-gray-800 font-medium'>
          {current?.name || 'Details'}
        </span>
      </nav>

      {loading ? (
        <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <p className='text-sm text-gray-600'>Loading product…</p>
        </div>
      ) : notFound ? (
        <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <p className='text-sm text-red-600'>Failed to load product.</p>
        </div>
      ) : !current ? null : (
        <section className='grid gap-8 md:grid-cols-2'>
          <div className='rounded-2xl border border-gray-100 bg-white p-3 shadow-sm'>
            <div className='aspect-square w-full overflow-hidden rounded-xl bg-gray-100'>
              {current.imageUrl ? (
                <img
                  src={current.imageUrl}
                  alt={current.name}
                  className='h-full w-full object-cover'
                />
              ) : null}
            </div>
          </div>

          <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
            <div className='flex items-start justify-between gap-3'>
              <h1 className='text-xl font-semibold text-gray-900'>
                {current.name}
              </h1>
              {current.category && (
                <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700'>
                  {current.category}
                </span>
              )}
            </div>

            <p className='mt-3 text-gray-700'>{current.description || '—'}</p>

            <div className='mt-5 flex items-center gap-3'>
              <span className='text-2xl font-bold'>
                €{Number(current.price).toFixed(2)}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  current.stock > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {current.stock > 0
                  ? `In stock: ${current.stock}`
                  : 'Out of stock'}
              </span>
            </div>

            <div className='mt-6 flex items-center gap-3'>
              <div className='inline-flex items-center rounded-xl border border-gray-200 bg-white shadow-sm'>
                <button
                  onClick={dec}
                  className='p-2 hover:bg-gray-50 rounded-l-xl'
                  aria-label='Decrease'
                >
                  <FiMinus className='h-4 w-4' />
                </button>
                <input
                  type='number'
                  min={1}
                  max={current.stock ?? undefined}
                  value={qty}
                  onChange={(e) => {
                    const v = Math.max(1, Number(e.target.value) || 1);
                    const max = Number(current.stock ?? 999999);
                    setQty(Math.min(max, v));
                  }}
                  className='w-14 border-x border-gray-200 py-2 text-center outline-none'
                />
                <button
                  onClick={inc}
                  className='p-2 hover:bg-gray-50 rounded-r-xl'
                  aria-label='Increase'
                >
                  <FiPlus className='h-4 w-4' />
                </button>
              </div>

              <button
                onClick={addToCart}
                disabled={current.stock <= 0}
                className='inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow hover:opacity-95 disabled:opacity-50'
              >
                <FiShoppingCart className='h-5 w-5' />
                Add to cart
              </button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
