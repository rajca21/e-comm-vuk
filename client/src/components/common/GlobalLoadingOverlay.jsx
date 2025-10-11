import LoadingOverlay from './LoadingOverlay';
import { useAuthStore } from '../../stores/auth';
import { useProductsStore } from '../../stores/products';

export default function GlobalLoadingOverlay() {
  const authStatus = useAuthStore((s) => s.status);

  const listStatus = useProductsStore((s) => s.status);
  const currentStatus = useProductsStore((s) => s.currentStatus);
  const adminStatus = useProductsStore((s) => s.adminStatus);

  const isLoading =
    authStatus === 'loading' ||
    listStatus === 'loading' ||
    currentStatus === 'loading' ||
    adminStatus === 'loading';

  return <LoadingOverlay show={isLoading} />;
}
