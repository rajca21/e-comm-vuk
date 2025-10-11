export default function ProductCard({ product }) {
  return (
    <article className='rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'>
      <div className='aspect-square w-full overflow-hidden rounded-xl bg-gray-100'>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className='h-full w-full object-cover'
          />
        ) : null}
      </div>

      <div className='mt-3'>
        <div className='mb-1 flex items-center justify-between gap-2'>
          <h3 className='text-sm font-semibold'>{product.name}</h3>
          {product.category && (
            <span className='shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700'>
              {product.category}
            </span>
          )}
        </div>

        <p className='line-clamp-2 text-sm text-gray-600'>
          {product.description || '—'}
        </p>

        <div className='mt-3 flex items-center justify-between'>
          <span className='text-base font-semibold'>
            €{Number(product.price).toFixed(2)}
          </span>
          <button className='rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95'>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
