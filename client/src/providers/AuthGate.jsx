import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth';

export default function AuthGate({ children }) {
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    refresh();
  }, []);

  return children;
}
