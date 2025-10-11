import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuthStore } from '../stores/auth';

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.message || 'Registration failed');
    }
  }

  return (
    <Layout>
      <div className='mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm'>
        <h1 className='text-xl font-semibold'>Create account</h1>
        <p className='mt-1 text-sm text-gray-600'>
          Already have an account?{' '}
          <Link to='/login' className='font-medium text-gray-900 underline'>
            Sign in
          </Link>
        </p>

        <form onSubmit={onSubmit} className='mt-6 space-y-4'>
          <div>
            <label className='text-sm font-medium text-gray-700'>Name</label>
            <input
              type='text'
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className='mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-300 shadow-sm'
              required
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <input
              type='email'
              value={form.email}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
              className='mt-1 w-full rounded-XL border border-gray-200 px-3 py-2 outline-none focus:border-gray-300 shadow-sm'
              required
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              value={form.password}
              onChange={(e) =>
                setForm((s) => ({ ...s, password: e.target.value }))
              }
              className='mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-300 shadow-sm'
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className='rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700'>
              {error}
            </div>
          )}

          <button
            type='submit'
            className='w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95'
          >
            Create account
          </button>
        </form>
      </div>
    </Layout>
  );
}
