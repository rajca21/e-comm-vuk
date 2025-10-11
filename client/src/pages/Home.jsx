import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import {
  FiSmartphone,
  FiHeadphones,
  FiMonitor,
  FiArrowRight,
} from 'react-icons/fi';

export default function Home() {
  return (
    <Layout>
      <section className='relative isolate overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 py-24 sm:py-32'>
        <div
          className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.05),transparent_60%)]'
          aria-hidden='true'
        ></div>

        <div className='mx-auto max-w-5xl px-6 text-center'>
          <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl animate-fade-in-up'>
            Discover the Future of{' '}
            <span className='text-gray-700'>Tech Shopping</span>
          </h1>

          <p className='mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 animate-fade-in-up [animation-delay:200ms]'>
            Welcome to{' '}
            <span className='font-semibold text-gray-800'>Velora</span> — your
            trusted destination for premium electronics. Explore top devices,
            cutting-edge accessories, and everything you need to stay connected.
          </p>

          <div className='mt-10 flex justify-center animate-fade-in-up [animation-delay:400ms]'>
            <Link
              to='/products'
              className='inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-md hover:scale-105 hover:bg-gray-800 transition-all'
            >
              Browse Products
              <FiArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-6 py-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3'>
        {[
          {
            icon: <FiSmartphone className='h-7 w-7 text-gray-800' />,
            title: 'Smartphones & Tablets',
            desc: 'Discover the latest smartphones and tablets from leading brands.',
          },
          {
            icon: <FiHeadphones className='h-7 w-7 text-gray-800' />,
            title: 'Audio & Accessories',
            desc: 'Experience rich sound and comfort with our range of headphones and earbuds.',
          },
          {
            icon: <FiMonitor className='h-7 w-7 text-gray-800' />,
            title: 'Computers & Peripherals',
            desc: 'Explore laptops, monitors, keyboards, and other performance essentials.',
          },
        ].map((f, i) => (
          <div
            key={i}
            className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all text-center'
          >
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4'>
              {f.icon}
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>{f.title}</h3>
            <p className='mt-2 text-gray-600 text-sm leading-relaxed'>
              {f.desc}
            </p>
          </div>
        ))}
      </section>
    </Layout>
  );
}
