import { useEffect } from "react";
import { useAuthStore } from "../stores/auth";

export default function AuthGate({ children }) {
  const status = useAuthStore((s) => s.status);
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    refresh();
  }, []);

  if (status === "loading") {
    return (
      <div className="grid min-h-svh place-items-center">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-600">Loading session…</p>
        </div>
      </div>
    );
  }
  return children;
}
