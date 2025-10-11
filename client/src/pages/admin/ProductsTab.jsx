import { useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { useProductsStore } from '../../stores/products';
import ProductForm from './components/ProductForm';

export default function ProductsTab() {
  const {
    items,
    page,
    pageSize,
    totalPages,
    q,
    status,
    setQuery,
    setPage,
    setPageSize,
    fetchList,
    createProduct,
    updateProduct,
    deleteProduct,
    adminStatus,
  } = useProductsStore();

  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  function onSearch(e) {
    e.preventDefault();
    fetchList({ page: 1, q });
  }

  async function handleCreate(data) {
    await createProduct(data);
    setShowCreate(false);
    await fetchList({ page: 1 });
  }

  async function handleEdit(data) {
    await updateProduct(editItem.id, data);
    setEditItem(null);
    await fetchList({ page });
  }

  async function handleDelete(id) {
    await deleteProduct(id);
    setConfirmId(null);
    await fetchList({ page });
  }

  const isBusy = status === 'loading' || adminStatus === 'loading';

  const pagination = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= Math.max(1, totalPages || 1); i++) pages.push(i);
    return pages;
  }, [totalPages]);

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <form onSubmit={onSearch} className='relative max-w-md'>
          <FiSearch className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder='Search products…'
            value={q}
            onChange={(e) => setQuery(e.target.value)}
            className='w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 outline-none focus:border-gray-300 shadow-sm'
          />
        </form>

        <div className='flex items-center gap-2'>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(e.target.value);
              fetchList({ page: 1, pageSize: e.target.value });
            }}
            className='rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 shadow-sm'
          >
            {[6, 12, 24, 36, 48].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowCreate(true)}
            className='inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow hover:opacity-95'
          >
            <FiPlus className='h-4 w-4' /> New product
          </button>
        </div>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        {items.map((p) => (
          <div
            key={p.id}
            className='flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm'
          >
            <div className='h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100'>
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='grid h-full w-full place-items-center text-xs text-gray-400'>
                  no image
                </div>
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <div className='flex items-start justify-between gap-2'>
                <h3 className='truncate font-semibold'>{p.name}</h3>
                <span className='shrink-0 rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white shadow'>
                  €{Number(p.price).toFixed(2)}
                </span>
              </div>
              <p className='mt-1 line-clamp-2 text-sm text-gray-600'>
                {p.description || '—'}
              </p>
              <div className='mt-2 flex items-center gap-2 text-xs text-gray-600'>
                <span className='rounded-full bg-gray-100 px-2 py-0.5'>
                  Stock: {p.stock}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100'
                  }`}
                >
                  {p.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>

              <div className='mt-3 flex items-center gap-2'>
                <button
                  onClick={() => setEditItem(p)}
                  className='inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm hover:bg-gray-100'
                  title='Edit'
                >
                  <FiEdit2 className='h-4 w-4' /> Edit
                </button>
                <button
                  onClick={() => setConfirmId(p.id)}
                  className='inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm text-red-600 hover:bg-red-50'
                  title='Delete'
                >
                  <FiTrash2 className='h-4 w-4' /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pagination.length > 1 && (
        <div className='flex items-center justify-center gap-1'>
          {pagination.map((n) => (
            <button
              key={n}
              onClick={() => {
                setPage(n);
                fetchList({ page: n });
              }}
              className={`rounded-xl px-3 py-1.5 text-sm ${
                n === page
                  ? 'bg-gray-900 text-white shadow'
                  : 'hover:bg-gray-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {!isBusy && items.length === 0 && (
        <div className='rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-600'>
          No products yet. Click{' '}
          <span className='font-medium'>New product</span> to add one.
        </div>
      )}

      {showCreate && (
        <ProductForm
          title='Create product'
          submitLabel='Create'
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}

      {editItem && (
        <ProductForm
          title='Edit product'
          submitLabel='Save changes'
          initial={editItem}
          onSubmit={handleEdit}
          onCancel={() => setEditItem(null)}
        />
      )}

      {confirmId !== null && (
        <div className='fixed inset-0 z-[1100] grid place-items-center bg-black/30 p-4'>
          <div className='w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl'>
            <h3 className='text-base font-semibold'>Delete product</h3>
            <p className='mt-1 text-sm text-gray-600'>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className='mt-4 flex justify-end gap-2'>
              <button
                onClick={() => setConfirmId(null)}
                className='rounded-xl px-3 py-2 text-sm hover:bg-gray-100'
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                className='rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white shadow hover:opacity-95'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
