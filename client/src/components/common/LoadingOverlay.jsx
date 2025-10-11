import { createPortal } from 'react-dom';

export default function LoadingOverlay({ show = false, label = 'Loading…' }) {
  if (!show) return null;

  return createPortal(
    <div
      className='fixed inset-0 z-[1000] grid place-items-center bg-black/20 backdrop-blur-[2px]'
      role='status'
      aria-live='polite'
      aria-busy='true'
    >
      <div className='flex flex-col items-center gap-3 rounded-2xl bg-white/90 p-5 shadow-lg'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent' />
        <p className='text-sm text-gray-700'>{label}</p>
      </div>
    </div>,
    document.body
  );
}
