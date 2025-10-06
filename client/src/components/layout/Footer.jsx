import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className='mt-12 border-t border-gray-100 bg-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10'>
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <div className='mb-3 flex items-center gap-2'>
              <div className='h-8 w-8 rounded-2xl bg-gray-900 text-white grid place-items-center shadow'>
                V
              </div>
              <span className='text-lg font-semibold'>Velora</span>
            </div>
            <p className='text-sm text-gray-600'>
              A refined eCommerce experience with a focus on comfort, clarity,
              and trust.
            </p>
          </div>

          <div>
            <h4 className='mb-3 text-sm font-semibold text-gray-900'>
              Company
            </h4>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li>
                <Link to='/about' className='hover:text-gray-900'>
                  About
                </Link>
              </li>
              <li>
                <Link to='/careers' className='hover:text-gray-900'>
                  Careers
                </Link>
              </li>
              <li>
                <Link to='/contact' className='hover:text-gray-900'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='mb-3 text-sm font-semibold text-gray-900'>Help</h4>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li>
                <Link to='/shipping' className='hover:text-gray-900'>
                  Shipping
                </Link>
              </li>
              <li>
                <Link to='/returns' className='hover:text-gray-900'>
                  Returns
                </Link>
              </li>
              <li>
                <Link to='/faq' className='hover:text-gray-900'>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className='mb-3 text-sm font-semibold text-gray-900'>
              Stay in touch
            </h4>
            <form
              className='flex items-center gap-2'
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type='email'
                placeholder='Email address'
                className='w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-300 shadow-sm'
              />
              <button
                type='submit'
                className='whitespace-nowrap rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95'
              >
                Subscribe
              </button>
            </form>
            <div className='mt-4 flex items-center gap-3 text-gray-600'>
              <a
                href='#'
                aria-label='Facebook'
                className='rounded-xl p-2 hover:bg-gray-100'
              >
                <FiFacebook className='h-5 w-5' />
              </a>
              <a
                href='#'
                aria-label='Instagram'
                className='rounded-xl p-2 hover:bg-gray-100'
              >
                <FiInstagram className='h-5 w-5' />
              </a>
              <a
                href='#'
                aria-label='Twitter'
                className='rounded-xl p-2 hover:bg-gray-100'
              >
                <FiTwitter className='h-5 w-5' />
              </a>
            </div>
          </div>
        </div>

        <div className='mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 text-xs text-gray-500 sm:flex-row'>
          <p>© {new Date().getFullYear()} Velora. All rights reserved.</p>
          <div className='flex items-center gap-4'>
            <Link to='/privacy' className='hover:text-gray-700'>
              Privacy
            </Link>
            <Link to='/terms' className='hover:text-gray-700'>
              Terms
            </Link>
            <Link to='/cookies' className='hover:text-gray-700'>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
