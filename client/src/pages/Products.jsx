import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/products/ProductCard';
import { useProductsStore } from '../stores/products';

export default function Products() {
  const [params] = useSearchParams();
  const { items, status, setQuery, setPage, setPageSize, fetchList } =
    useProductsStore();

  useEffect(() => {
    const q = params.get('q') || '';
    setQuery(q);
    setPage(1);
    setPageSize(12);
    fetchList({ page: 1, pageSize: 12, q });
  }, [params.toString()]);

  return (
    <Layout>
      <h1 className='mb-4 text-lg font-semibold'>Products</h1>

      {status === 'loading' && items.length === 0 ? (
        <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
          <p className='text-sm text-gray-600'>Loading products…</p>
        </div>
      ) : items.length === 0 ? (
        <div className='rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-600'>
          No products found.
        </div>
      ) : (
        <section className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      )}
    </Layout>
  );
}
