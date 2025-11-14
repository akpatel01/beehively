import { Navigate, Outlet } from "react-router";
import { getCookie } from "~/utils/storage";

export default function ProtectedRoute() {
    const isAuthenticated = Boolean(getCookie("token"));

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
