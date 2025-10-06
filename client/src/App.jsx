import Layout from './components/layout/Layout';

export default function App() {
  return (
    <Layout>
      <section className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <article
            key={i}
            className='rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'
          >
            <div className='aspect-square w-full rounded-xl bg-gray-100' />
            <div className='mt-3'>
              <h3 className='text-sm font-semibold'>Product {i + 1}</h3>
              <p className='mt-1 text-sm text-gray-600'>
                A short description for layout preview.
              </p>
              <div className='mt-3 flex items-center justify-between'>
                <span className='text-base font-semibold'>
                  €{(29 + i).toFixed(2)}
                </span>
                <button className='rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95'>
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </Layout>
  );
}
