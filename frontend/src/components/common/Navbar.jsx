import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const { itemCount } = useCart();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "font-semibold text-slate-900"
        : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}

        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          Food
          <span className="text-slate-500">Order</span>
        </Link>

        {/* Navigation */}

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/foods" className={navLinkClass}>
            Menu
          </NavLink>

          {user?.role === "customer" && (
            <>
              <NavLink to="/cart" className={navLinkClass}>
                <span className="flex items-center gap-2">
                  Cart
                  {itemCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white">
                      {itemCount}
                    </span>
                  )}
                </span>
              </NavLink>

              <NavLink to="/orders" className={navLinkClass}>
                Orders
              </NavLink>

              <NavLink to="/payments" className={navLinkClass}>
                Payments
              </NavLink>
            </>
          )}
        </nav>

        {/* Right */}

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 sm:block"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user.name}
                </p>

                <p className="text-xs capitalize text-slate-500">{user.role}</p>
              </div>

              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
                >
                  Admin
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
