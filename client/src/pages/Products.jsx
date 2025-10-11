import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/products/ProductCard';
import { useProductsStore } from '../stores/products';

export default function Products() {
  const [params, setParams] = useSearchParams();

  const {
    items,
    status,
    page,
    pageSize,
    totalPages,
    setQuery,
    setPage,
    setPageSize,
    fetchList,
  } = useProductsStore();

  useEffect(() => {
    const q = params.get('q') || '';
    const p = Number(params.get('page') || 1);
    const ps = Number(params.get('pageSize') || 12);

    setQuery(q);
    setPage(p);
    setPageSize(ps);
    fetchList({ page: p, pageSize: ps, q });
  }, [params.toString()]);

  function goToPage(n) {
    const q = params.get('q') || '';
    const ps = Number(params.get('pageSize') || pageSize);
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    next.set('page', String(n));
    next.set('pageSize', String(ps));
    setParams(next, { replace: false });
  }

  function changePageSize(ps) {
    const q = params.get('q') || '';
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    next.set('page', '1');
    next.set('pageSize', String(ps));
    setParams(next, { replace: false });
  }

  const pages = useMemo(() => {
    const total = Math.max(1, totalPages || 1);
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <Layout>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <h1 className='text-lg font-semibold'>Products</h1>

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
      </div>

      {status === 'loading' && items.length === 0 ? (
        <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <p className='text-sm text-gray-600'>Loading products…</p>
        </div>
      ) : items.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-600'>
          No products found.
        </div>
      ) : (
        <>
          <section className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </section>

          {totalPages > 1 && (
            <div className='mt-6 flex items-center justify-center gap-1'>
              <button
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className='rounded-xl px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50'
              >
                Prev
              </button>

              {pages.map((n) => (
                <button
                  key={n}
                  onClick={() => goToPage(n)}
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
                onClick={() => goToPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className='rounded-xl px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-50'
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
