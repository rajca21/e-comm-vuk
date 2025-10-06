import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className='flex min-h-svh flex-col bg-gradient-to-b from-white to-gray-50'>
      <Navbar />
      <main className='flex-1'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6'>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
