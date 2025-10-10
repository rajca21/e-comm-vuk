import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth";

export default function ProtectedRoute() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="grid min-h-svh place-items-center">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-600">Checking access…</p>
        </div>
      </div>
    );
  }

  const isAuthed = status === "authenticated";
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
