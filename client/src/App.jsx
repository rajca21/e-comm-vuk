import { Routes, Route, Navigate } from 'react-router-dom';

import AuthGate from './providers/AuthGate';
import AdminRoute from './routes/AdminRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import GuestRoute from './routes/GuestRoute';

import GlobalLoadingOverlay from './components/common/GlobalLoadingOverlay';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import OrderDetails from './pages/OrderDetails';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminDashboard from './pages/admin/AdminDashboard';
import UsersTab from './pages/admin/UsersTab';
import ProductsTab from './pages/admin/ProductsTab';
import OrdersTab from './pages/admin/OrdersTab';

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
      <GlobalLoadingOverlay />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<ProductDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/orders/:id' element={<OrderDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/orders/:id' element={<OrderDetails />} />
          <Route path='/account' element={<Account />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path='/admin' element={<AdminDashboard />}>
            <Route index element={<Navigate to='users' replace />} />
            <Route path='users' element={<UsersTab />} />
            <Route path='products' element={<ProductsTab />} />
            <Route path='orders' element={<OrdersTab />} />
          </Route>
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </AuthGate>
  );
}
