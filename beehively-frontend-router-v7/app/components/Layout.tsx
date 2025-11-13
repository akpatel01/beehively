import { useLocation, useNavigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { getCookie, removeCookie } from "../utils/storage";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    updateToken();
    window.addEventListener("storage", updateToken);
    return () => {
      window.removeEventListener("storage", updateToken);
    };
  }, []);

  const updateToken = () => {
    setToken(getCookie("token") ?? null);
  };

  useEffect(() => {
    setToken(getCookie("token") ?? null);
  }, [location]);

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("user");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-200/40 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-200/40 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/70 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-xl group-hover:shadow-amber-500/40 transition-all">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 8v8l10 6 10-6V8L12 2zm8 14.5l-8 4.8-8-4.8V8.5l8-4.8 8 4.8v8z" />
                  <path d="M12 6l-4 2.5v5l4 2.5 4-2.5v-5L12 6zm2 6.5l-2 1.2-2-1.2v-2.5l2-1.2 2 1.2v2.5z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent hidden sm:block">
                Beehively
              </span>
            </button>

            {/* Nav buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                className={`px-4 sm:px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => navigate("/")}
              >
                Home
              </button>
              {token && (
                <button
                  className={`px-4 sm:px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive("/profile")
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
              )}
              {!token ? (
                <>
                  <button
                    className={`px-4 sm:px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive("/login")
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className={`px-4 sm:px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive("/signup")
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    onClick={() => navigate("/signup")}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <button
                  className="px-4 sm:px-5 py-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content - Full screen */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
