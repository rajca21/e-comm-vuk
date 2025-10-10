import { Routes, Route } from 'react-router-dom';

import AuthGate from './providers/AuthGate';
import ProtectedRoute from './routes/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function NotFound() {
  return (
    <div className='grid min-h-svh place-items-center px-4'>
      <div className='rounded-2xl bg-white p-6 shadow-sm'>
        <h1 className='text-lg font-semibold'>404</h1>
        <p className='mt-1 text-sm text-gray-600'>Page not found.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthGate>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Home />} />
        </Route>

        {/* 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthGate>
  );
}
