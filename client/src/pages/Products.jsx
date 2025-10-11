import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/products/ProductCard';
import { useProductsStore } from '../stores/products';

const CATEGORY_OPTIONS = [
  { value: '', label: 'All categories' },
  { value: 'phone', label: 'Phones' },
  { value: 'tablet', label: 'Tablets' },
  { value: 'mouse', label: 'Mice' },
  { value: 'keyboard', label: 'Keyboards' },
  { value: 'headphones', label: 'Headphones' },
  { value: 'earbuds', label: 'Earbuds' },
  { value: 'monitor', label: 'Monitors' },
  { value: 'power-bank', label: 'Power banks' },
  { value: 'smart-speaker', label: 'Smart speakers' },
];

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest' },
  { value: 'createdAt:asc', label: 'Oldest' },
  { value: 'price:asc', label: 'Price: low → high' },
  { value: 'price:desc', label: 'Price: high → low' },
  { value: 'name:asc', label: 'Name: A → Z' },
  { value: 'name:desc', label: 'Name: Z → A' },
];

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
    const category = params.get('category') || '';
    const sortBy = params.get('sortBy') || 'createdAt';
    const order = params.get('order') || 'desc';

    setQuery(q);
    setPage(p);
    setPageSize(ps);

    fetchList({ page: p, pageSize: ps, q, category, sortBy, order });
  }, [params.toString()]);

  function setParamObject(obj) {
    const next = new URLSearchParams();
    const q = params.get('q') || '';
    const pageV = obj.page ?? params.get('page') ?? '1';
    const pageSizeV =
      obj.pageSize ?? params.get('pageSize') ?? String(pageSize);
    const categoryV = obj.category ?? params.get('category') ?? '';
    const sortByV = obj.sortBy ?? params.get('sortBy') ?? 'createdAt';
    const orderV = obj.order ?? params.get('order') ?? 'desc';

    if (q) next.set('q', q);
    if (categoryV) next.set('category', categoryV);
    next.set('page', String(pageV));
    next.set('pageSize', String(pageSizeV));
    next.set('sortBy', String(sortByV));
    next.set('order', String(orderV));

    setParams(next, { replace: false });
  }

  function goToPage(n) {
    setParamObject({ page: n });
  }

  function changePageSize(ps) {
    setParamObject({ page: 1, pageSize: ps });
  }

  function changeCategory(cat) {
    setParamObject({ page: 1, category: cat || '' });
  }

  function changeSort(value) {
    const [sortBy, order] = value.split(':');
    setParamObject({ page: 1, sortBy, order });
  }

  const pages = useMemo(() => {
    const total = Math.max(1, totalPages || 1);
    return Array.from({ length: total }, (_, i) => i + 1);
  }, [totalPages]);

  const currentSort = `${params.get('sortBy') || 'createdAt'}:${
    params.get('order') || 'desc'
  }`;
  const currentCategory = params.get('category') || '';

  return (
    <Layout>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <h1 className='text-lg font-semibold'>Products</h1>

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <select
            value={currentCategory}
            onChange={(e) => changeCategory(e.target.value)}
            className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 shadow-sm'
            title='Category'
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={currentSort}
            onChange={(e) => changeSort(e.target.value)}
            className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 shadow-sm'
            title='Sort by'
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={pageSize}
            onChange={(e) => changePageSize(Number(e.target.value))}
            className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 shadow-sm'
            title='Items per page'
          >
            {[6, 12, 24, 36, 48].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
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
