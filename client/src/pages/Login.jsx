import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuthStore } from '../stores/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('dev@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState(null);
  const login = useAuthStore((s) => s.login);

  async function onSubmit(e) {
    e.preventDefault();
    // setError(null);
    try {
      await login({ email, password }, { mock: true });
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || 'Login failed');
    }
  }

  return (
    <Layout>
      <div className='mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm'>
        <h1 className='text-xl font-semibold'>Sign in</h1>
        <p className='mt-1 text-sm text-gray-600'>
          Don’t have an account?{' '}
          <Link to='/register' className='font-medium text-gray-900 underline'>
            Create one
          </Link>
        </p>

        <form onSubmit={onSubmit} className='mt-6 space-y-4'>
          <div>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-300 shadow-sm'
              required
            />
          </div>

          <div>
            <label className='text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-gray-300 shadow-sm'
              required
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
            Sign in
          </button>
        </form>
      </div>
    </Layout>
  );
}
