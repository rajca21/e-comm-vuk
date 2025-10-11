import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SearchBar({ className = '' }) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);

  const [term, setTerm] = useState('');

  useEffect(() => {
    if (pathname.startsWith('/products')) {
      setTerm(params.get('q') || '');
    }
  }, [pathname, search]);

  function handleSubmit(e) {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <FiSearch className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
      <input
        type='text'
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder='Search products…'
        className='w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 py-2 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-300 focus:bg-white shadow-sm'
      />
    </form>
  );
}
