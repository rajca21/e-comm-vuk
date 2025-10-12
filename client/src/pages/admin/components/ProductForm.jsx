import { useEffect, useMemo, useState } from 'react';
import { FiX } from 'react-icons/fi';

const CATEGORY_SUGGESTIONS = [
  'Phones',
  'Tablets',
  'Laptops',
  'Monitors',
  'Headphones',
  'Keyboards',
  'Mice',
  'Audio',
  'Smart Home',
  'Accessories',
];

export default function ProductForm({
  title = 'New product',
  submitLabel = 'Create',
  initial = null,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'EUR',
    stock: 0,
    isActive: true,
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name ?? '',
        description: initial.description ?? '',
        price: initial.price ?? '',
        currency: initial.currency ?? 'EUR',
        stock: initial.stock ?? 0,
        isActive: initial.isActive ?? true,
        category: initial.category ?? '',
      });
      setPreview(initial.imageUrl || '');
      setImageFile(null);
    }
  }, [initial]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({
      ...s,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleImage(e) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  async function submit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      price: form.price === '' ? '' : Number(form.price),
      stock: Number(form.stock || 0),
      image: imageFile ?? undefined,
    };
    await onSubmit?.(payload);
  }

  const canSubmit = useMemo(
    () => form.name.trim() && String(form.price).trim(),
    [form]
  );

  return (
    <div className='fixed inset-0 z-[1100] grid place-items-center bg-black/30 p-4'>
      <div className='w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>{title}</h2>
          <button
            onClick={onCancel}
            className='rounded-xl p-2 hover:bg-gray-100'
            aria-label='Close dialog'
          >
            <FiX className='h-5 w-5' />
          </button>
        </div>

        <form onSubmit={submit} className='grid gap-4 md:grid-cols-2'>
          <div className='md:col-span-2'>
            <label className='text-sm font-medium text-gray-700'>Name *</label>
            <input
              name='name'
              value={form.name}
              onChange={handleChange}
              className='mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-300 shadow-sm'
              required
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700'>
              Price (€) *
            </label>
            <input
              type='number'
              step='0.01'
              min='0'
              name='price'
              value={form.price}
              onChange={handleChange}
              className='mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-300 shadow-sm'
              required
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700'>
              Currency
            </label>
            <input
              name='currency'
              value={form.currency}
              onChange={handleChange}
              className='mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-300 shadow-sm'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700'>Stock</label>
            <input
              type='number'
              min='0'
              name='stock'
              value={form.stock}
              onChange={handleChange}
              className='mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-300 shadow-sm'
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700'>
              Category
            </label>
            <input
              name='category'
              list='category-suggestions'
              value={form.category}
              onChange={handleChange}
              placeholder='e.g. Laptops'
              className='mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-300 shadow-sm'
            />
            <datalist id='category-suggestions'>
              {CATEGORY_SUGGESTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className='flex items-center gap-2'>
            <input
              id='isActive'
              type='checkbox'
              name='isActive'
              checked={form.isActive}
              onChange={handleChange}
              className='h-4 w-4 rounded border-gray-300'
            />
            <label
              htmlFor='isActive'
              className='text-sm font-medium text-gray-700'
            >
              Active
            </label>
          </div>

          <div className='md:col-span-2'>
            <label className='text-sm font-medium text-gray-700'>
              Description
            </label>
            <textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={4}
              className='mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-300 shadow-sm'
            />
          </div>

          <div className='md:col-span-2'>
            <label className='text-sm font-medium text-gray-700'>Image</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImage}
              className='mt-1 block w-full text-sm file:mr-3 file:rounded-xl file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-white hover:file:opacity-95'
            />
            {preview && (
              <div className='mt-3'>
                <img
                  src={preview}
                  alt='Preview'
                  className='h-32 w-32 rounded-xl object-cover shadow-sm'
                />
              </div>
            )}
          </div>

          <div className='md:col-span-2 mt-2 flex justify-end gap-2'>
            <button
              type='button'
              onClick={onCancel}
              className='rounded-xl px-4 py-2 text-sm hover:bg-gray-100'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={!canSubmit}
              className='rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95 disabled:opacity-50'
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
